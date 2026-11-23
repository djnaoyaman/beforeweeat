import fs from 'node:fs';
import {plateRecipes} from './plate-recipes.mjs';

export const siteBase = 'https://djnaoyaman.github.io/beforeweeat/';

// The source articles are the publication list. Do not maintain a second page count.
export const editorialRows = ['articles.txt', 'articles-v2.txt'].flatMap(file =>
  fs.readFileSync(new URL(file, import.meta.url), 'utf8').trim().split(/\r?\n/)
).map(line => {
  const [id, slug, title, lead, body, links = '', refs = ''] = line.split('|');
  if (!id || !slug || !title || body === undefined) throw new Error('Incomplete article: ' + line);
  return {
    group: Number(id[0]), slug, title, lead, body: body.replaceAll('\\n', '\n'),
    links: links.split(',').filter(Boolean), refs: refs.split(',').filter(Boolean)
  };
});

export const publicationRows = [...editorialRows, ...plateRecipes];
if (new Set(publicationRows.map(row => row.slug)).size !== publicationRows.length) {
  throw new Error('Duplicate article slug in publication');
}

export const publicationManifest = [
  {slug: 'index', file: 'index.html', url: siteBase, kind: 'home'},
  ...publicationRows.map(({slug}) => ({
    slug, file: slug + '.html', url: siteBase + slug + '.html', kind: 'article'
  }))
];

// These published URLs are stable even when the gallery order changes.
export const mainRecipeSlugs = ['bbq-ribs', 'stew', 'crispy-chicken', 'ginger-pork', 'pork-cutlet', 'miso-soup'];
export const recipeSlugs = [...mainRecipeSlugs, ...plateRecipes.map(recipe => recipe.slug)];

// Kept separately from the 87 reading pages; existing bookmarks still reach home.
export const legacyRedirectFiles = ['top.html'];
