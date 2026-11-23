#!/usr/bin/env python3
"""Make the four fixed A4 handouts directly from the current worksheet source.

Install with `python -m pip install -r worksheet-requirements.txt` and install
the Noto CJK fonts on the rendering machine (Debian: fonts-noto-cjk).
Run `python generate-worksheets.py`, inspect the PDFs, then `node build.mjs`
to copy the refreshed assets into dist. This script never runs the site build.
It imports worksheetMarkup from learning.mjs, keeping the paper and web text
in one source and avoiding stale generated HTML.

WeasyPrint has no Japanese ruby layout. For these paper handouts only, ruby
readings and a few remaining difficult words use kana, leaving writing space.
The website continues to provide its original ruby and reading controls.
"""
from __future__ import annotations

import argparse
import html
import io
import json
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
    '確か': 'たしか', '動物': 'どうぶつ', '図鑑': 'ずかん',
    '農林水産省': 'のうりんすいさんしょう', '解説': 'かいせつ',
    '本文': 'ほんぶん', '要約': 'ようやく', '説明': 'せつめい',
    '線画': 'せんが', '一皿': 'ひとさら', '鶏もも': 'とりもも',
    '鶏': 'にわとり', '背中': 'せなか', '脂身': 'あぶらみ',
    '自由': 'じゆう', '空欄': 'くうらん', '欄': 'らん', '版': 'はん',
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


def source_sheets() -> dict:
    """Read only the exported paper markup, without writing any site output."""
    program = r"""
import {worksheetMarkup, worksheetFiles, worksheetVersion} from './learning.mjs';
import {species} from './edition.mjs';
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const typeset = value => value.split(/(<[^:]+:[^>]+>)/g).map(part => {
  const ruby = part.match(/^<([^:]+):([^>]+)>$/);
  return ruby ? '<ruby>'+escape(ruby[1])+'<rt>'+escape(ruby[2])+'</rt></ruby>' : escape(part);
}).join('');
const sheets = Object.fromEntries(Object.keys(worksheetFiles).map(slug => [slug, worksheetMarkup(slug,{typeset,species})]));
process.stdout.write(JSON.stringify({version:worksheetVersion,sheets}));
"""
    result = subprocess.run(['node', '--input-type=module', '-'], cwd=ROOT,
                            input=program, capture_output=True, text=True, check=True)
    payload = json.loads(result.stdout)
    if set(payload['sheets']) != set(HANDOUTS):
        raise ValueError('Worksheet source and the four public PDF names differ')
    return payload


def paper_html(slug: str, sheet: str) -> str:
    if len(re.findall(r'<section class="worksheet\b', sheet)) != 1:
        raise ValueError(f'{slug}: expected exactly one worksheet section')
    # Generated ruby is a single base followed by one <rt>, without nested tags.
    sheet = re.sub(r'<ruby>[^<]+<rt>([^<]+)</rt></ruby>', r'\1', sheet)
    if '<ruby' in sheet or '<rt' in sheet:
        raise ValueError(f'{slug}: unsupported ruby markup needs review')
    # Only replace text nodes, preserving links, ids and accessible attributes.
    parts = re.split(r'(<[^>]+>)', sheet)
    for i in range(0, len(parts), 2):
        for kanji, kana in sorted(KANA.items(), key=lambda item: -len(item[0])):
            parts[i] = parts[i].replace(kanji, kana)
    sheet = ''.join(parts)
    return ('<!doctype html><html lang="ja"><head><meta charset="utf-8">'
            f'<title>{html.escape(slug)} - Before We Eat</title>'
            '<meta name="author" content="MINA"></head>'
            '<body class="worksheet-page"><main><article>' + sheet +
            '</article></main></body></html>')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--skip-build', action='store_true',
                        help='Compatibility option; the source is read without a site build')
    parser.parse_args()
    source = source_sheets()
    # Screen-only CSS warnings do not affect the scoped print rules.
    logging.getLogger('weasyprint').setLevel(logging.ERROR)
    styles = [CSS(filename=ROOT / 'reading.css'), CSS(filename=ROOT / 'learning.css'), CSS(string=PRINT_FONT)]
    outputs = {}
    for slug, filename in HANDOUTS.items():
        document = HTML(string=paper_html(slug, source['sheets'][slug]), base_url=str(ROOT) + '/').render(
            stylesheets=styles)
        if len(document.pages) != 1:
            raise ValueError(f'{slug}: {len(document.pages)} pages; review layout')
        pdf = document.write_pdf()
        reader = PdfReader(io.BytesIO(pdf))
        page = reader.pages[0]
        width, height = float(page.mediabox.width), float(page.mediabox.height)
        if len(reader.pages) != 1 or abs(width - 595.276) > .1 or abs(height - 841.89) > .1:
            raise ValueError(f'{slug}: expected one A4 portrait page')
        text = page.extract_text() or ''
        if 'Before We Eat' not in text or source['version'] not in text:
            raise ValueError(f'{slug}: missing site name or version date')
        url = f'https://djnaoyaman.github.io/beforeweeat/{slug}.html'
        if url not in re.sub(r'\s+', '', text):
            raise ValueError(f'{slug}: missing full lesson URL')
        links = [annotation.get_object().get('/A', {}).get('/URI')
                 for annotation in page.get('/Annots', [])]
        if url not in links:
            raise ValueError(f'{slug}: missing clickable return link')
        outputs[filename] = pdf
    # Write only after every handout passes the one-page and paper-size checks.
    for filename, pdf in outputs.items():
        (ROOT / filename).write_bytes(pdf)
        print(f'{filename}: A4 portrait, 1 page, {len(pdf):,} bytes')


if __name__ == '__main__':
    main()
