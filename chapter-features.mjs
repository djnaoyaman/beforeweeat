import { plateRecipes } from './plate-recipes.mjs';
import { recipes, species } from './edition.mjs';
import { atlasForAnimal, cutUrl, cutReadings, cutLabel } from './cut-atlas.mjs';
import { directoryCopy } from './directory-copy.mjs';
import { cutReadingDirectory } from './chapter-directories.mjs';

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
export const kitchenAssets = [...Object.keys(kitchenPhotos).map(slug => 'kitchen-' + slug + '.webp'),
  ...plateRecipes.map(recipe => recipe.art)];

const animalLabels = { cow: '牛', pig: 'ぶた', hen: 'にわとり' };
const methodLabels = { roast: '<焼:や>く', simmer: '<煮:に>る', fry: '<揚:あ>げる', stir: '<炒:いた>める', steam: '<蒸:む>す', mix: '<和:あ>える' };
const plainLabel = value => value.replace(/<([^:]+):[^>]+>/g, '$1');

// Classify by the published ingredients and steps. A dish may use two methods.
// The fixed slugs continue to identify the same photographs and recipe pages.
export const recipeFilterCatalog = [
  ['stew', 'cow', ['simmer'], '牛すね'],
  ['bbq-ribs', 'pig', ['roast'], 'スペアリブ'],
  ['crispy-chicken', 'hen', ['roast'], '鶏もも'],
  ['ginger-pork', 'pig', ['stir'], '豚こま'],
  ['pork-cutlet', 'pig', ['fry'], '豚ロース'],
  ['miso-soup', 'pig', ['simmer'], '豚こま'],
  ['plate-01', 'hen', ['roast'], '<砂肝:すなぎも>'],
  ['plate-02', 'hen', ['roast'], '<手羽先:てばさき>'],
  ['plate-03', 'hen', ['roast'], '鶏もも'],
  ['plate-04', 'hen', ['simmer'], '鶏レバー'],
  ['plate-05', 'hen', ['roast'], '<砂肝:すなぎも>'],
  ['plate-06', 'hen', ['simmer'], '<手羽元:てばもと>'],
  ['plate-07', 'hen', ['roast'], '<手羽先:てばさき>'],
  ['plate-08', 'hen', ['steam'], '鶏むね'],
  ['plate-09', 'hen', ['steam', 'mix'], '鶏ささみ'],
  ['plate-10', 'hen', ['fry'], '鶏もも'],
  ['plate-11', 'pig', ['simmer'], '豚ばら'],
  ['plate-12', 'pig', ['simmer'], '豚ばら'],
  ['plate-13', 'pig', ['roast'], '豚ロース'],
  ['plate-14', 'pig', ['fry'], '豚ロース'],
  ['plate-15', 'pig', ['roast'], '豚肩ロース'],
  ['plate-16', 'pig', ['roast'], '豚ロース'],
  ['plate-17', 'pig', ['roast'], '豚ロース'],
  ['plate-18', 'cow', ['roast'], '牛もも'],
  ['plate-19', 'cow', ['roast'], '牛もも'],
  ['plate-20', 'cow', ['roast'], '牛もも'],
  ['plate-21', 'cow', ['simmer'], '牛切り落とし'],
  ['plate-22', 'cow', ['stir'], '牛薄切り肉'],
  ['plate-23', 'pig', ['stir'], '豚こま'],
  ['plate-24', 'pig', ['roast'], '豚ヒレ'],
  ['plate-25', 'cow', ['fry'], '牛もも'],
  ['plate-26', 'cow', ['roast'], '牛ステーキ肉'],
  ['plate-27', 'cow', ['simmer'], '牛薄切り肉'],
  ['plate-28', 'cow', ['roast'], '牛ステーキ肉'],
  ['plate-29', 'cow', ['simmer'], '牛薄切り肉'],
  ['plate-30', 'cow', ['simmer'], '牛すね']
].map(([slug, animal, methods, meat]) => ({ slug, animal, methods, meat }));

function filterChoices(kind, legend, choices, typeset) {
  return '<fieldset><legend>' + typeset(legend) + '</legend><div class="recipe-filter-options">' +
    [['all', 'すべて'], ...Object.entries(choices)].map(([value, label]) => '<button type="button" data-recipe-filter="' + kind +
      '" data-filter-value="' + value + '" data-filter-label="' + plainLabel(label) + '" aria-pressed="' + (value === 'all') +
      '" aria-controls="recipe-results"><span class="recipe-filter-check" aria-hidden="true">✓</span>' + typeset(label) + '</button>').join('') +
    '</div></fieldset>';
}

