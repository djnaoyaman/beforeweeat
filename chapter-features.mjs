import { plateRecipes } from './plate-recipes.mjs';
import { recipes, species } from './edition.mjs';
import { atlasForAnimal, cutUrl, cutReadings, cutLabel } from './cut-atlas.mjs';

const cookingMethods = {
  'bbq-ribs': '炭火で焼く',
  stew: '鍋で煮込む',
  'crispy-chicken': 'フライパンで焼く'
};

const dishIntroductions = {
  'bbq-ribs': '骨つきの肉を炭火で。たれをぬるのは仕上げです。',
  stew: '牛すね肉を、にんじんや玉ねぎと、ゆっくり。',
  'crispy-chicken': '皮を下にして焼き、鶏もも肉に香ばしい焼き目を。',
  'ginger-pork': '豚こまを重ねずに広げ、しょうがだれをからめます。',
  'pork-cutlet': 'ころもの内側で、赤身と脂身の食感が変わります。',
  'miso-soup': '豚こまと根菜。だしのきいた汁も、一皿のうち。'
};
const basicIntroductions = {
  grain: '肉の筋の向きが見えると、包丁を入れる向きが分かります。',
  heat: '厚いところの中心をはかり、火が通ったか確かめます。',
  storage: 'すぐ使わないお肉を、小分けにしてしまう手順です。'
};

const kitchenPhotos = {
  'ginger-pork': ['フライパンで炒める', 'しょうがだれをからめた豚こま肉'],
  'pork-cutlet': ['衣をつけて揚げる', '切り分けた豚ロースのとんかつ'],
  'miso-soup': ['鍋で煮る', '豚肉と根菜の入った豚汁'],
  grain: ['切り方', '包丁と薄切りにした肉の断面'],
  heat: ['火の通り', '肉の中心に温度計を差し込んだところ'],
  storage: ['保存', '袋と容器に入れて冷蔵した肉']
};
const photoGroups = new Map();
for (const recipe of plateRecipes) {
  if (!photoGroups.has(recipe.method)) photoGroups.set(recipe.method, []);
  photoGroups.get(recipe.method).push(recipe);
}
export const kitchenAssets = [...Object.keys(kitchenPhotos).map(slug => 'kitchen-' + slug + '.webp'),
  ...plateRecipes.map(recipe => recipe.art)];

const galleryHeading = '写真から選ぶ、' + plateRecipes.length + '皿のレシピ';

function additionalDishes(typeset) {
  return '<section class="plate-gallery" id="food-photos"><h2>' + galleryHeading + '</h2>' +
    Array.from(photoGroups, ([group, recipes]) => '<h3>' + group + '</h3><div class="plate-grid">' +
      recipes.map(({slug, art, title, lead}) => {
        return '<figure><a href="' + slug + '.html"><img loading="lazy" width="640" height="360" src="' +
          art + '" alt=""><strong>' + typeset(title) + '</strong><span class="dish-preview">' +
          typeset(lead.split('。')[0] + '。') + '</span></a></figure>';
      }).join('') + '</div>').join('') + '</section>';
}

function articleList(title, slugs, { pageLink, typeset }) {
  const links = slugs.map(slug => '<li>' + pageLink(slug) + '</li>').join('');
  return '<section class="subindex"><h2>' + typeset(title) + '</h2><ul>' + links + '</ul></section>';
}

