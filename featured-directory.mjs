import {createSearchCatalog} from './search-catalog.mjs';
import {directoryCopy} from "./directory-copy.mjs";
import {caseLabels, recipes} from "./edition.mjs";

const headerLinks = [
  ['start', 'すべての目次'], ['cooking', '料理'], ['field-cases', '現場の事例'],
  ['cuts', '部位図鑑'], ['animals', '動物のくらし'], ['lessons', '先生・保護者の方へ']
];

export function chapterHeader(pageLink) {
  return '<header class="feature-head"><a class="brand" href="./"><img src="logo.webp" alt="Before We Eat トップ" width="2172" height="724"></a>'
    + '<details class="feature-menu"><summary aria-label="サイトメニュー">MENU<span class="hamburger" aria-hidden="true"></span></summary>'
    + '<nav class="feature-nav" aria-label="サイト案内">' + headerLinks.map(([slug,label]) => pageLink(slug,label)).join('') + '</nav></details>'
    + '<a class="about-link" href="mina.html">このサイトについて<span aria-hidden="true">＋</span></a></header>';
}

const animalNotes = {
  cow: ['牛', 'cow-art.webp', 844, 760, '草を食べ、口に戻してまたかむ。牛の食事と休み方。'],
  pig: ['ぶた', 'pig-art.webp', 1150, 575, '鼻でにおいをかいだり、土を探ったりする。ぶたの一日。'],
  hen: ['にわとり', 'hen-art.webp', 684, 760, '地面をついばみ、高いところで休む。にわとりの一日。']
};
const chapterNotes = {
  2: ['01', '食べる、動く、休む。動物の一日と、実際の記録をたどる。', 'life'],
  3: ['02', '体の場所がわかると、肉のかたさや向いている料理が見えてくる。', 'cuts'],
  4: ['03', '焼く、蒸す、煮る。食べたい一皿を選ぶ。', 'recipes'],
  5: ['04', '人数と料理に合わせて、使う量や表示を確かめる。', 'market'],
  6: ['05', '休みやすい場所をつくるために、現場の人が試したこと。', 'work'],
  7: ['06', '食卓での会話、家や教室で使えるシート。使いたいものだけ選べる。', 'learning'],
  8: ['07', '元の資料と、記事を更新した理由を調べる。', 'sources'],
  1: ['08', '肉を食べる編者が、どんな調べ方で何を伝えたいのか。', 'about']
};
const artDimensions = {'runway-rib.webp':[1080,810],'runway-beef.webp':[1080,810],
  'runway-chicken.webp':[1080,810],'kitchen-ginger-pork.webp':[640,360],
  'kitchen-miso-soup.webp':[640,360],'kitchen-pork-cutlet.webp':[640,360]};
const articleSpecies = {
  'pig-rest':'pig',sows:'pig',calves:'cow',feet:'hen',
  loin:'pig','pork-round':'pig',ribs:'pig','beef-cuts':'cow','pig-cuts':'pig',
  'beef-shank':'cow','beef-round':'cow','chicken-cuts':'hen','chicken-guide':'hen',
  'lesson-beef':'cow','lesson-pork':'pig','lesson-chicken':'hen'
};
const craftNotes = {
  grain:'向きでくらべる',heat:'温度でたしかめる',storage:'保存の順をたどる',
  shopping:'人数と量から考える',eggs:'表示を読む','buy-bone':'骨をふくむ重さを知る',
  lessons:'先生・保護者の方へ','food-diary':'7日間のシート',sources:'元資料を読む',corrections:'更新をたどる'
};
const heroTopics = ['cuts','field-cases'];
const encodeCatalog = items => JSON.stringify(items).replaceAll('<','\\u003c');
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function animalArt(key) {
  const [,file,width,height] = animalNotes[key];
  return '<img src="'+file+'" alt="" width="'+width+'" height="'+height+'" loading="lazy" decoding="async">';
}
function recordLabel(row) {
  return caseLabels[row.slug] || (row.slug === 'field-cases' ? '79件の記録／場所・時期・元の資料' : '');
}
function recipeArt(row, hasAsset) {
  const art = row.art || recipes[row.slug]?.art;
  return art && hasAsset(art) ? art : null;
}
function recipeImage(art, hero = false) {
  const d = artDimensions[art];
  return '<img src="'+esc(art)+'" alt=""'+(d ? ' width="'+d[0]+'" height="'+d[1]+'"' : '')
    +(hero ? ' fetchpriority="high"' : ' loading="lazy"')+' decoding="async">';
}

