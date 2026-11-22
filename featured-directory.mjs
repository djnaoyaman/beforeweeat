import {createSearchCatalog} from './search-catalog.mjs';

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

export function contentsPage({rows, names, groups, typeset, plain, pageLink}) {
  const records = groups.flatMap(group => group.entries);
  const articles = rows.filter(row => row.slug !== 'start');
  const searchItems = createSearchCatalog({rows, names, groups, plain});
  const spread = [
    ['cookrow', 'cooking', '料理', 'ちゃんと「いただく」方法', 'たれを塗るのは、いつ？', '<img src="runway-rib.webp" alt="">'],
    ['fieldrow', 'field-cases', '畜産の現場', '現場で報告された事例', '記録を読み、出典をたどる。', '<span class="num">' + records.length + '<span>件の記録</span></span>'],
    ['cutsrow', 'cuts', '部位図鑑', 'お肉の部位と栄養', '牛すねは、体のどこ？', '<img src="cow-art.webp" alt="">']
  ].map(([style, slug, label, title, prompt, art]) =>
    '<a class="spread ' + style + '" href="' + slug + '.html"><div><small>' + typeset(label)
    + '</small><strong>' + typeset(title) + '</strong><p>' + typeset(prompt) + '</p></div>' + art + '</a>'
  ).join('');
  const chapters = [2,3,4,5,6,7,8,1].map(group =>
    '<details><summary>' + typeset(names[group]) + '</summary><ul class="story-list">'
    + articles.filter(row => row.group === group).map(row => '<li>' + pageLink(row.slug) + '</li>').join('') + '</ul></details>'
  ).join('');
  return '<div class="searchline"><h1>すべての目次</h1><input hidden type="search" id="catalog-query" aria-label="記事と現場の記録を検索" placeholder="ことばで探す"></div>'
    + '<p id="count" role="status"></p><div class="search-results" hidden><ul class="story-list"></ul></div>'
    + '<div id="directory"><section class="edspread" aria-label="三つの読みどころ">' + spread + '</section>'
    + '<section class="chapter-browser" id="catalog"><h2>章から読む</h2>' + chapters + '</section></div>'
    + '<script id="catalog-data" type="application/json">' + JSON.stringify(searchItems).replaceAll('<','\\u003c') + '</script>';
}
