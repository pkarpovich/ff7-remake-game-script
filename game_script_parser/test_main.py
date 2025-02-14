import json
import os
import tempfile
import pytest
from game_script_parser.main import FF7ScriptParser


class DummyParagraph:
    def __init__(self, text):
        self.text = text


class DummyDocument:
    def __init__(self, paragraphs):
        self.paragraphs = [DummyParagraph(text) for text in paragraphs]


@pytest.fixture
def parser(monkeypatch):
    monkeypatch.setattr("game_script_parser.main.Document", lambda file_path: DummyDocument([]))
    p = FF7ScriptParser("dummy")
    p.document = DummyDocument([])
    return p

@pytest.mark.parametrize("input_text, expected", [
    ("Глава 1 - Начало", {"number": 1, "title": "Начало"}),
    ("**** Глава 2 – Продолжение ****", {"number": 2, "title": "Продолжение"}),
    ("Некорректный заголовок", None),
])
def test_parse_chapter_header(parser, input_text, expected):
    assert parser.parse_chapter_header(input_text) == expected

@pytest.mark.parametrize("input_text, expected", [
    ("// Подглава 1 //", "Подглава 1"),
    (" // Подглава 2 // ", "Подглава 2"),
    ("Нет подглавы", None),
])
def test_parse_subchapter(parser, input_text, expected):
    assert parser.parse_subchapter(input_text) == expected

@pytest.mark.parametrize("input_text, expected", [
    ("(Винсент) - Что случилось?", {"character": "Винсент", "text": "Что случилось?"}),
    ("Некорректный диалог", None),
])
def test_parse_dialogue(parser, input_text, expected):
    assert parser.parse_dialogue(input_text) == expected

@pytest.mark.parametrize("paragraphs, expected", [
    (
        [
            "Глава 1 - Начало",
            "// Вступление //",
            "(Клауд) - Привет",
            "(Сефирот) - Прощай",
            "",
            "Глава 2 - Развитие",
            "// Первая сцена //",
            "(Тифа) - Как дела?"
        ],
        {
            "chapters": [
                {
                    "number": 1,
                    "title": "Начало",
                    "subchapters": [
                        {
                            "title": "Вступление",
                            "dialogues": [
                                {"character": "Клауд", "text": "Привет"},
                                {"character": "Сефирот", "text": "Прощай"}
                            ]
                        }
                    ]
                },
                {
                    "number": 2,
                    "title": "Развитие",
                    "subchapters": [
                        {
                            "title": "Первая сцена",
                            "dialogues": [
                                {"character": "Тифа", "text": "Как дела?"}
                            ]
                        }
                    ]
                }
            ]
        }
    ),
    (
        [
            "Глава 3 - Заключение",
            "// Финальная сцена //",
            "(Аэрит) - Прощай"
        ],
        {
            "chapters": [
                {
                    "number": 3,
                    "title": "Заключение",
                    "subchapters": [
                        {
                            "title": "Финальная сцена",
                            "dialogues": [
                                {"character": "Аэрит", "text": "Прощай"}
                            ]
                        }
                    ]
                }
            ]
        }
    )
])
def test_process_paragraph(parser, paragraphs, expected):
    parser.document = DummyDocument(paragraphs)
    result = parser.parse()
    assert result == expected

def test_save_to_json(parser):
    paragraphs = [
        "Глава 1 - Начало",
        "// Сцена 1 //",
        "(Клауд) - Привет"
    ]
    parser.document = DummyDocument(paragraphs)
    parser.parse()
    with tempfile.NamedTemporaryFile(mode="r+", delete=False, suffix=".json", encoding="utf-8") as tmp:
        tmp_path = tmp.name
    try:
        parser.save_to_json(tmp_path)
        with open(tmp_path, 'r', encoding="utf-8") as f:
            data = json.load(f)
        expected = {
            "chapters": [
                {
                    "number": 1,
                    "title": "Начало",
                    "subchapters": [
                        {
                            "title": "Сцена 1",
                            "dialogues": [
                                {"character": "Клауд", "text": "Привет"}
                            ]
                        }
                    ]
                }
            ]
        }
        assert data == expected
    finally:
        os.remove(tmp_path)