export function animalsDirectory({typeset}) {
  const follow = [
    ['welfare','動物が過ごす場所を考える','食べる場所や休む場所を見たあとで、動物の過ごしやすさを考える手がかりを読めます。'],
    ['field-cases','実際に報告されたことを読む','どこで何が確認されたか、時期と元の資料からたどれます。写真を表示せずに読めます。']
  ];
  return '<div class="animal-journal">'
   +'<section aria-labelledby="animal-journal-life"><h2 id="animal-journal-life">'+typeset('三つのくらしを読む')+'</h2><div class="animal-journal-spread">'
   +Object.entries(animalNotes).map(([key,[name,,,,teaser]])=>'<a href="'+key+'.html">'+animalArt(key)
    +'<div><strong>'+typeset(name+'のくらし')+'</strong><p>'+typeset(teaser)+'</p></div></a>').join('')
   +'</div></section><section class="animal-journal-related" aria-labelledby="animal-journal-more"><h2 id="animal-journal-more">'
   +typeset('もう少し読みたいときに')+'</h2>'+follow.map(([slug,label,reason])=>'<p><a href="'+slug+'.html">'+typeset(label)+'</a><span>'+typeset(reason)+'</span></p>').join('')
   +'</section></div>';
}

export function contentsPage({rows, names, groups, typeset, plain, hasAsset}) {
  const records = groups.flatMap(group => group.entries);
  const articles = rows.filter(row => row.slug !== 'start');
  if (Object.keys(directoryCopy).length !== articles.length || new Set(Object.values(directoryCopy)).size !== articles.length ||
      articles.some(({slug}) => !Object.hasOwn(directoryCopy, slug))) throw Error('Directory needs one unique cue per article.');
  const bySlug = new Map(articles.map(row => [row.slug,row]));
  const searchItems = createSearchCatalog({rows, names, groups, plain}).map(item => {
    const row = bySlug.get(item.url.replace(/\.html$/,''));
    const teaser = row ? directoryCopy[row.slug] : records.find(r => item.url === 'field-cases.html#record-'+r.number)?.summary.split('\n')[0];
    const art = row ? recipeArt(row, hasAsset) : null;
    return {...item, teaser, ...(art ? {art} : {})};
  });
  const ginger = bySlug.get('ginger-pork');
  const heroImage = recipeArt(ginger, hasAsset);
  const hero = '<section class="journal-spread" aria-label="食卓から、どこへ読む？">'
   +'<a class="journal-hero" href="ginger-pork.html">' +(heroImage ? recipeImage(heroImage,true) : '')
   +'<div class="journal-hero-copy"><small>'+typeset('巻頭の一皿')+'</small><strong>'+typeset(ginger.title)+'</strong><p>'
   +typeset(directoryCopy[ginger.slug])+'</p><span class="journal-art-credit">'+typeset('料理イメージ')+'</span></div></a>'
   +'<div class="journal-pair"><p class="journal-kicker">'+typeset('食卓から動物へ')+'</p><ul class="journal-animals">'
   +Object.entries(animalNotes).map(([key,[name,,,,teaser]])=>'<li><a href="'+key+'.html">'+animalArt(key)
   +'<strong>'+typeset(name)+'</strong><span>'+typeset(teaser)+'</span></a></li>').join('')
   +'</ul><div class="journal-hero-topics">'+heroTopics.map(id=>'<a href="'+id+'.html"><strong>'+typeset(bySlug.get(id).title)
   +'</strong><span>'+typeset(directoryCopy[id])+'</span></a>').join('')+'</div></div></section>';
  const tile = row => {
    const art = recipeArt(row, hasAsset);
    const record = recordLabel(row);
    const animal = articleSpecies[row.slug];
    const meta = record || row.method || craftNotes[row.slug];
    return '<li class="journal-item" data-layout="'+(art ? 'meal' : record ? 'record' : animal ? 'figure' : 'text')
     +'"><a href="'+row.slug+'.html">'+(art ? recipeImage(art) : animal ? animalArt(animal) : '')
     +'<div>'+(meta ? '<small>'+typeset(meta)+'</small>' : '')+'<strong>'+typeset(row.title)+'</strong><p>'
     +typeset(directoryCopy[row.slug])+'</p></div></a></li>';
  };
  const chapters = [2,3,4,5,6,7,8,1].map(group => {
    const [number,note,kind] = chapterNotes[group];
    const entries = articles.filter(row => row.group === group);
    return '<details class="journal-chapter"'+(group === 2 ? ' open' : '')+'><summary><span class="journal-section-no" aria-hidden="true">'+number
     +'</span><span><strong>'+typeset(names[group])+'</strong><span class="journal-chapter-note">'+typeset(note)
     +'</span></span><small class="journal-chapter-count">'+entries.length+'本</small></summary><ul class="journal-entries" data-kind="'+kind+'">'
     +entries.map(tile).join('')+'</ul></details>';
  }).join('');
  return '<div class="directory-journal"><div class="searchline"><h1>すべての目次</h1><input hidden type="search" id="catalog-query" aria-label="記事と現場の記録を検索" placeholder="ことばで探す"></div>'
    + '<p class="journal-deck">'+typeset('食べたい一皿、動物のくらし、体の場所。気になったところから。')+'</p>'
    + '<p id="count" role="status"></p><div class="search-results" hidden><ul class="story-list"></ul></div>'
    + '<div id="directory">' + hero
    + '<section class="chapter-browser" id="catalog"><h2>'+typeset('すべての記事を、章から読む')+'</h2>' + chapters + '</section></div>'
    + '<script id="catalog-data" type="application/json">' + encodeCatalog(searchItems) + '</script></div>';
}
