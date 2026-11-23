import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {publicationManifest, publicationRows, recipeSlugs, siteBase, legacyRedirectFiles} from './publication.mjs';
import {plateRecipes} from './plate-recipes.mjs';
import {fieldGroups} from './field-archive.mjs';
import {recipes, species} from './edition.mjs';
import {meatIronData, validateMeatIronData, calculateMeatIron} from './meat-iron.mjs';
import {readingRoutes} from './reading-routes.mjs';
import {lessonUnits, worksheetFiles, worksheetVersion} from './learning.mjs';
import {kanagawaStudy, henHousingSurvey} from './kanagawa-study.mjs';

// Static publication gate. PDF inspection uses the pypdf dependency already
// listed for worksheet generation; live UI checks are recorded separately.
const project = path.dirname(fileURLToPath(import.meta.url));
const folder = path.resolve(process.argv[2] || path.join(project, 'dist'));
assert.ok(fs.existsSync(folder), 'Build first with node build.mjs');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, entity => {
  if (/^&#x/i.test(entity)) return String.fromCodePoint(parseInt(entity.slice(3, -1), 16));
  if (entity.startsWith('&#')) return String.fromCodePoint(Number(entity.slice(2, -1)));
  return {'&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>'}[entity] ?? entity;
});
const text = value => decode(value.replace(/<rt\b[^>]*>[\s\S]*?<\/rt>/gi, ' ')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
const hasClass = (tag, name) => (tag.attrs.class || '').split(/\s+/).includes(name);

function inspectHtml(html) {
  const tags = [], stack = [], ids = new Set();
  const voids = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
  const markup = html.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<(?:script|style)\b[^>]*>)[\s\S]*?(<\/(?:script|style)>)/gi, '$1$2');
  for (const match of markup.matchAll(/<(\/?)([a-z][\w:-]*)\b([^>]*?)>/gi)) {
    const name = match[2].toLowerCase();
    if (match[1]) {
      const index = stack.findLastIndex(tag => tag.name === name);
      if (index >= 0) {
        stack[index].end = match.index;
        stack.length = index;
      }
      continue;
    }
    const attrs = {};
    for (const attr of match[3].matchAll(/([^\s=/'"<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attrs[attr[1].toLowerCase()] = decode(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    const tag = {name, attrs, ancestors: [...stack], contentStart: match.index + match[0].length};
    if (attrs.id) {
      check(!ids.has(attrs.id), 'Duplicate id: ' + attrs.id);
      ids.add(attrs.id);
    }
    tags.push(tag);
    if (!voids.has(name) && !match[3].endsWith('/')) stack.push(tag);
  }
  return {html, markup, tags, ids};
}

const membersOf = (doc, tag) => tag ? doc.tags.filter(child => child.ancestors.includes(tag)) : [];
const tagText = (doc, tag) => tag ? text(doc.markup.slice(tag.contentStart, tag.end ?? tag.contentStart)) : '';
const compactText = value => value.replace(/\s+/g, '');
const hidden = tag => [tag, ...tag.ancestors].some(parent => Object.hasOwn(parent.attrs, 'hidden') || parent.attrs['aria-hidden'] === 'true');

const files = fs.readdirSync(folder);
const expectedFiles = publicationManifest.map(page => page.file);
check(expectedFiles.length === 87, 'Keep the 87 established canonical pages');
check(legacyRedirectFiles.length === 1 && legacyRedirectFiles[0] === 'top.html', 'Declare the existing top.html redirect explicitly');
const allowedHtml = [...expectedFiles, '404.html', ...legacyRedirectFiles];
const actualPages = files.filter(file => file.endsWith('.html'));
check(new Set(allowedHtml).size === allowedHtml.length && actualPages.length === allowedHtml.length && allowedHtml.every(file => actualPages.includes(file)),
  'Generated HTML must contain exactly 87 canonical pages, 404.html and the declared legacy redirect (no missing or stale pages)');
const docs = new Map(files.filter(file => file.endsWith('.html')).map(file =>
  [file, inspectHtml(fs.readFileSync(path.join(folder, file), 'utf8'))]
));
const sitemap = fs.readFileSync(path.join(folder, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
check(sitemapUrls.length === publicationManifest.length && new Set(sitemapUrls).size === sitemapUrls.length &&
  publicationManifest.every(page => sitemapUrls.includes(page.url)), 'Sitemap and publication manifest differ');
for (const file of legacyRedirectFiles) {
  const doc = docs.get(file);
  check(Boolean(doc), file + ': legacy redirect missing');
  if (!doc) continue;
  check(doc.tags.some(tag => tag.name === 'meta' && tag.attrs.name === 'robots' && /(?:^|,)\s*noindex\b/.test(tag.attrs.content || '')), file + ': redirect must be noindex');
  check(doc.tags.some(tag => tag.name === 'link' && tag.attrs.rel === 'canonical' && tag.attrs.href === siteBase), file + ': canonical must point to the home page');
  const refresh = doc.tags.find(tag => tag.name === 'meta' && tag.attrs['http-equiv']?.toLowerCase() === 'refresh');
  const destination = refresh?.attrs.content?.match(/^\s*0\s*;\s*url\s*=\s*(.+)$/i)?.[1];
  let target = '';
  try { if (destination) target = new URL(destination, siteBase + file).href; } catch {}
  check(target === siteBase, file + ': refresh must point directly to the home page');
  check(doc.tags.some(tag => tag.name === 'a' && tag.attrs.href && new URL(tag.attrs.href, siteBase + file).href === siteBase), file + ': visible home link missing');
  check(!sitemapUrls.includes(siteBase + file), file + ': redirect must not become a canonical sitemap entry');
}

let checkedLinks = 0;
function checkLocalReference(from, value) {
  check(!/^javascript:/i.test(value), from + ': javascript URL');
  if (!value || /^(?:data|mailto|tel):/i.test(value)) return;
  let url;
  try { url = new URL(value, new URL(from === 'index.html' ? '' : from, siteBase)); }
  catch { check(false, from + ': invalid URL ' + value); return; }
  if (!url.href.startsWith(siteBase)) return;
  const relativePath = decodeURIComponent(url.pathname.slice(new URL(siteBase).pathname.length)) || 'index.html';
  const relative = relativePath.endsWith('/') ? relativePath + 'index.html' : relativePath;
  const target = path.resolve(folder, relative);
  check(target.startsWith(folder + path.sep), from + ': reference escapes output directory');
  check(fs.existsSync(target), from + ': missing reference ' + value);
  if (url.hash && docs.has(relative)) {
    const doc = docs.get(relative);
    const fragment = decodeURIComponent(url.hash.slice(1));
    const [animal, cut] = fragment.replace(/^plate-/, '').split('/');
    const atlasRoute = relative === 'cuts.html' && /^(?:plate-)?(?:cow|pig|hen)(?:\/[a-z-]+)?$/.test(fragment) &&
      doc.tags.some(tag => tag.attrs['data-animal'] === animal) &&
      (!cut || doc.tags.some(tag => tag.attrs['data-cut'] === cut &&
        tag.ancestors.some(parent => parent.attrs['data-animal'] === animal)));
    check(doc.ids.has(fragment) || atlasRoute, from + ': missing anchor or cut selection ' + value);
  }
  checkedLinks++;
}

const titles = new Set();
for (const page of publicationManifest) {
  const doc = docs.get(page.file);
  if (!doc) continue;
  const title = text(doc.html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  check(Boolean(title) && !titles.has(title), page.file + ': missing or duplicate title');
  titles.add(title);
  check(doc.tags.filter(tag => tag.name === 'h1').length === 1, page.file + ': expected one h1');
  check(doc.tags.some(tag => tag.name === 'link' && tag.attrs.rel === 'canonical' && tag.attrs.href === page.url), page.file + ': canonical mismatch');
  for (const key of ['description', 'robots', 'author', 'og:title', 'og:description', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:image']) {
    check(doc.tags.some(tag => tag.name === 'meta' && (tag.attrs.name === key || tag.attrs.property === key) && tag.attrs.content), page.file + ': missing ' + key);
  }
  const structured = [...doc.html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  check(structured.length > 0, page.file + ': missing JSON-LD');
  for (const match of structured) {
    try { JSON.parse(match[1]); } catch { check(false, page.file + ': invalid JSON-LD'); }
  }
}
for (const [file, doc] of docs) {
  for (const tag of doc.tags) {
    for (const attr of ['href', 'src']) if (Object.hasOwn(tag.attrs, attr)) checkLocalReference(file, tag.attrs[attr]);
    if (tag.name === 'img') check(Object.hasOwn(tag.attrs, 'alt'), file + ': image lacks alt');
  }
}
for (const file of files.filter(file => file.endsWith('.css'))) {
  for (const match of fs.readFileSync(path.join(folder, file), 'utf8').matchAll(/url\(\s*["']?([^\s"')]+)/g)) checkLocalReference(file, match[1]);
}
const webmanifest = JSON.parse(fs.readFileSync(path.join(folder, 'site.webmanifest'), 'utf8'));
for (const icon of webmanifest.icons || []) checkLocalReference('site.webmanifest', icon.src);

const catalogDoc = docs.get('start.html');
let catalog = [];
try { catalog = JSON.parse(catalogDoc.html.match(/<script id="catalog-data" type="application\/json">([^<]*)<\/script>/)[1]); }
catch { check(false, 'Missing or invalid search catalog'); }
const catalogUrls = new Set(catalog.map(item => item.url));
const fieldRecords = fieldGroups.flatMap(group => group.entries);
check(catalog.length === publicationRows.length - 1 + fieldRecords.length && catalogUrls.size === catalog.length, 'Search catalog is incomplete or duplicated');
for (const {slug} of publicationRows.filter(row => row.slug !== 'start')) {
  const url = slug + '.html';
  check(catalogUrls.has(url), 'Article missing from search: ' + url);
  check(catalogDoc.tags.some(tag => tag.name === 'a' && tag.attrs.href === url), 'Article missing from directory links: ' + url);
}
for (const entry of fieldRecords) check(catalogUrls.has('field-cases.html#record-' + entry.number), 'Record missing from search: ' + entry.number);
for (const item of catalog) checkLocalReference('start.html', item.url);
const normalize = vm.runInNewContext(fs.readFileSync(path.join(project, 'chapter-search.js'), 'utf8') + '\nnormalizeChapterSearch;', {
  document: {getElementById: () => null}
});
for (const [query, url] of [['ネック', 'beef-cuts.html'], ['せせり', 'chicken-guide.html'], ['予熱', 'plate-18.html'], ['ランプ', 'beef-cuts.html']]) {
  check(catalog.some(item => item.url === url && normalize([item.title, item.label, item.text].join(' ')).includes(normalize(query))), 'Search regression: ' + query + ' → ' + url);
}

check(plateRecipes.length === 30, 'Keep all 30 published plate recipes');
check(recipeSlugs.length === 36 && new Set(recipeSlugs).size === 36, 'Expected 36 stable recipe URLs');
const ironRecipeSlugs = Object.keys(meatIronData.recipes || {});
check(ironRecipeSlugs.length === recipeSlugs.length && recipeSlugs.every(slug => ironRecipeSlugs.includes(slug)),
  'Raw-meat iron data must cover exactly the 36 published recipes');
for (const error of validateMeatIronData(meatIronData)) check(false, 'Iron data: ' + error);
for (let number = 1; number <= 30; number++) check(plateRecipes.some(recipe => recipe.slug === 'plate-' + String(number).padStart(2, '0')), 'Missing stable plate URL ' + number);
for (const slug of recipeSlugs) {
  const recipe = plateRecipes.find(row => row.slug === slug) || recipes[slug];
  const doc = docs.get(slug + '.html');
  check(Boolean(recipe?.ingredients || recipe?.items), slug + ': ingredients missing');
  check(Array.isArray(recipe?.steps) && recipe.steps.length >= 3, slug + ': cooking steps missing');
  if (!doc) continue;
  const headings = [...doc.html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(match => text(match[1]));
  check(headings.some(heading => heading.startsWith('材料')) && headings.includes('作り方'), slug + ': rendered materials/steps missing');
  check(doc.tags.some(tag => tag.name === 'img' && tag.ancestors.some(parent => hasClass(parent, 'food-plate'))), slug + ': recipe photograph missing');
  check(docs.get('cooking.html').tags.some(tag => tag.name === 'a' && tag.attrs.href === slug + '.html'), slug + ': cooking gallery link missing');

  // Check the rendered contract against its declared data. Numerical/source
  // validation is also performed independently from the MEXT workbook.
  const iron = meatIronData.recipes[slug];
  check(Boolean(iron), slug + ': raw-meat iron data missing');
  if (!iron) continue;
  const sections = doc.tags.filter(tag => tag.name === 'section' && Object.hasOwn(tag.attrs, 'data-meat-iron'));
  check(sections.length === 1, slug + ': expected exactly one iron section');
  if (sections.length !== 1) continue;
  const section = sections[0], calculated = calculateMeatIron(slug);
  const members = doc.tags.filter(tag => tag.ancestors.includes(section));
  check(section.attrs['data-meat-iron'] === slug && section.attrs['data-iron-scope'] === 'raw-meat-only',
    slug + ': iron scope or recipe identifier mismatch');
  check(section.attrs['data-food-code'] === iron.foodCode &&
    Object.hasOwn(section.attrs, 'data-edible-grams') &&
    Number(section.attrs['data-edible-grams']) === calculated.edibleGrams,
  slug + ': iron food code or edible weight mismatch');
  const servingBlocks = members.filter(tag => hasClass(tag, 'meat-iron-serving'));
  check(servingBlocks.length === iron.servings.length, slug + ': iron serving choices missing or duplicated');
  const visibleAmounts = [...doc.html.matchAll(/<strong\b(?=[^>]*\bclass="[^"]*\bmeat-iron-value\b)[^>]*>([\s\S]*?)<\/strong>/g)]
    .map(match => text(match[1]).replace(/\s+/g, ''));
  check(visibleAmounts.length === calculated.portions.length, slug + ': visible iron amount missing');
  for (const [index, portion] of calculated.portions.entries()) {
    const blocks = servingBlocks.filter(tag => tag.attrs['data-servings'] === String(portion.servings));
    check(blocks.length === 1, slug + ': iron denominator missing or duplicated: ' + portion.servings);
    if (blocks.length !== 1) continue;
    const values = members.filter(tag => hasClass(tag, 'meat-iron-value') && tag.ancestors.includes(blocks[0]));
    const below = portion.ironMg > 0 && portion.displayMg === '0.0';
    const expected = below ? 'less-than-0.1' : portion.displayMg;
    check(values.length === 1 && values[0].attrs['data-iron-mg'] === expected,
      slug + ': iron amount differs from declared calculation for ' + portion.servings + ' servings');
    check(visibleAmounts[index]?.includes(below ? '0.1mg未満' : portion.displayMg + 'mg'),
      slug + ': visible iron text differs from amount');
  }
  check(members.some(tag => hasClass(tag, 'meat-iron-assumption') &&
    !tag.ancestors.some(parent => parent.name === 'details')), slug + ': calculation assumption must stay visible');
  check(members.some(tag => hasClass(tag, 'meat-iron-scope')), slug + ': visible raw-meat scope missing');
  check(members.some(tag => tag.name === 'details' && hasClass(tag, 'meat-iron-details')),
    slug + ': iron calculation details missing');
  check(members.some(tag => tag.name === 'a' && tag.attrs.href === meatIronData.foods[iron.foodCode].sourceUrl &&
    tag.ancestors.some(parent => hasClass(parent, 'meat-iron-details'))), slug + ': official iron source link missing');
}

const archive = docs.get('field-cases.html');
check(fieldRecords.length === 79, 'Keep all 79 field records');
for (let number = 1; number <= 79; number++) check(archive.ids.has('record-' + number), 'Missing stable field anchor: ' + number);
check(archive.tags.filter(tag => tag.name === 'details' && hasClass(tag, 'field-record')).length === 79, 'Expected 79 record disclosures');
const photoControl = archive.tags.find(tag => tag.attrs.id === 'show-field-photos');
check(photoControl?.attrs['aria-pressed'] === 'false', 'Field photos must start hidden');
check(archive.tags.some(tag => tag.name === 'a' && tag.attrs.href === '#field-archive'), 'Text-only entry is missing');
for (const tag of archive.tags.filter(tag => tag.name === 'img' && tag.attrs.src !== 'logo.webp')) {
  check(tag.ancestors.some(parent => parent.name === 'template'), 'Archive photograph can load before consent: ' + tag.attrs.src);
}
const sensitive = ['field-footpad.webp', 'field-tail-record.webp', 'field-camel-reference.webp'];
for (const source of sensitive) {
  const images = archive.tags.filter(tag => tag.name === 'img' && tag.attrs.src === source);
  check(images.length === 1 && images.every(tag => tag.ancestors.some(parent => parent.name === 'details' && hasClass(parent, 'evidence'))), 'Individual photo warning missing: ' + source);
}
check(archive.tags.filter(tag => tag.name === 'details' && hasClass(tag, 'evidence')).length === 3, 'Keep the three individual photo warnings');
for (const animal of Object.values(species)) {
  const guide = docs.get(animal.guide + '.html');
  check(guide && guide.tags.filter(tag => tag.name === 'dt').length === animal.cuts.length, animal.guide + ': cut guide is incomplete');
}

// The short paths remain optional and navigable from every stop, even on a
// direct visit. These checks inspect the published pages, not the renderer.
const lessonsDoc = docs.get('lessons.html');
check(readingRoutes.length === 3 && ['cow','pig','hen'].every(id => readingRoutes.some(route => route.id === id)),
  'Provide one short reading path for each of cow, pig and hen');
const routeStops = readingRoutes.flatMap(route => route.steps.map(step => step.slug));
check(routeStops.length === 9 && new Set(routeStops).size === 9, 'The three reading paths must retain their nine distinct article stops');
if (lessonsDoc) {
  const overview = lessonsDoc.tags.find(tag => tag.attrs.id === 'short-routes');
  const overviewMembers = membersOf(lessonsDoc, overview);
  check(Boolean(overview) && !hidden(overview), 'lessons: short paths must be visible without JavaScript');
  check(/全部を回らなくても|一つだけ|好きなところ/.test(compactText(tagText(lessonsDoc, overview))),
    'lessons: make the optional use of short paths explicit');
  for (const route of readingRoutes) {
    const card = overviewMembers.find(tag => tag.attrs.id === 'route-' + route.id);
    check(Boolean(card), 'lessons: missing ' + route.id + ' reading path');
    const descendants = membersOf(lessonsDoc, card);
    check(route.steps.length === 3 && recipeSlugs.includes(route.steps[0]?.slug), route.id + ': reading path must start with a published recipe');
    check(descendants.some(tag => tag.name === 'img' && tag.attrs.width && tag.attrs.height), route.id + ': recipe image and reserved dimensions missing');
    for (const step of route.steps) check(descendants.some(tag => tag.name === 'a' && tag.attrs.href === step.slug + '.html'), route.id + ': missing link to ' + step.slug);
  }
}
for (const route of readingRoutes) {
  for (const step of route.steps) {
    const doc = docs.get(step.slug + '.html');
    if (!doc) continue;
    const contexts = doc.tags.filter(tag => tag.attrs['data-reading-route'] === route.id);
    check(contexts.length === 1, step.slug + ': expected one contextual reading path');
    if (contexts.length !== 1) continue;
    const context = contexts[0], descendants = membersOf(doc, context);
    check(!hidden(context) && /ここ(?:まで|で).*?(?:おしまい|終え)/.test(compactText(tagText(doc, context))),
      step.slug + ': readers must be able to finish at this stop');
    check(descendants.filter(tag => tag.attrs['aria-current'] === 'page').length === 1, step.slug + ': reading path current location missing');
    for (const other of route.steps.filter(item => item.slug !== step.slug)) {
      check(descendants.some(tag => tag.name === 'a' && tag.attrs.href === other.slug + '.html' && !hidden(tag)),
        step.slug + ': missing optional route link to ' + other.slug);
    }
    check(!descendants.some(tag => ['form','input','textarea'].includes(tag.name)), step.slug + ': reading path must not require a submitted answer');
  }
}

const obligatoryLessonPhrases = /確かめられる問いを一つつくる|調べられる問いになったか|シート3に問いを書き|問いを決める/;
check(Object.keys(lessonUnits).length === 3, 'Keep the three animal lesson units');
for (const slug of Object.keys(lessonUnits)) {
  const doc = docs.get(slug + '.html');
  if (!doc) continue;
  check(!obligatoryLessonPhrases.test(compactText(text(doc.html))), slug + ': a superseded compulsory question objective has returned');
  for (const id of ['five-min','forty-five','materials','teacher-notes','worksheet']) check(doc.ids.has(id), slug + ': missing lesson format or material ' + id);
  const notes = doc.tags.find(tag => tag.attrs.id === 'teacher-notes');
  const noteText = compactText(tagText(doc, notes));
  check(/質問/.test(noteText) && /報告/.test(noteText) && /達成条件にしません|任意/.test(noteText), slug + ': optional questions/reports must be explicit in teacher guidance');
  const sheet = doc.tags.find(tag => tag.attrs.id === 'worksheet');
  check(/読むだけでも/.test(compactText(tagText(doc, sheet))) && /書きたいところだけ|好きな欄/.test(compactText(tagText(doc, sheet))), slug + ': worksheet use must remain optional');
}
const diaryDoc = docs.get('food-diary.html');
if (diaryDoc) {
  const diary = compactText(text(diaryDoc.html));
  check(/使いたい日だけ/.test(diary) && /1日分(?:だけ)?でも/.test(diary), 'food-diary: one-day and optional-day use must remain possible');
  check(!/7日を見返して、家族と話そう|毎日一皿だけ選び、7日間/.test(diary), 'food-diary: an old compulsory daily/reporting instruction has returned');
}

// Inspect the actual PDFs. Existence, a %PDF signature and an HTML download
// link alone do not prove that paper readers can return to the right lesson.
check(Object.keys(worksheetFiles).length === 4 && new Set(Object.values(worksheetFiles)).size === 4, 'Keep the four stable worksheet PDF URLs');
const pdfRequests = Object.entries(worksheetFiles).map(([slug, file]) => ({slug, file, url: siteBase + slug + '.html'}));
for (const {slug, file} of pdfRequests) {
  const doc = docs.get(slug + '.html');
  check(fs.existsSync(path.join(folder, file)), file + ': published worksheet missing');
  check(doc?.tags.some(tag => tag.name === 'a' && tag.attrs.href === file), slug + ': PDF link missing');
}
let checkedPdfs = 0;
const pdfScript = String.raw`
import json, re, sys
from pathlib import Path
from pypdf import PdfReader
folder, version, requests = Path(sys.argv[1]), sys.argv[2], json.loads(sys.argv[3])
results = []
for item in requests:
    errors = []
    try:
        reader = PdfReader(folder / item['file'])
        if len(reader.pages) != 1:
            errors.append('expected one page')
        page = reader.pages[0]
        if abs(float(page.mediabox.width)-595.276)>.1 or abs(float(page.mediabox.height)-841.89)>.1:
            errors.append('expected A4 portrait')
        text = re.sub(r'\s+', '', ''.join(p.extract_text() or '' for p in reader.pages))
        for label, required in [('site','BeforeWeEat'), ('author','MINA'), ('version',version), ('return URL',item['url']), ('optional reading','読むだけでも')]:
            if required not in text:
                errors.append('missing '+label)
        links = []
        for annotation in page.get('/Annots', []):
            action = annotation.get_object().get('/A')
            if action:
                links.append(action.get_object().get('/URI'))
        if item['url'] not in links:
            errors.append('missing clickable lesson return link')
    except Exception as exc:
        errors.append(str(exc))
    results.append({'file':item['file'], 'errors':errors})
print(json.dumps(results,ensure_ascii=False))
`;
const pdfCheck = spawnSync(process.env.CODEX_PRIMARY_RUNTIME_PYTHON || 'python3', ['-c', pdfScript, folder, worksheetVersion, JSON.stringify(pdfRequests)], {encoding:'utf8', maxBuffer:1024*1024});
if (pdfCheck.error || pdfCheck.status !== 0) {
  check(false, 'PDF inspection could not run; install worksheet-requirements.txt for Python. ' + (pdfCheck.error?.message || pdfCheck.stderr?.trim() || 'unknown failure'));
} else {
  try {
    const reports = JSON.parse(pdfCheck.stdout);
    check(reports.length === 4, 'PDF inspection must return all four handouts');
    for (const report of reports) {
      for (const error of report.errors) check(false, report.file + ': ' + error);
      if (!report.errors.length) checkedPdfs++;
    }
  } catch { check(false, 'PDF inspection returned invalid results'); }
}

// The full recipe set is server-rendered; filtering adds convenience without
// withholding recipes from readers who have JavaScript disabled.
const cookingDoc = docs.get('cooking.html');
const finder = cookingDoc?.tags.find(tag => Object.hasOwn(tag.attrs, 'data-recipe-finder'));
const finderMembers = cookingDoc ? membersOf(cookingDoc, finder) : [];
const recipeCards = finderMembers.filter(tag => Object.hasOwn(tag.attrs, 'data-recipe-card'));
const cardSlugs = recipeCards.map(tag => tag.attrs['data-recipe-slug']);
check(Boolean(finder) && recipeCards.length === 36 && new Set(cardSlugs).size === 36 && recipeSlugs.every(slug => cardSlugs.includes(slug)),
  'cooking: render all 36 recipe cards exactly once before JavaScript');
const validAnimals = ['cow','pig','hen'], validMethods = ['roast','simmer','fry','stir','steam','mix'];
for (const card of recipeCards) {
  const slug = card.attrs['data-recipe-slug'], descendants = membersOf(cookingDoc, card);
  check(!hidden(card) && !card.ancestors.some(tag => tag.name === 'template'), slug + ': recipe must be available in the static gallery');
  const animal = card.attrs['data-recipe-animal'], methods = (card.attrs['data-recipe-methods'] || '').split(/\s+/).filter(Boolean);
  check(validAnimals.includes(animal) && methods.length > 0 && new Set(methods).size === methods.length && methods.every(method => validMethods.includes(method)), slug + ': invalid animal/method filter metadata');
  const recipe = plateRecipes.find(item => item.slug === slug) || recipes[slug];
  const firstIngredient = (recipe?.ingredients || recipe?.items || '').split('、')[0];
  const expectedAnimal = /牛/.test(firstIngredient) ? 'cow' : /豚|ぶた/.test(firstIngredient) ? 'pig' : /鶏|砂肝|ささみ/.test(firstIngredient) ? 'hen' : '';
  check(expectedAnimal && animal === expectedAnimal, slug + ': animal filter conflicts with the meat ingredient');
  check(descendants.some(tag => tag.name === 'a' && tag.attrs.href === slug + '.html') && descendants.some(tag => tag.name === 'img'), slug + ': static recipe photograph or link missing');
  check(descendants.some(tag => tag.name === 'h3') && descendants.filter(tag => tag.name === 'p').some(tag => tagText(cookingDoc, tag).length >= 15), slug + ': recipe introduction missing');
}
for (const animal of validAnimals) check(recipeCards.some(card => card.attrs['data-recipe-animal'] === animal), 'cooking: animal missing from recipes: ' + animal);
const filterButtons = finderMembers.filter(tag => tag.name === 'button' && tag.attrs['data-recipe-filter']);
for (const [kind, values] of [['animal',validAnimals], ['method',validMethods]]) {
  const buttons = filterButtons.filter(tag => tag.attrs['data-recipe-filter'] === kind);
  check(buttons.length === values.length + 1 && ['all',...values].every(value => buttons.some(tag => tag.attrs['data-filter-value'] === value)), 'cooking: incomplete ' + kind + ' filter options');
  check(buttons.filter(tag => tag.attrs['aria-pressed'] === 'true').length === 1 && buttons.some(tag => tag.attrs['data-filter-value'] === 'all' && tag.attrs['aria-pressed'] === 'true'), 'cooking: initial ' + kind + ' selection must be all');
  check(buttons.every(tag => tag.attrs['aria-controls'] === 'recipe-results'), 'cooking: filters must identify their result region');
}
check(finderMembers.some(tag => Object.hasOwn(tag.attrs,'data-recipe-status') && tag.attrs.role === 'status' && tag.attrs['aria-live'] === 'polite'), 'cooking: accessible result count missing');
check(cookingDoc?.tags.some(tag => tag.name === 'script' && /^recipe-finder\.js(?:\?|$)/.test(tag.attrs.src || '') && Object.hasOwn(tag.attrs,'defer')), 'cooking: recipe filter script must be loaded with defer');

// Exercise representative combinations against the shipped script and actual
// rendered metadata. This catches an OR/AND regression, an empty result trap,
// and a broken reset without claiming a browser or touch-device test.
let filterScenarioChecks = 0;
try {
  function element(attrs={}) {
    const attributes={...attrs}, listeners={};
    return {dataset:Object.fromEntries(Object.entries(attrs).filter(([name])=>name.startsWith('data-')).map(([name,value])=>[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),value])), hidden:Object.hasOwn(attrs,'hidden'), textContent:'',
      setAttribute:(name,value)=>{attributes[name]=String(value);}, getAttribute:name=>attributes[name],
      addEventListener:(type,callback)=>{listeners[type]=callback;}, click:()=>listeners.click?.()};
  }
  const cards=recipeCards.map(tag=>element(tag.attrs)), buttons=filterButtons.map(tag=>element(tag.attrs));
  const controls=element({hidden:''}), status=element(), empty=element({hidden:''}), clear=element();
  const stubFinder={querySelector:selector=>({'[data-recipe-controls]':controls,'[data-recipe-status]':status,'[data-recipe-empty]':empty,'[data-recipe-clear]':clear}[selector] || null),querySelectorAll:selector=>selector==='[data-recipe-card]'?cards:selector==='[data-recipe-filter]'?buttons:[]};
  vm.runInNewContext(fs.readFileSync(path.join(folder,'recipe-finder.js'),'utf8'), {document:{querySelectorAll:selector=>selector==='[data-recipe-finder]'?[stubFinder]:[]}}, {timeout:1000});
  const visible=()=>cards.filter(card=>!card.hidden).map(card=>card.dataset.recipeSlug).sort();
  const choose=(kind,value)=>{const button=buttons.find(button=>button.dataset.recipeFilter===kind&&button.dataset.filterValue===value);if(!button)throw new Error('Missing '+kind+' '+value);button.click();};
  const scenario=(condition,message)=>{filterScenarioChecks++;check(condition,'Recipe filter behavior: '+message);};
  scenario(!controls.hidden&&visible().length===36,'setup must show controls and retain all recipes');
  choose('animal','hen');choose('method','steam');
  scenario(JSON.stringify(visible())===JSON.stringify(['plate-08','plate-09']),'hen + steam should show the two steamed chicken dishes');
  choose('animal','pig');choose('method','fry');
  scenario(JSON.stringify(visible())===JSON.stringify(['plate-14','pork-cutlet']),'pig + fry should show both pork cutlets');
  choose('animal','cow');choose('method','steam');
  scenario(visible().length===0&&!empty.hidden&&/0品/.test(status.textContent),'an empty combination must explain that no dishes match');
  clear.click();
  const selected=buttons.filter(button=>button.getAttribute('aria-pressed')==='true');
  scenario(visible().length===36&&empty.hidden&&selected.length===2&&selected.every(button=>button.dataset.filterValue==='all'),'reset must restore every recipe and both all selections');
} catch (error) { check(false,'Recipe filter behavior could not be checked: '+error.message); }

// Chapter introductions keep every article reachable with a reason to read it.
for (const slug of ['shopping','people','sources','cuts']) {
  const doc=docs.get(slug+'.html');
  if(!doc)continue;
  const cards=doc.tags.filter(tag=>Object.hasOwn(tag.attrs,'data-directory-slug'));
  check(cards.length>0,slug+': editorial chapter previews missing');
  const descriptions=[];
  for(const card of cards){
    const target=card.attrs['data-directory-slug'], descendants=membersOf(doc,card);
    check(descendants.some(tag=>tag.name==='a'&&tag.attrs.href===target+'.html'),slug+': preview link does not match '+target);
    check(descendants.some(tag=>tag.name==='img'||tag.name==='svg')&&descendants.some(tag=>tag.name==='h3'),slug+': preview needs an illustration and heading for '+target);
    const copy=descendants.find(tag=>hasClass(tag,'chapter-story-copy'));
    const paragraphs=membersOf(doc,copy).filter(tag=>tag.name==='p'&&!hasClass(tag,'chapter-story-kicker'));
    const introduction=compactText(paragraphs.map(tag=>tagText(doc,tag)).join(''));
    check(introduction.length>=15,slug+': missing individual introduction for '+target);
    descriptions.push(introduction);
  }
  check(new Set(descriptions).size===descriptions.length,slug+': chapter previews repeat the same introduction');
  check(doc.tags.some(tag=>hasClass(tag,'chapter-directory-intro')&&tagText(doc,tag).length>=15),slug+': chapter-specific opening missing');
  check(!doc.tags.some(tag=>hasClass(tag,'story-list')),slug+': old text-only chapter listing has returned');
  if(slug!=='cuts'){
    const row=publicationRows.find(row=>row.slug===slug);
    const expected=publicationRows.filter(item=>item.group===row.group&&item.slug!==slug).map(item=>item.slug);
    check(expected.every(target=>cards.some(card=>card.attrs['data-directory-slug']===target)),slug+': chapter article was lost during directory redesign');
  } else {
    const group=publicationRows.find(row=>row.slug==='cuts').group;
    const guides=new Set(Object.values(species).map(animal=>animal.guide));
    const expected=publicationRows.filter(row=>row.group===group&&row.slug!=='cuts'&&!guides.has(row.slug));
    check(expected.every(row=>cards.some(card=>card.attrs['data-directory-slug']===row.slug)), 'cuts: a part or nutrition article was lost from the reading directory');
  }
}
if(lessonsDoc){
  const row=publicationRows.find(row=>row.slug==='lessons');
  for(const item of publicationRows.filter(item=>item.group===row.group&&item.slug!=='lessons')){
    const link=lessonsDoc.tags.find(tag=>tag.name==='a'&&tag.attrs.href===item.slug+'.html'&&tag.ancestors.some(parent=>hasClass(parent,'lesson-editorial-list')||hasClass(parent,'learning-family')));
    check(Boolean(link),'lessons: contextual introduction missing for '+item.slug);
    if(link){
      const container=link.ancestors.findLast(tag=>['div','section'].includes(tag.name));
      check(membersOf(lessonsDoc,container).some(tag=>tag.name==='p'&&tagText(lessonsDoc,tag).length>=15),'lessons: reading reason missing for '+item.slug);
    }
  }
  check(!lessonsDoc.tags.some(tag=>hasClass(tag,'story-list')),'lessons: redundant text-only chapter listing has returned');
}

// Shared research has three distinct editorial roles. The national survey is
// separate and must retain the recorded 408-response denominator, not birds.
const studyRoles=['hens','people','rest-questions'];
const studyBodies=[];
for(const slug of studyRoles){
  const doc=docs.get(slug+'.html');
  if(!doc)continue;
  const studies=doc.tags.filter(tag=>tag.attrs['data-study']===kanagawaStudy.id);
  check(studies.length===1&&studies[0]?.attrs['data-study-role']===slug,slug+': expected one study section for its reading role');
  if(studies.length!==1)continue;
  const study=studies[0], descendants=membersOf(doc,study), body=compactText(tagText(doc,study));
  studyBodies.push(body);
  check(descendants.some(tag=>tag.name==='a'&&tag.attrs.href===kanagawaStudy.sourceUrl),slug+': shared study source missing');
  check(body.includes(kanagawaStudy.sourceUpdated.replaceAll('-','.'))&&body.includes('このサイトによる取材ではありません'),slug+': source date/type must remain clear');
  if(slug==='hens')check(descendants.filter(tag=>tag.attrs['data-study-observation']).length===3,slug+': three observations missing');
  if(slug==='people')check(descendants.some(tag=>hasClass(tag,'study-process')),slug+': research and improvement process missing');
  if(slug==='rest-questions')check(descendants.some(tag=>tag.name==='details'&&hasClass(tag,'study-optional'))&&body.includes('研究者が実施した手順ではありません'),slug+': optional editorial observation guidance must be distinguished from research');
}
check(studyBodies.length===3&&new Set(studyBodies).size===3,'The three study articles must retain distinct reading roles');
check(henHousingSurvey.total===408&&JSON.stringify(henHousingSurvey.categories.map(([,n])=>n))==='[304,59,45]', 'National housing survey denominator/categories changed without review');
const hensDoc=docs.get('hens.html'), survey=hensDoc?.tags.find(tag=>hasClass(tag,'housing-survey'));
check(Boolean(survey)&&!survey.ancestors.some(tag=>tag.attrs['data-study']), 'hens: national survey must be separate from the local experiment');
if(survey){
  const descendants=membersOf(hensDoc,survey), dots=descendants.filter(tag=>tag.name==='i');
  check(dots.length===408&&[304,59,45].every((expected,index)=>dots.filter(tag=>hasClass(tag,'n'+(index+1))).length===expected),'hens: 408-dot survey graphic must keep 304/59/45 categories');
  const body=compactText(tagText(hensDoc,survey));
  check(body.includes('鶏の羽数の割合ではありません')&&descendants.some(tag=>tag.name==='a'&&tag.attrs.href===henHousingSurvey.sourceUrl),'hens: survey meaning or independent source missing');
}

const publishedIronFile=path.join(folder,'meat-iron-data.json');
check(fs.existsSync(publishedIronFile),'Published iron data file missing');
if(fs.existsSync(publishedIronFile)){
  try{check(JSON.stringify(JSON.parse(fs.readFileSync(publishedIronFile,'utf8')))===JSON.stringify(meatIronData),'Published iron source data differs from the calculation data');}
  catch{check(false,'Published iron data is not valid JSON');}
}

const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(folder, file))).digest('hex');
const result = {
  status: errors.length ? 'failed' : 'passed', kind: 'static-publication-check',
  pages: publicationManifest.length, legacyRedirects: legacyRedirectFiles.length, checkedLinks, searchRecords: catalog.length,
  shortReadingRoutes: readingRoutes.length, readingRouteStops: routeStops.length, worksheetsVerified: checkedPdfs,
  recipeCards: recipeCards.length, filterScenarioChecks, sharedStudyRoles: studyBodies.length,
  recipes: recipeSlugs.length, ironRecipes: ironRecipeSlugs.length,
  fieldRecords: fieldRecords.length, individualPhotoWarnings: sensitive.length,
  topSha256: hash('index.html'), sitemapSha256: hash('sitemap.xml'),
  liveUiVerified: false, errors
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