export function cookingContents(context) {
  const { rows, typeset, hasAsset } = context;
  const articles = rows.filter(row => row.group === 4 && row.slug !== 'cooking');
  const titles = new Map(articles.map(row => [row.slug, row.title]));
  function thumbnail(slug) {
    const recipe = recipes[slug];
    const method = cookingMethods[slug] || kitchenPhotos[slug][0];
    const art = recipe?.art || 'kitchen-' + slug + '.webp';
    const alt = recipe?.alt || kitchenPhotos[slug][1];
    if (!hasAsset(art)) throw new Error('Missing cooking thumbnail: ' + art);
    return '<a class="dish" href="' + slug + '.html"><img src="' + art + '" alt="' + alt + '"' +
      (slug === 'bbq-ribs' ? '' : ' loading="lazy"') + '><span class="dishtext"><small>' +
      typeset(method) + '</small><strong>' + typeset(titles.get(slug)) + '</strong><span class="dish-preview">' +
      typeset(dishIntroductions[slug] || basicIntroductions[slug]) + '</span></span></a>';
  }
  const basics = ['grain', 'heat', 'storage'];
  const dishes = [...Object.keys(cookingMethods), 'ginger-pork', 'pork-cutlet', 'miso-soup'];
  return '<p class="kitchen-intro">' + typeset('今日のお肉は、どう食べよう。焼き目が香ばしい一皿、ころもがさくっとする一皿、汁ごと味わう一皿。使いたいお肉や味から、作りたい料理を選べます。') +
    '</p><p><a href="#food-photos">' + galleryHeading + 'へ</a></p><div class="dish-grid">' + dishes.map(thumbnail).join('') + '</div>' +
    '<section class="subindex"><h2>台所の基本</h2><div class="dish-grid">' + basics.map(thumbnail).join('') + '</div></section>' +
    additionalDishes(typeset) + '<section class="subindex kitchen-next" aria-labelledby="kitchen-next"><h2 id="kitchen-next">料理のあと、もう少し</h2><ul><li>' +
    context.pageLink('beef-shank', '煮こんだ牛すね肉は、牛のどこ？') + '<p>' +
    typeset('よく動くあしの場所を見て、長く煮ると食感が変わる理由をたどれます。') + '</p></li><li>' +
    context.pageLink('ribs', '骨つき肉は、どこの骨？') + '<p>' +
    typeset('ぶたの体の絵で、スペアリブの骨と、そのまわりにある肉の位置を確かめられます。') + '</p></li></ul></section>';
}

