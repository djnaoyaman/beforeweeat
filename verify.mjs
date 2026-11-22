import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {publicationManifest, publicationRows, recipeSlugs, siteBase} from './publication.mjs';
import {plateRecipes} from './plate-recipes.mjs';
import {fieldGroups} from './field-archive.mjs';
import {recipes, species} from './edition.mjs';

// Dependency-free static publication gate. Live UI checks are recorded separately.
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
      if (index >= 0) stack.length = index;
      continue;
    }
    const attrs = {};
    for (const attr of match[3].matchAll(/([^\s=/'"<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attrs[attr[1].toLowerCase()] = decode(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    const tag = {name, attrs, ancestors: [...stack]};
    if (attrs.id) {
      check(!ids.has(attrs.id), 'Duplicate id: ' + attrs.id);
      ids.add(attrs.id);
    }
    tags.push(tag);
    if (!voids.has(name) && !match[3].endsWith('/')) stack.push(tag);
  }
  return {html, tags, ids};
}

const files = fs.readdirSync(folder);
const expectedFiles = publicationManifest.map(page => page.file);
const actualPages = files.filter(file => file.endsWith('.html') && file !== '404.html');
check(new Set(actualPages).size === expectedFiles.length && expectedFiles.every(file => actualPages.includes(file)),
  'Generated HTML must exactly match the publication manifest (no missing or stale pages)');
const docs = new Map(files.filter(file => file.endsWith('.html')).map(file =>
  [file, inspectHtml(fs.readFileSync(path.join(folder, file), 'utf8'))]
));
const sitemap = fs.readFileSync(path.join(folder, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
check(sitemapUrls.length === publicationManifest.length && new Set(sitemapUrls).size === sitemapUrls.length &&
  publicationManifest.every(page => sitemapUrls.includes(page.url)), 'Sitemap and publication manifest differ');

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

const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(folder, file))).digest('hex');
const result = {
  status: errors.length ? 'failed' : 'passed', kind: 'static-publication-check',
  pages: publicationManifest.length, checkedLinks, searchRecords: catalog.length,
  recipes: recipeSlugs.length, fieldRecords: fieldRecords.length, individualPhotoWarnings: sensitive.length,
  topSha256: hash('index.html'), sitemapSha256: hash('sitemap.xml'),
  liveUiVerified: false, errors
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
