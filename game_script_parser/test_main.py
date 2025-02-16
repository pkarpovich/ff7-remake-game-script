import json
import os
import tempfile
import pytest
from game_script_parser.main import FF7ScriptParser, CharacterId


class DummyParagraph:
    def __init__(self, text):
        self.text = text


class DummyDocument:
    def __init__(self, paragraphs):
        self.paragraphs = [DummyParagraph(text) for text in paragraphs]


@pytest.fixture
def parser(monkeypatch):
    monkeypatch.setattr(
        "game_script_parser.main.Document", lambda file_path: DummyDocument([])
    )
    p = FF7ScriptParser("dummy")
    p.document = DummyDocument([])
    return p


@pytest.mark.parametrize(
    "input_text, expected",
    [
        ("Глава 1 - Начало", {"id": "ch-00000000", "number": 1, "title": "Начало"}),
        (
            "**** Глава 2 – Продолжение ****",
            {"id": "ch-00000000", "number": 2, "title": "Продолжение"},
        ),
        ("Некорректный заголовок", None),
    ],
)
def test_parse_chapter_header(parser, input_text, expected, monkeypatch):
    if expected:
        monkeypatch.setattr(
            "game_script_parser.main.FF7ScriptParser.generate_id",
            lambda self, prefix: f"{prefix}-00000000",
        )
        result = parser.parse_chapter_header(input_text)
        assert result == expected
    else:
        assert parser.parse_chapter_header(input_text) is None


@pytest.mark.parametrize(
    "input_text, expected",
    [
        ("// Подглава 1 //", {"id": "sub-00000000", "title": "Подглава 1"}),
        (" // Подглава 2 // ", {"id": "sub-00000000", "title": "Подглава 2"}),
        ("Нет подглавы", None),
    ],
)
def test_parse_subchapter(parser, input_text, expected, monkeypatch):
    if expected:
        monkeypatch.setattr(
            "game_script_parser.main.FF7ScriptParser.generate_id",
            lambda self, prefix: f"{prefix}-00000000",
        )
        result = parser.parse_subchapter(input_text)
        assert result == expected
    else:
        assert parser.parse_subchapter(input_text) is None


@pytest.mark.parametrize(
    "input_text, expected",
    [
        (
            "(C) - Что случилось?",
            {
                "id": "dlg-00000000",
                "text": "Что случилось?",
                "character": {"id": CharacterId.CLOUD, "name": "C"},
            },
        ),
        ("Некорректный диалог", None),
    ],
)
def test_parse_dialogue(parser, input_text, expected, monkeypatch):
    if expected:
        monkeypatch.setattr(
            "game_script_parser.main.FF7ScriptParser.generate_id",
            lambda self, prefix: f"{prefix}-00000000",
        )
        result = parser.parse_dialogue(input_text)
        assert result == expected
    else:
        assert parser.parse_dialogue(input_text) is None


@pytest.mark.parametrize(
    "paragraphs, expected",
    [
        (
            [
                "Глава 1 - Начало",
                "// Вступление //",
                "(C) - Привет",
                "(T) - Прощай",
                "",
                "Глава 2 - Развитие",
                "// Первая сцена //",
                "(B) - Как дела?",
            ],
            {
                "chapters": [
                    {
                        "id": "ch-00000000",
                        "number": 1,
                        "title": "Начало",
                        "subchapters": [
                            {
                                "id": "sub-00000000",
                                "title": "Вступление",
                                "dialogues": [
                                    {
                                        "id": "dlg-00000000",
                                        "character": {
                                            "id": CharacterId.CLOUD,
                                            "name": "C",
                                        },
                                        "text": "Привет",
                                    },
                                    {
                                        "id": "dlg-00000000",
                                        "character": {
                                            "id": CharacterId.TIFA,
                                            "name": "T",
                                        },
                                        "text": "Прощай",
                                    },
                                ],
                            }
                        ],
                    },
                    {
                        "id": "ch-00000000",
                        "number": 2,
                        "title": "Развитие",
                        "subchapters": [
                            {
                                "id": "sub-00000000",
                                "title": "Первая сцена",
                                "dialogues": [
                                    {
                                        "id": "dlg-00000000",
                                        "character": {
                                            "id": CharacterId.BARRET,
                                            "name": "B",
                                        },
                                        "text": "Как дела?",
                                    }
                                ],
                            }
                        ],
                    },
                ],
                "characters": {
                    CharacterId.CLOUD: {"id": CharacterId.CLOUD, "names": ["C"]},
                    CharacterId.TIFA: {"id": CharacterId.TIFA, "names": ["T"]},
                    CharacterId.BARRET: {"id": CharacterId.BARRET, "names": ["B"]},
                },
            },
        )
    ],
)
def test_process_paragraph(parser, paragraphs, expected, monkeypatch):
    monkeypatch.setattr(
        "game_script_parser.main.FF7ScriptParser.generate_id",
        lambda self, prefix: f"{prefix}-00000000",
    )
    parser.document = DummyDocument(paragraphs)
    result = parser.parse()
    assert result == expected


def test_save_to_json(parser, monkeypatch):
    monkeypatch.setattr(
        "game_script_parser.main.FF7ScriptParser.generate_id",
        lambda self, prefix: f"{prefix}-00000000",
    )

    paragraphs = ["Глава 1 - Начало", "// Сцена 1 //", "(C) - Привет"]
    parser.document = DummyDocument(paragraphs)
    parser.parse()

    with tempfile.NamedTemporaryFile(
        mode="r+", delete=False, suffix=".json", encoding="utf-8"
    ) as tmp:
        tmp_path = tmp.name

    try:
        parser.save_to_json(tmp_path)
        with open(tmp_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        expected = {
            "chapters": [
                {
                    "id": "ch-00000000",
                    "number": 1,
                    "title": "Начало",
                    "subchapters": [
                        {
                            "id": "sub-00000000",
                            "title": "Сцена 1",
                            "dialogues": [
                                {
                                    "id": "dlg-00000000",
                                    "character": {"id": "CLOUD", "name": "C"},
                                    "text": "Привет",
                                }
                            ],
                        }
                    ],
                }
            ],
            "characters": {"CLOUD": {"id": "CLOUD", "names": ["C"]}},
        }
        assert data == expected
    finally:
        os.remove(tmp_path)
