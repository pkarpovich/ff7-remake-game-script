import asyncio
import json
import re
import sys
from uuid import uuid4
from typing import Dict, Optional

from docx import Document
from .characters import CharacterId, CHARACTER_MAPPING


class FF7ScriptParser:
    CHAPTER_PATTERN = re.compile(r"\**\s*Глава\s+(\d+)\s*[-–]\s*(.+?)\s*\**$")
    SUBCHAPTER_PATTERN = re.compile(r"//\s*(.+?)\s*//")
    DIALOGUE_PATTERN = re.compile(r"\(([^)]+)\)\s*-\s*(.+)")

    def __init__(self, file_path: str):
        self.document = Document(file_path)
        self.script_data = {
            "chapters": [],
            "characters": {},
        }
        self.current_chapter = None
        self.current_subchapter = None

    @staticmethod
    def generate_id(prefix: str) -> str:
        return f"{prefix}-{str(uuid4())[:8]}"

    def normalize_character_name(self, name: str) -> tuple[CharacterId, str]:
        normalized_name = name.strip()
        character_id = CHARACTER_MAPPING.get(normalized_name, CharacterId.UNKNOWN)

        if character_id not in self.script_data["characters"]:
            self.script_data["characters"][character_id] = {
                "id": character_id,
                "names": set(),
            }

        self.script_data["characters"][character_id]["names"].add(normalized_name)

        return character_id

    def parse_chapter_header(self, text: str) -> Optional[Dict]:
        match = self.CHAPTER_PATTERN.match(text.strip())
        if match:
            return {
                "id": self.generate_id("ch"),
                "number": int(match.group(1)),
                "title": match.group(2).strip(),
            }

        return None

    def parse_subchapter(self, text: str) -> Optional[Dict]:
        match = self.SUBCHAPTER_PATTERN.match(text.strip())
        if match:
            return {"id": self.generate_id("sub"), "title": match.group(1)}

        return None

    def parse_dialogue(self, text: str) -> Optional[Dict]:
        match = self.DIALOGUE_PATTERN.match(text.strip())
        if match:
            character_id = self.normalize_character_name(match.group(1))
            return {
                "id": self.generate_id("dlg"),
                "text": match.group(2).strip(),
                "character": {
                    "id": character_id,
                    "name": match.group(1),
                },
            }

        return None

    def process_paragraph(self, text: str) -> None:
        if not text.strip():
            return

        chapter_info = self.parse_chapter_header(text)
        if chapter_info:
            self.current_chapter = {
                "id": chapter_info["id"],
                "number": chapter_info["number"],
                "title": chapter_info["title"],
                "subchapters": [],
            }
            self.script_data["chapters"].append(self.current_chapter)
            self.current_subchapter = None
            return

        subchapter_info = self.parse_subchapter(text)
        if subchapter_info:
            self.current_subchapter = {
                "id": subchapter_info["id"],
                "title": subchapter_info["title"],
                "dialogues": [],
            }
            if not self.current_chapter:
                return

            self.current_chapter["subchapters"].append(self.current_subchapter)
            return

        dialogue = self.parse_dialogue(text)
        if dialogue and self.current_subchapter:
            self.current_subchapter["dialogues"].append(dialogue)

    def parse(self) -> Dict:
        for paragraph in self.document.paragraphs:
            self.process_paragraph(paragraph.text)

        self.script_data["chapters"].sort(key=lambda x: x["number"])

        for character in self.script_data["characters"].values():
            character["names"] = list(character["names"])

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
