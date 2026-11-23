import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project = fileURLToPath(new URL('.', import.meta.url));
const siteBase = 'https://djnaoyaman.github.io/beforeweeat/';
const bookUrl = siteBase + 'ninzuubun/';
const coverUrl = siteBase + 'novel-assets/cover.webp';
export const novelScenes = JSON.parse(fs.readFileSync(path.join(project, 'novel-data.json'), 'utf8'));
export const novelChapters = [...new Set(novelScenes.map(s => s.chapter_number))].map(number => {
  const scenes = novelScenes.filter(s => s.chapter_number === number);
  return {number, chapter:scenes[0].chapter, title:scenes[0].title, scenes};
});
export const novelAssets = ['cover', ...novelScenes.map(s => s.id)].map(id => 'novel-assets/' + id + '.webp');
export const novelManifest = [
  {slug:'ninzuubun', file:'ninzuubun/index.html', url:bookUrl, kind:'novel'},
  ...novelScenes.map(s => ({slug:'ninzuubun-' + s.id, file:'ninzuubun/' + s.id + '.html', url:bookUrl + s.id + '.html', kind:'novel', scene:s.id}))
];
export const novelCatalogItem = {
  title:'人数分',
  label:'特集小説・犬山静',
  url:'ninzuubun/',
  text:'小説 物語 犬山静 人数分 食堂 料理教室 ディベート 動物 食べる 食べない 豆 子ども 名簿 画面の外 十枚 長靴 小さい鍋 湯気 片づけ 次の注文',
  teaser:'「食べないで帰る子がいても、いいんですね」。食堂を舞台に、食べる喜びと迷いを描く全八章。'
};
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const encode = value => JSON.stringify(value).replaceAll('<','\\u003c');
const alts = {
  morning:'料理教室の案内と二つのコーヒーカップをはさんで向かい合う手。',
  lunch:'生姜焼きを焼く手と、ご飯の量が違う三つの茶碗。',
  'after-lunch':'食堂のカウンターで、人数を確かめながら名簿に書き足す手。',
  screen:'閉店した食堂で、暗い画面の前に止まる手と開いた帳簿。',
  delivery:'食堂へ届いた保冷箱と、伝票を受け取る手。',
  beans:'白いんげん豆ときのこの煮込みを、小さな皿で差し出す手。',
  'after-closing':'閉店後の食堂で、豆の煮込みと少量の飯を囲む二人の手。',
  invitation:'公開討論の案内が置かれたレジのそばで、電話を持つ手。',
  'night-before':'夜のカウンターに並べられた二人の資料と、書き止まった鉛筆。',
  debate:'討論の机に置かれた二本のマイクと、手前の投票用紙。',
  'after-debate':'終演後の廊下で名刺を差し出し、受け取る二人の手。',
  farm:'豚舎の通路で水飲みの金具を確かめる農家の手と、近づく豚。',
  'farm-office':'農場の事務机で、連絡先を書いた小さな紙を渡す手。',
  'small-pot':'厨房に並んだ小さな片手鍋と大きな両手鍋、予定を書き込む手。',
  'kitchen-visit':'公民館の調理台の間で巻尺を伸ばす手と、戸棚から器を出す手。',
  'friday-prep':'教室へ運ぶ材料と箱を並べ、調理道具に色の印をつける手。',
  'cooking-class':'二つの料理の鍋を囲み、それぞれの器へよそう子どもと大人の手。',
  cleaning:'食事のあと、鍋蓋を拭く手と、折り畳まれたレシピ。',
  'back-at-diner':'荷ほどきを終えた食堂で、勤務表のそばから封筒を手渡す二人。',
  'one-month-later':'焼き上がった小さな四角い菓子を、二つの皿へ分ける手。',
  'next-order':'見積もりと予算の紙を前に、次の注文をする手。',
  'one-bean':'子どもの小さな器へ、白いんげん豆一粒と少しの煮汁をよそう匙。'
};
const navigation = novelScenes.map(({id,chapter,title,label}) => ({id,chapter,title,label}));
const bookDescription = '犬山静の小説『人数分』。食堂の主人が開く料理教室をめぐり、食べる喜びと迷いを描く全八章。';
const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&family=Noto+Serif+JP:wght@400;500;600&display=swap" rel="stylesheet">';
function head(title, description, url, scene) {
  const structured = scene ? {
    '@context':'https://schema.org', '@type':'Chapter', name:scene.chapter + '　' + scene.title,
    alternativeHeadline:scene.label, position:scene.chapter_number, url, inLanguage:'ja',
    author:{'@type':'Person',name:'犬山静'}, image:coverUrl,
    isPartOf:{'@type':'Book','@id':bookUrl+'#book',name:'人数分',url:bookUrl}
  } : {
    '@context':'https://schema.org', '@type':'Book', '@id':bookUrl+'#book', name:'人数分',
    author:{'@type':'Person',name:'犬山静'}, inLanguage:'ja', genre:'小説', url:bookUrl, image:coverUrl,
    description:bookDescription
  };
  return '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + esc(title) + '</title><meta name="description" content="' + esc(description) + '">'
    + '<meta name="robots" content="index,follow"><meta name="author" content="犬山静"><meta name="theme-color" content="#f4f2e9">'
    + '<link rel="canonical" href="' + esc(url) + '"><link rel="icon" href="../icon.svg?v=3" type="image/svg+xml">'
    + '<meta property="og:type" content="' + (scene?'article':'book') + '"><meta property="og:site_name" content="Before We Eat">'
    + '<meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(description) + '">'
    + '<meta property="og:url" content="' + esc(url) + '"><meta property="og:image" content="' + coverUrl + '">'
    + '<meta property="og:image:alt" content="人数分　犬山静。さまざまな器が並ぶ食卓を描いた表紙。">'
    + '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + esc(title) + '">'
    + '<meta name="twitter:description" content="' + esc(description) + '"><meta name="twitter:image" content="' + coverUrl + '">'
    + fonts + '<link rel="stylesheet" href="../novel-reader.css?v=1"><script src="../novel-reader.js?v=1" defer></script>'
    + '<script type="application/ld+json">' + encode(structured) + '</script></head>';
}
function header(isLanding) {
  return '<a class="n-skip" href="#main">本文へ進む</a><header class="n-site-header"><div class="n-header-inner">'
    + '<a class="n-brand" href="../"><img src="../logo.webp" width="2172" height="724" alt="Before We Eat"></a>'
    + '<div class="n-header-actions"><span class="n-header-tag">特集小説</span>'
    + (isLanding?'':'<a class="n-home-link" href="./">作品トップ</a>')
    + '<a class="n-toc-fallback" href="' + (isLanding?'#contents':'index.html#contents') + '">目次</a>'
    + '<button class="n-toc-button" type="button" data-open-contents aria-haspopup="dialog" hidden><span aria-hidden="true" class="n-menu-icon"></span>目次</button></div></div>'
    + '<div class="n-progress" id="reading-progress" aria-hidden="true"></div></header>';
}
function toc(currentId = '', modal = false) {
  return '<div class="n-chapter-list' + (modal?' n-dialog-chapters':'') + '">' + novelChapters.map(chapter =>
    '<section class="n-toc-chapter"><h3><span>' + esc(chapter.chapter) + '</span>' + esc(chapter.title) + '</h3><ol>'
    + chapter.scenes.map(scene => '<li><a href="' + scene.id + '.html"' + (scene.id===currentId?' aria-current="page"':'') + '>'
      + esc(scene.label) + (scene.id===currentId?'<span class="n-current-note">読んでいる場面</span>':'') + '</a></li>').join('')
    + '</ol></section>').join('') + '</div>';
}
function dialog(currentId='') {
  return '<dialog class="n-contents-dialog" id="contents-dialog" aria-labelledby="contents-dialog-title"><div class="n-dialog-heading">'
    + '<h2 id="contents-dialog-title">人数分の目次</h2><button type="button" data-close-contents>閉じる</button></div>'
    + '<p class="n-dialog-top"><a href="./">表紙と前口上へ</a></p>' + toc(currentId,true) + '</dialog>';
}
function footer() {
  return '<footer class="n-site-footer"><p><a href="../">Before We Eat</a> · 特集小説『人数分』</p><p>犬山静</p>'
    + '<a href="../mina.html">編者 MINA</a></footer>';
}
function scripts() {
  return '<script id="novel-navigation" type="application/json">' + encode(navigation) + '</script></body></html>';
}
function paragraphs(items, className='n-prose', indexed=false) {
  return '<div class="' + className + '"' + (indexed?' id="prose"':'') + '>'
    + items.map((text,index) => text
      ? '<p' + (indexed?' data-paragraph="'+index+'"':'') + '>' + esc(text) + '</p>'
      : '<div class="n-pause" aria-hidden="true"></div>').join('') + '</div>';
}
function preface() {
  const lines = fs.readFileSync(path.join(project, 'novel-preface.txt'),'utf8').trimEnd().split(/\r?\n/);
  const title = lines.shift();
  while(lines[0]==='')lines.shift();
  if(lines.at(-1)==='犬山静')lines.pop();
  while(lines.at(-1)==='')lines.pop();
  return '<section class="n-preface" id="preface" aria-labelledby="preface-title"><div class="n-section-label">前口上</div>'
    + '<h2 id="preface-title">' + esc(title) + '</h2>' + paragraphs(lines)
    + '<p class="n-signature">犬山静</p><a class="n-text-link" href="morning.html">第一章から読む</a></section>';
}
function landing() {
  return head('人数分｜犬山静｜Before We Eat',bookDescription,bookUrl)
    + '<body class="novel-page n-landing">' + header(true) + '<main id="main" class="n-landing-main">'
    + '<section class="n-book-intro" aria-labelledby="book-title"><figure class="n-book-cover"><img src="../novel-assets/cover.webp" width="1024" height="1536" alt="人数分　犬山静。いくつもの器が並ぶ食卓で、小さな椀へ料理をよそう手を描いた表紙。" fetchpriority="high"></figure>'
    + '<div class="n-intro-copy"><p class="n-kicker">特集小説</p><h1 id="book-title">人数分</h1><p class="n-intro-author">犬山静</p>'
    + '<p class="n-opening-quote">「食べないで帰る子がいても、<br class="n-wide-break">いいんですね」</p>'
    + '<p class="n-intro-description">料理教室を開くことになった、<br>ある食堂の主人の物語。</p>'
    + '<p class="n-book-length">全八章</p><div class="n-intro-links"><a class="n-primary" href="morning.html">第一章から読む</a>'
    + '<a class="n-secondary n-resume-link" data-resume-link hidden>続きから読む</a></div>'
    + '<p class="n-resume-detail" data-resume-detail hidden></p><a class="n-preface-link" href="#preface">この物語を書いたわけ</a></div></section>'
    + preface() + '<section id="contents" class="n-book-contents" aria-labelledby="book-contents-title"><div class="n-section-label">全八章</div>'
    + '<h2 id="book-contents-title">目次</h2>' + toc() + '</section></main>' + footer() + dialog() + scripts();
}
function scenePage(scene,index) {
  const chapter = novelChapters.find(c => c.number===scene.chapter_number);
  const within = chapter.scenes.findIndex(s => s.id===scene.id)+1;
  const previous = novelScenes[index-1], next=novelScenes[index+1];
  const title = scene.chapter + ' ' + scene.title + ' — ' + scene.label + '｜人数分・犬山静｜Before We Eat';
  const description = '小説『人数分』犬山静。' + scene.chapter + '「' + scene.title + '」の「' + scene.label + '」。';
  let ending = '';
  if(next){
    const crossChapter = next.chapter_number!==scene.chapter_number;
    ending = '<a class="n-next" href="' + next.id + '.html"><span>' + (crossChapter?esc(next.chapter+'　'+next.title):'次の場面') + '</span><strong>' + esc(next.label) + '</strong></a>';
  } else {
    ending = '<section class="n-afterword-links" aria-labelledby="after-reading"><h2 id="after-reading">読み終えたら</h2><div><a href="./">表紙と目次に戻る</a><a href="../cooking.html">料理を探す</a></div></section>';
  }
  return head(title,description,bookUrl+scene.id+'.html',scene)
    + '<body class="novel-page n-reader" data-scene="' + scene.id + '">' + header(false)
    + '<main class="n-reader-shell" id="main"><aside class="n-scene-aside" aria-label="作品と挿絵">'
    + '<img class="n-scene-image" src="../novel-assets/' + scene.id + '.webp" width="1536" height="1024" alt="' + esc(alts[scene.id]) + '" fetchpriority="high">'
    + '<div class="n-book-heading"><p class="n-kicker">小説</p><a class="n-book-title" href="./">人数分</a><p class="n-author">犬山静</p></div>'
    + '<a class="n-aside-toc" href="index.html#contents">全八章の目次</a>'
    + '<p class="n-reading-position">' + esc(scene.chapter) + '<span>' + within + ' / ' + chapter.scenes.length + '</span></p></aside>'
    + '<article class="n-reading-column" aria-labelledby="chapter-heading"><header class="n-scene-heading"><div class="n-chapter-row">'
    + '<h1 id="chapter-heading" tabindex="-1"><span>' + esc(scene.chapter) + '</span>' + esc(scene.title) + '</h1>'
    + '<button class="n-type-toggle" id="type-toggle" type="button" aria-pressed="false" hidden><span class="n-type-symbol" aria-hidden="true">あ</span><span id="type-label">文字を大きく</span></button></div>'
    + '<div class="n-scene-meta"><p>' + esc(scene.label) + '</p><span>この章の ' + within + ' / ' + chapter.scenes.length + '</span></div></header>'
    + paragraphs(scene.paragraphs,'n-prose',true) + '<nav class="n-scene-end" id="scene-end" aria-label="前後の場面">'
    + ending + '<div class="n-end-utility">' + (previous?'<a class="n-previous" href="'+previous.id+'.html">前の場面　'+esc(previous.label)+'</a>':'<a class="n-previous" href="./">表紙と前口上へ</a>')
    + '<a class="n-back-top" href="#main">この場面のはじめへ</a></div></nav></article></main>'
    + footer() + dialog(scene.id) + scripts();
}
export const novelBannerStyle = [
".novel-feature{display:grid;grid-template-columns:minmax(130px,220px) minmax(0,1fr);gap:clamp(28px,5vw,70px);align-items:center;border:1px solid #1b302750;background:#f4f2e9;color:#1b3027;padding:34px clamp(24px,5vw,64px);margin-top:24px}",
".novel-feature figure{margin:0;max-width:190px;justify-self:center}.novel-feature img{display:block;width:100%;height:auto}",
".novel-feature .novel-feature-kicker{font:500 14px/1.7 'Noto Sans JP',sans-serif;letter-spacing:.15em;color:#a34429;margin:0 0 10px}",
".novel-feature h2{font:400 clamp(36px,4.5vw,64px)/1.3 'Noto Serif JP',serif;letter-spacing:.12em;margin:0}",
".novel-feature .novel-feature-author{font:14px/1.8 'Noto Sans JP',sans-serif;letter-spacing:.08em;margin:8px 0 22px}",
".novel-feature .novel-feature-quote{font:400 clamp(18px,2.1vw,25px)/1.9 'Noto Serif JP',serif;margin:0 0 22px}",
".novel-feature .novel-feature-link{display:inline-flex;align-items:center;min-height:44px;padding:10px 22px;background:#1b3027;color:#f4f2e9;font:14px/1.7 'Noto Sans JP',sans-serif;text-decoration:none}.novel-feature .novel-feature-link:hover{background:#a34429}.novel-feature a:focus-visible{outline:2px solid #a34429;outline-offset:5px}",
"@media(max-width:600px){.novel-feature{grid-template-columns:1fr;padding:26px 24px;gap:24px}.novel-feature figure{max-width:170px}.novel-feature .novel-feature-copy{text-align:center}.novel-feature .novel-feature-author{margin-bottom:16px}.novel-feature .novel-feature-quote{font-size:18px}.novel-feature h2{font-size:40px}}"
].join('\n');
export function novelBanner(){
  return '<section class="novel-feature" aria-labelledby="novel-feature-title"><figure><a href="ninzuubun/" tabindex="-1" aria-hidden="true">'
    + '<img src="novel-assets/cover.webp" width="1024" height="1536" alt="" loading="lazy"></a></figure>'
    + '<div class="novel-feature-copy"><p class="novel-feature-kicker">特集小説 · 全八章</p><h2 id="novel-feature-title">人数分</h2>'
    + '<p class="novel-feature-author">犬山静</p><p class="novel-feature-quote">「食べないで帰る子がいても、いいんですね」</p>'
    + '<a class="novel-feature-link" href="ninzuubun/">表紙を開いて読む</a></div></section>';
}
export function renderNovel({dist=new URL('dist/', import.meta.url),write,allowMissingAssets=false}={}){
  const output = dist instanceof URL ? fileURLToPath(dist) : path.resolve(dist);
  fs.mkdirSync(path.join(output,'ninzuubun'),{recursive:true});
  fs.mkdirSync(path.join(output,'novel-assets'),{recursive:true});
  const emit = write || ((file,html) => fs.writeFileSync(path.join(output,file),html));
  for(const asset of ['novel-reader.css','novel-reader.js',...novelAssets]){
    const source=path.join(project,asset),target=path.join(output,asset);
    if(!fs.existsSync(source)){
      if(allowMissingAssets && asset.startsWith('novel-assets/'))continue;
      throw new Error('Missing novel asset: '+asset);
    }
    fs.copyFileSync(source,target);
  }
  emit('ninzuubun/index.html',landing());
  novelScenes.forEach((scene,index) => emit('ninzuubun/'+scene.id+'.html',scenePage(scene,index)));
  return novelManifest;
}
