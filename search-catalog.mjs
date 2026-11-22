import {welfareGuideSearchText} from './welfare-guides.mjs';
import {priorityFoodMarkup} from './priority-food.mjs';
import {priorityEditorialSearchText} from './priority-editorial-pages.mjs';
import {cookingSafetySearchText} from './cooking-safety.mjs';
import {editionMarkup, recipes, species} from './edition.mjs';
import {learningSearchText} from './learning.mjs';
import {cutAtlas} from './cut-atlas.mjs';
import {editorialContextSearchText} from './editorial-context.mjs';
import {articleChecks} from './field-archive.mjs';

function textFromMarkup(markup) {
  return markup.replace(/<rt\b[^>]*>[\s\S]*?<\/rt>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:amp|lt|gt|quot|#39);/g, entity => ({
      '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'"
    })[entity])
    .replace(/\s+/g, ' ').trim();
}

export function articleSearchText(row, {plain, titles}) {
  const editorial=priorityEditorialSearchText(row,plain);
  if(editorial)return editorial;
  const welfare=welfareGuideSearchText(row.slug,{plain});
  if(welfare)return welfare;
  const recipe = recipes[row.slug];
  const check = articleChecks[row.slug];
  const animals = Object.values(species).filter(animal => row.slug === 'cuts' || row.slug === animal.guide);
  const cuts = animals.flatMap(animal => [animal.name, animal.reading, ...animal.cuts.flatMap(cut => cut.slice(0, 4))]);
  const mapNotes = Object.entries(species).filter(([, animal]) => row.slug === 'cuts' || row.slug === animal.guide)
    .flatMap(([key]) => cutAtlas[key].parts.map(part => part.note));

  // Supplemental text is visible article text, including tables and checklists.
  // Field records have their own results, so do not duplicate the whole archive.
  const supplement = ['start', 'field-cases', 'cooking'].includes(row.slug) ? '' : editionMarkup({
    r: row, typeset: plain, hasAsset: () => false,
    pageLink: (slug, label) => plain(label || titles.get(slug) || '')
  });
  return plain([
    row.lead, row.body, row.ingredients, row.method, row.time, row.tools, row.observe, ...(row.steps || []),
    recipe?.items, recipe?.time, recipe?.tools, recipe?.observe, ...(recipe?.steps || []),
    ...cuts, ...mapNotes, textFromMarkup(supplement), textFromMarkup(priorityFoodMarkup({r:row,typeset:plain})), learningSearchText(row.slug, species), editorialContextSearchText(row), cookingSafetySearchText(row.slug,{plain}),
    check?.strongest, check?.locator, check?.notes
  ].filter(Boolean).join(' '));
}

export function createSearchCatalog({rows, names, groups, plain}) {
  const titles = new Map(rows.map(row => [row.slug, row.title]));
  return [
    ...rows.filter(row => row.slug !== 'start').map(row => ({
      title: plain(row.title), label: names[row.group], url: row.slug + '.html',
      text: articleSearchText(row, {plain, titles})
    })),
    ...groups.flatMap(group => group.entries.map(entry => ({
      title: entry.title, label: '第' + entry.number + '項　' + entry.context,
      url: 'field-cases.html#record-' + entry.number,
      text: [entry.kind, group.title, entry.summary, entry.check?.strongest, entry.check?.locator, entry.check?.notes].filter(Boolean).join(' ')
    })))
  ];
}
