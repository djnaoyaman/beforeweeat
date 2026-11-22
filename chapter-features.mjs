import { recipes, species } from './edition.mjs';

const cookingMethods = {
  'bbq-ribs': '炭火で焼く',
  stew: '鍋で煮込む',
  'crispy-chicken': 'フライパンで焼く'
};

const firstCut = { cow: 'すね', pig: 'ロース', hen: 'もも' };

function articleList(title, slugs, { pageLink, typeset }) {
  const links = slugs.map(slug => '<li>' + pageLink(slug) + '</li>').join('');
  return '<section class="subindex"><h2>' + typeset(title) + '</h2><ul>' + links + '</ul></section>';
}

export function cookingContents(context) {
  const { rows, typeset, hasAsset } = context;
  const articles = rows.filter(row => row.group === 4 && row.slug !== 'cooking');
  const titles = new Map(articles.map(row => [row.slug, row.title]));
  const dishes = Object.entries(cookingMethods).map(([slug, method]) => {
    const { art, alt } = recipes[slug];
    const image = hasAsset(art) ? '<img src="' + art + '" alt="' + alt + '" width="1080" height="810">' : '';
    return '<a class="dish" href="' + slug + '.html">' + image +
      '<span class="dishtext"><small>' + typeset(method) + '</small><strong>' +
      typeset(titles.get(slug)) + '</strong></span></a>';
  });
  const otherArticles = articles.map(row => row.slug).filter(slug => !Object.hasOwn(cookingMethods, slug));
  return '<div class="dish-grid">' + dishes.join('') + '</div>' +
    articleList('ほかの料理と台所の基本', otherArticles, context) +
    articleList('このお肉は、どこの部位？', ['beef-shank', 'ribs'], context);
}

function specimen(key, animal, { typeset, pageLink }) {
  const options = animal.cuts.map(([name], i) => {
    const selected = name === firstCut[key] ? ' selected' : '';
    return '<option value="' + i + '"' + selected + '>' + name + '</option>';
  });
  const parts = animal.cuts.map(([name, position, texture, meal]) =>
    '<div class="cutcopy"><h2>' + typeset(name) + '</h2><p>' + typeset(position) + '</p><p>' +
      typeset(texture) + '</p><p>' + typeset(meal) + '</p></div>'
  );
  return '<section class="specimen" id="plate-' + key + '" data-animal="' + key +
    '" aria-label="' + animal.name + 'の部位"><div class="spec-art"><img src="' + animal.art +
    '" alt="横から見た' + animal.name + 'の全身図"></div><div class="spec-info">' +
    '<label data-cut-picker hidden>部位を選ぶ　<select aria-label="' + animal.name + 'の部位を選ぶ">' +
    options.join('') + '</select></label>' + parts.join('') + '<p>' +
    pageLink(animal.guide, animal.name + 'の全' + animal.cuts.length + '部位を見る') + '</p></div></section>';
}

export function cutsContents(context) {
  const { rows, pageLink, typeset } = context;
  const animals = Object.entries(species);
  const buttons = animals.map(([key, animal]) => '<button type="button" data-focus="' + key +
    '" aria-controls="plate-' + key + '" aria-pressed="' + (key === 'cow') + '">' +
    typeset(animal.name) + '</button>');
  const guides = new Set(animals.map(([, animal]) => animal.guide));
  const articles = rows.filter(row => row.group === 3 && row.slug !== 'cuts' && !guides.has(row.slug));
  const fallback = animals.map(([, animal]) => pageLink(animal.guide, animal.name + 'の部位')).join('　');
  return '<div class="species" role="group" aria-label="図鑑で見る動物を選ぶ" hidden>' + buttons.join('') +
    '</div><noscript><p>' + fallback + '</p></noscript>' +
    animals.map(([key, animal]) => specimen(key, animal, context)).join('') +
    articleList('部位を詳しく読む・栄養を比べる', articles.map(row => row.slug), context) +
    articleList('部位に合う料理', ['stew', 'crispy-chicken'], context);
}
