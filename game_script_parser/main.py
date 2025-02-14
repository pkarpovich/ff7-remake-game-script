import asyncio
import json
import re
import sys
from typing import Dict, Optional

from docx import Document


class FF7ScriptParser:
    CHAPTER_PATTERN = re.compile(r"\**\s*Глава\s+(\d+)\s*[-–]\s*(.+?)\s*\**$")
    SUBCHAPTER_PATTERN = re.compile(r"//\s*(.+?)\s*//")
    DIALOGUE_PATTERN = re.compile(r"\(([^)]+)\)\s*-\s*(.+)")

    def __init__(self, file_path: str):
        self.document = Document(file_path)
        self.script_data = {"chapters": []}
        self.current_chapter = None
        self.current_subchapter = None

    def parse_chapter_header(self, text: str) -> Optional[Dict]:
        match = self.CHAPTER_PATTERN.match(text.strip())
        if match:
            return {"number": int(match.group(1)), "title": match.group(2).strip()}

        return None

    def parse_subchapter(self, text: str) -> Optional[str]:
        match = self.SUBCHAPTER_PATTERN.match(text.strip())

        return match.group(1) if match else None

    def parse_dialogue(self, text: str) -> Optional[Dict]:
        match = self.DIALOGUE_PATTERN.match(text.strip())
        if match:
            return {"character": match.group(1), "text": match.group(2).strip()}

        return None

    def process_paragraph(self, text: str) -> None:
        if not text.strip():
            return

        chapter_info = self.parse_chapter_header(text)
        if chapter_info:
            self.current_chapter = {
                "number": chapter_info["number"],
                "title": chapter_info["title"],
                "subchapters": [],
            }
            self.script_data["chapters"].append(self.current_chapter)
            self.current_subchapter = None
            return

        subchapter_title = self.parse_subchapter(text)
        if subchapter_title:
            self.current_subchapter = {"title": subchapter_title, "dialogues": []}
            if not self.current_chapter:
                return

            self.current_chapter["subchapters"].append(self.current_subchapter)

        dialogue = self.parse_dialogue(text)
        if dialogue and self.current_subchapter:
            self.current_subchapter["dialogues"].append(dialogue)

    def parse(self) -> Dict:
        for paragraph in self.document.paragraphs:
            self.process_paragraph(paragraph.text)

        self.script_data["chapters"].sort(key=lambda x: x["number"])
        return self.script_data

    def save_to_json(self, output_path: str) -> None:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(self.script_data, f, ensure_ascii=False, indent=2)


async def run(input_file: str, output_file: str):
    parser = FF7ScriptParser(input_file)
    parser.parse()
    parser.save_to_json(output_file)

    print("Done parsing")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python main.py <input_file> <output_file>")
        sys.exit(1)

    input_filepath = sys.argv[1]
    output_filepath = sys.argv[2]
    asyncio.run(run(input_filepath, output_filepath))
