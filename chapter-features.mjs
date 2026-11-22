import { recipes, species } from './edition.mjs';

const cookingMethods = {
  'bbq-ribs': '炭火で焼く',
  stew: '鍋で煮込む',
  'crispy-chicken': 'フライパンで焼く'
};

const kitchenPhotos = {
  'ginger-pork': ['フライパンで炒める', 'しょうがだれをからめた豚こま肉'],
  'pork-cutlet': ['衣をつけて揚げる', '切り分けた豚ロースのとんかつ'],
  'miso-soup': ['鍋で煮る', '豚肉と根菜の入った豚汁'],
  grain: ['切り方', '包丁と薄切りにした肉の断面'],
  heat: ['火の通り', '肉の中心に温度計を差し込んだところ'],
  storage: ['保存', '袋と容器に入れて冷蔵した肉']
};
const photoGroups = [
  ['焼く・串に刺す', [[1,'にんにくを添えたひと口焼き'],[2,'こんがり焼いた手羽先'],[3,'焼き目のついた串焼き'],[5,'小ぶりの肉の串焼き'],[7,'手羽のこんがり焼き'],[13,'厚切り肉のバター添え'],[15,'焼き肉の薄切り'],[16,'青い皿のたれ焼き'],[17,'薄切り肉と千切りキャベツ'],[19,'厚切り肉のからし添え'],[26,'焼き目をつけた厚切り肉'],[28,'ステーキのにんにく添え']]],
  ['煮る・汁にする', [[4,'しょうがを添えた煮物'],[6,'手羽のスープ'],[11,'肉と大根の煮物'],[12,'角煮のからし添え'],[21,'細切りしょうがと肉の煮物'],[27,'肉と焼き豆腐の鍋'],[29,'薄切り肉の肉じゃが'],[30,'角切り肉と根菜の煮込み']]],
  ['揚げる・炒める', [[10,'から揚げのレモン添え'],[14,'厚切りのカツ'],[22,'ねぎをのせた肉炒め'],[23,'肉とキャベツの炒めもの'],[25,'丸いひと口カツ']]],
  ['切り分ける・和える', [[8,'薄く切り分けた蒸し鶏'],[9,'ほぐし肉ときゅうりの和えもの'],[18,'薄切りのローストビーフ'],[20,'薄切り肉のレモン添え'],[24,'厚く切り分けた肉のソース添え']]]
];
const plateFile = number => 'plate-' + String(number).padStart(2, '0') + '.webp';
export const kitchenAssets = [...Object.keys(kitchenPhotos).map(slug => 'kitchen-' + slug + '.webp'),
  ...photoGroups.flatMap(([, photos]) => photos.map(([number]) => plateFile(number)))];

function additionalDishes(typeset) {
  return '<section class="plate-gallery" id="food-photos"><h2>写真で見る、もう30皿</h2>' +
    photoGroups.map(([group, photos]) => '<h3>' + group + '</h3><div class="plate-grid">' +
      photos.map(([number, title]) => '<figure><a href="' + plateFile(number) + '"><img loading="lazy" width="640" height="360" src="' +
        plateFile(number) + '" alt="' + title + 'を大きく見る"></a><figcaption>' + typeset(title) + '</figcaption></figure>').join('') +
      '</div>').join('') + '</section>';
}

const firstCut = { cow: 'すね', pig: 'ロース', hen: 'もも' };

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
      typeset(method) + '</small><strong>' + typeset(titles.get(slug)) + '</strong></span></a>';
  }
  const basics = ['grain', 'heat', 'storage'];
  const dishes = [...Object.keys(cookingMethods), 'ginger-pork', 'pork-cutlet', 'miso-soup'];
  return '<p><a href="#food-photos">写真で見る、もう30皿へ</a></p><div class="dish-grid">' + dishes.map(thumbnail).join('') + '</div>' +
    '<section class="subindex"><h2>台所の基本</h2><div class="dish-grid">' + basics.map(thumbnail).join('') + '</div></section>' +
    additionalDishes(typeset) + articleList('このお肉は、どこの部位？', ['beef-shank', 'ribs'], context);
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
