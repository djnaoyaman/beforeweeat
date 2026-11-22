#!/usr/bin/env python3
"""Make the four fixed A4 handouts from the current generated worksheet HTML.

Install with `python -m pip install -r worksheet-requirements.txt` and install
the Noto CJK fonts on the rendering machine (Debian: fonts-noto-cjk).
Run `python generate-worksheets.py`, inspect the PDFs, then `node build.mjs`
to copy the refreshed assets into dist. The source of the handout text remains
learning.mjs; this script does not maintain a second copy of its lesson text.

WeasyPrint has no Japanese ruby layout. For these paper handouts only, ruby
readings and a few remaining difficult words use kana, leaving writing space.
The website continues to provide its original ruby and reading controls.
"""
from __future__ import annotations

import argparse
import html
import io
import logging
from pathlib import Path
import re
import subprocess

from pypdf import PdfReader
from weasyprint import CSS, HTML


ROOT = Path(__file__).resolve().parent
HANDOUTS = {
    'lesson-beef': 'worksheet-beef.pdf',
    'lesson-pork': 'worksheet-pork.pdf',
    'lesson-chicken': 'worksheet-chicken.pdf',
    'food-diary': 'worksheet-diary.pdf',
}
KANA = {
    '観察': 'かんさつ', '資料': 'しりょう', '必要': 'ひつよう',
    '点検': 'てんけん', '清潔': 'せいけつ', '対策': 'たいさく',
    '状態': 'じょうたい', '記録': 'きろく', '日付': 'ひづけ',
    '部位': 'ぶい', '実際': 'じっさい', '単位': 'たんい',
    '工夫': 'くふう', '理由': 'りゆう', '食事': 'しょくじ',
    '脚': 'あし', '背中': 'せなか', '豚汁': 'とんじる', '豚': 'ぶた',
    '確か': 'たしか',
}
PRINT_FONT = '''
@page { size: A4 portrait; margin: 12mm; }
:root { font-family: "Noto Sans CJK JP", sans-serif; }
.worksheet-page, .worksheet-page h2, .worksheet-page h3 {
  font-family: "Noto Sans CJK JP", sans-serif;
}
.worksheet-page .worksheet { color: #182d24; }
.worksheet-page .sheet-credit { color: #41473f; }
'''


def paper_html(slug: str) -> str:
    source = (ROOT / 'dist' / (slug + '.html')).read_text(encoding='utf-8')
    matches = re.findall(r'<section class="worksheet\b.*?</section>', source, re.S)
    if len(matches) != 1:
        raise ValueError(f'{slug}: expected exactly one worksheet section')
    sheet = matches[0]
    # Generated ruby is a single base followed by one <rt>, without nested tags.
    sheet = re.sub(r'<ruby>[^<]+<rt>([^<]+)</rt></ruby>', r'\1', sheet)
    if '<ruby' in sheet or '<rt' in sheet:
        raise ValueError(f'{slug}: unsupported ruby markup needs review')
    # Only replace text nodes, preserving links, ids and accessible attributes.
    parts = re.split(r'(<[^>]+>)', sheet)
    for i in range(0, len(parts), 2):
        for kanji, kana in KANA.items():
            parts[i] = parts[i].replace(kanji, kana)
    sheet = ''.join(parts)
    return ('<!doctype html><html lang="ja"><head><meta charset="utf-8">'
            f'<title>{html.escape(slug)} - Before We Eat</title></head>'
            '<body class="worksheet-page"><main><article>' + sheet +
            '</article></main></body></html>')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--skip-build', action='store_true',
                        help='Use an already current dist directory')
    args = parser.parse_args()
    if not args.skip_build:
        subprocess.run(['node', 'build.mjs'], cwd=ROOT, check=True)
    # Screen-only CSS warnings do not affect the scoped print rules.
    logging.getLogger('weasyprint').setLevel(logging.ERROR)
    styles = [CSS(filename=ROOT / 'reading.css'), CSS(string=PRINT_FONT)]
    outputs = {}
    for slug, filename in HANDOUTS.items():
        document = HTML(string=paper_html(slug), base_url=str(ROOT) + '/').render(
            stylesheets=styles)
        if len(document.pages) != 1:
            raise ValueError(f'{slug}: {len(document.pages)} pages; review layout')
        pdf = document.write_pdf()
        reader = PdfReader(io.BytesIO(pdf))
        page = reader.pages[0]
        width, height = float(page.mediabox.width), float(page.mediabox.height)
        if len(reader.pages) != 1 or abs(width - 595.276) > .1 or abs(height - 841.89) > .1:
            raise ValueError(f'{slug}: expected one A4 portrait page')
        if 'Before We Eat' not in (page.extract_text() or ''):
            raise ValueError(f'{slug}: missing handout footer')
        outputs[filename] = pdf
    # Write only after every handout passes the one-page and paper-size checks.
    for filename, pdf in outputs.items():
        (ROOT / filename).write_bytes(pdf)
        print(f'{filename}: A4 portrait, 1 page, {len(pdf):,} bytes')


if __name__ == '__main__':
    main()