function specimen(key, animal, { typeset, pageLink }) {
  const atlas = atlasForAnimal(key, animal);
  const selectedIndex = atlas.parts.findIndex(part => part.id === atlas.first);
  const initial = atlas.parts[selectedIndex];
  const options = animal.cuts.map(([name], i) => {
    const selected = i === selectedIndex ? ' selected' : '';
    return '<option value="' + atlas.parts[i].id + '"' + selected + '>' + name + (cutReadings[name] ? '（' + cutReadings[name] + '）' : '') + '</option>';
  });
  const parts = animal.cuts.map(([name, position, texture, meal, article], i) => {
    const point = atlas.parts[i];
    const dishes = point.recipes || [];
    return '<div class="cutcopy" data-cut="' + point.id + '"><h2>' + typeset(cutLabel(name)) + '</h2>' +
      '<dl class="cut-facts"><div><dt>どこ？</dt><dd>' + typeset(position) + '</dd></div>' +
      '<div><dt>どんな肉？</dt><dd>' + typeset(texture) + '</dd></div>' +
      '<div><dt>どんな料理に？</dt><dd>' + typeset(meal) + '</dd></div></dl>' +
      (dishes.length ? '<p><strong>' + (point.recipeNote ? '作り方の参考' : 'この部位のレシピ') + '</strong>' +
        (point.recipeNote ? '<br>' + typeset(point.recipeNote) : '') + '</p><ul class="cut-dishes">' +
        dishes.map(slug => '<li>' + pageLink(slug) + '</li>').join('') + '</ul>' :
        '<p>' + pageLink('cooking', '料理の一覧を見る') + '</p>') +
      (article ? '<p class="cut-further">' + pageLink(article, 'この部位をもっと知る') + '</p>' : '') + '</div>';
  });
  const markers = atlas.parts.map(part => {
    const hidden = part.id === atlas.first ? '' : ' hidden';
    const radius = atlas.width * .025;
    return '<g data-cut-marker="' + part.id + '" class="cut-marker' + (part.inner ? ' is-inner' : '') + '"' + hidden + '>' +
      part.points.map(([x, y]) => {
        const cx = atlas.width * x / 100, cy = atlas.height * y / 100;
        const core = radius * .32;
        return '<circle class="cut-marker-halo" cx="' + cx + '" cy="' + cy + '" r="' + radius + '"/>' +
          (part.inner ? '<path class="cut-marker-core" d="M' + cx + ' ' + (cy - core * 1.5) + ' l' + core * 1.5 + ' ' + core * 1.5 +
            ' l-' + core * 1.5 + ' ' + core * 1.5 + ' l-' + core * 1.5 + ' -' + core * 1.5 + 'Z"/>' :
            '<circle class="cut-marker-core" cx="' + cx + '" cy="' + cy + '" r="' + core + '"/>');
      }).join('') + '</g>';
  }).join('');
  const name = animal.cuts[selectedIndex][0];
  const mapDescription = animal.name + 'の' + name + '。' + initial.note;
  return '<section class="specimen" id="plate-' + key + '" data-animal="' + key +
    '" data-animal-name="' + animal.name + '" data-first-cut="' + atlas.first + '" aria-label="' + animal.name + 'の部位">' +
    '<figure class="spec-art"><div class="cut-map-heading"><strong data-map-name>' + typeset(animal.name + 'の' + cutLabel(name)) +
    '</strong><span data-map-depth>' + (initial.inner ? '体の奥・内側の目安' : '場所の目安') + '</span></div>' +
    '<svg class="cut-map" viewBox="0 0 ' + atlas.width + ' ' + atlas.height + '" role="img" aria-labelledby="map-title-' + key +
    '"><title id="map-title-' + key + '">' + mapDescription + '</title><image href="' + animal.art + '" width="' + atlas.width +
    '" height="' + atlas.height + '"/>' + markers + '</svg><figcaption><span data-map-note>' + typeset(initial.note) +
    '</span><small>目印は、おおよその場所です。肉を切り分ける線ではありません。点線の目印は、体の奥や内側を表します。</small></figcaption>' +
    '</figure><div class="spec-info"><label data-cut-picker hidden for="cut-select-' + key + '">' + typeset('部位を選ぶ') + '</label>' +
    '<select id="cut-select-' + key + '" data-cut-select hidden aria-label="' + animal.name + 'の部位を選ぶ" aria-controls="cut-copy-' + key + '">' +
    options.join('') + '</select><div id="cut-copy-' + key + '">' + parts.join('') + '</div>' +
    '<div class="cut-share" hidden><a data-cut-permalink href="' + cutUrl(key, atlas.first) + '">この部位のリンク</a>' +
    '<button type="button" data-copy-cut>リンクをコピー</button><input data-cut-share-url hidden readonly aria-label="この部位のURL">' +
    '<p data-cut-share-status role="status"></p></div><p>' +
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
  return '<p class="atlas-intro">動物と部位を選ぶと、絵の目印が変わります。いつも食べるお肉は、どこにあるでしょう。</p>' +
    '<div class="species" role="group" aria-label="図鑑で見る動物を選ぶ" hidden>' + buttons.join('') +
    '</div><noscript><p>' + fallback + '</p></noscript>' +
    animals.map(([key, animal]) => specimen(key, animal, context)).join('') +
    '<script id="cut-atlas-data" type="application/json">' + JSON.stringify(Object.fromEntries(animals.map(([key, animal]) => {
      const atlas = atlasForAnimal(key, animal);
      return [key, atlas.parts.map((part, index) => ({ id: part.id, name: animal.cuts[index][0], reading: cutReadings[animal.cuts[index][0]] || '', note: part.note, inner: Boolean(part.inner) }))];
    }))).replaceAll('<', '\\u003c') + '</script><p id="atlas-status" class="atlas-status" role="status"></p>' +
    '<p class="atlas-question">場所がちがうと、動き方もちがう。肉のかたさや、おいしい食べ方には、どんなつながりがあるでしょう。</p>' +
    articleList('部位を詳しく読む・栄養を比べる', articles.map(row => row.slug), context) +
    articleList('部位に合う料理', ['stew', 'crispy-chicken'], context);
}