function recipeFinder(context) {
  const { rows, typeset, hasAsset } = context;
  const bySlug = new Map(rows.map(row => [row.slug, row]));
  const plates = new Map(plateRecipes.map(recipe => [recipe.slug, recipe]));
  const expected = [...Object.keys(recipes), ...plates.keys()];
  const slugs = new Set(recipeFilterCatalog.map(item => item.slug));
  if (slugs.size !== expected.length || expected.some(slug => !slugs.has(slug))) throw new Error('Recipe finder must cover every published recipe exactly once');
  const cards = recipeFilterCatalog.map(({ slug, animal, methods, meat }, index) => {
    const row = bySlug.get(slug);
    if (!row || !directoryCopy[slug] || !animalLabels[animal] || methods.some(method => !methodLabels[method])) {
      throw new Error('Incomplete recipe finder entry: ' + slug);
    }
    const art = plates.get(slug)?.art || recipes[slug]?.art || 'kitchen-' + slug + '.webp';
    if (!hasAsset(art)) throw new Error('Missing recipe finder photograph: ' + art);
    const original = art.startsWith('runway-');
    return '<li class="recipe-choice' + (index === 0 ? ' recipe-choice--opening' : '') + '" data-recipe-card data-recipe-slug="' + slug +
      '" data-recipe-animal="' + animal + '" data-recipe-methods="' + methods.join(' ') + '"><a href="' + slug + '.html">' +
      '<img src="' + art + '" width="' + (original ? 1080 : 640) + '" height="' + (original ? 810 : 360) +
      '" alt=""' + (index ? ' loading="lazy"' : '') + '><div class="recipe-choice-copy"><p class="recipe-choice-meta">' +
      typeset(meat.replaceAll('豚', '<豚:ぶた>') + ' ／ ' + methods.map(method => methodLabels[method]).join('・')) + '</p><h3>' + typeset(row.title) +
      '</h3><p>' + typeset(directoryCopy[slug]) + '</p></div></a></li>';
  }).join('');
  return '<section class="recipe-finder" id="food-photos" data-recipe-finder aria-labelledby="recipe-finder-heading"><h2 id="recipe-finder-heading">' +
    typeset('写真から選ぶ、' + recipeFilterCatalog.length + '品のレシピ') + '</h2><p>' +
    typeset('お肉の種類と作り方を組み合わせて、食べたい一皿を探せます。') + '</p><p class="recipe-image-note">' +
    typeset('料理の画像は、できあがりの参考として作ったイメージです。') + '</p><div class="recipe-filters" data-recipe-controls hidden>' +
    filterChoices('animal', '動物から選ぶ', animalLabels, typeset) + filterChoices('method', '作り方から選ぶ', methodLabels, typeset) +
    '<div class="recipe-filter-reset"><button type="button" data-recipe-clear>' + typeset('選び直す（すべて表示）') + '</button></div></div>' +
    '<p class="recipe-result-count" data-recipe-status role="status" aria-live="polite" aria-atomic="true">' + recipeFilterCatalog.length +
    '品のレシピがあります。</p><noscript><p>' + typeset('この下に、すべての料理を並べています。写真と名前から選んでください。') + '</p></noscript>' +
    '<p class="recipe-empty" data-recipe-empty hidden>' + typeset('この組み合わせの料理は、まだありません。お肉か作り方を「すべて」にするか、「選び直す」でほかの料理を見られます。') +
    '</p><ul class="recipe-grid" id="recipe-results">' + cards + '</ul></section>';
}

export function cookingContents(context) {
  const { rows, typeset, hasAsset } = context;
  const articles = rows.filter(row => row.group === 4 && row.slug !== 'cooking');
  const titles = new Map(articles.map(row => [row.slug, row.title]));
  function thumbnail(slug) {
    const [method, alt] = kitchenPhotos[slug];
    const art = 'kitchen-' + slug + '.webp';
    if (!hasAsset(art)) throw new Error('Missing cooking thumbnail: ' + art);
    return '<a class="dish" href="' + slug + '.html"><img src="' + art + '" alt="' + alt + '"' +
      ' loading="lazy" width="640" height="360"><span class="dishtext"><small>' +
      typeset(method) + '</small><strong>' + typeset(titles.get(slug)) + '</strong><span class="dish-preview">' +
      typeset(basicIntroductions[slug]) + '</span></span></a>';
  }
  const basics = ['grain', 'heat', 'storage'];
  return '<p class="kitchen-intro">' + typeset('今日のお肉は、どう食べよう。焼き目が香ばしい一皿、ころもがさくっとする一皿、汁ごと味わう一皿。使いたいお肉や味から、作りたい料理を選べます。') +
    '</p><p class="kitchen-jumps"><a href="#food-photos">' + typeset('36品から料理を選ぶ') + '</a>　<a href="#kitchen-basics">' + typeset('台所の基本を読む') + '</a></p>' +
    recipeFinder(context) + '<section class="subindex" id="kitchen-basics"><h2>台所の基本</h2><div class="dish-grid">' + basics.map(thumbnail).join('') + '</div></section>' +
    '<section class="subindex kitchen-next" aria-labelledby="kitchen-next"><h2 id="kitchen-next">料理のあと、もう少し</h2><ul><li>' +
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
  const { pageLink, typeset } = context;
  const animals = Object.entries(species);
  const buttons = animals.map(([key, animal]) => '<button type="button" data-focus="' + key +
    '" aria-controls="plate-' + key + '" aria-pressed="' + (key === 'cow') + '">' +
    typeset(animal.name) + '</button>');
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
    cutReadingDirectory(context);
}
