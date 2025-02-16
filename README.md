# FF7 Remake Script Parser

This repository includes two main components:

- **Web Application**: A web-based tool for reading and navigating the Final Fantasy VII Remake script. The application features a clean, responsive UI with dark mode support and customizable font sizing.
- **Parser Tool**: A command-line utility that converts the Final Fantasy VII Remake game script from Word documents into a structured JSON format.

## Features

- Clean and responsive user interface for script navigation.
- Dark mode support and adjustable font size.
- Structured data output from Word documents, including chapters, subchapters, and dialogues.

## Usage

```bash
python -m game_script_parser.main input.docx output.json
```

### Word Document Format

1. Chapters should be formatted as: `Chapter X - Chapter Title`
2. Subchapters are marked with: `// Subchapter Title //`
3. Dialogues should be written as: `(Character) - Dialogue text`

Example:
```
Chapter 1 - The Destruction of Mako Reactor 1

// Train Station //
(Cloud) - Mako... Never seen so much of it.
(Barret) - This is Mako Reactor 1.
```