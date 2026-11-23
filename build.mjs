import {remainingOnward} from './remaining-onward.mjs';
import {plateRelated} from './recipe-reading-routes.mjs';
import {hasWelfareGuide,welfareGuideLead,welfareGuide,welfareGuideSources,welfareGuideNext,welfareGuideStyle} from './welfare-guides.mjs';
import {priorityFoodMarkup, priorityFoodNext} from './priority-food.mjs';
import {priorityEditorialPage} from './priority-editorial-pages.mjs';
import {cookingSafety, cookingSafetySources, cookingSafetyNext, cookingSafetyStyle, hasCookingSafety} from './cooking-safety.mjs';
import {plateRecipes} from './plate-recipes.mjs';
import {publicationRows as rows} from './publication.mjs';
import fs from 'node:fs';
import {meatIronMarkup} from './meat-iron.mjs';
import {animalsDirectory, chapterHeader, contentsPage} from './featured-directory.mjs';
import {representativeLoin, representativeNext} from './representative-content.mjs';
import {cookingContents, cutsContents, kitchenAssets} from './chapter-features.mjs';
import {fieldAssets, fieldGroups, articleChecks, factCheck} from './field-archive.mjs';
import {species, caseLabels, additionalSources, editionMarkup} from './edition.mjs';
import {editorialContextMarkup} from './editorial-context.mjs';
import {learningMarkup, hasLearningSheet} from './learning.mjs';
const project = new URL('.', import.meta.url);
const dist = new URL('dist/', project);
fs.mkdirSync(dist,{recursive:true});
for (const name of ['meat-iron.css','meat-iron-data.json','reading.css','editorial-context.css','directory-animals.css','representative-content.css','priority-editorial.css','reading.js','featured-chapters.css','chapter-search.js','field-finder.js','chapter-cuts.js','front-links.css','pig.jpg','rib.jpg','og.jpg','icon.svg','brand.svg','logo.webp','favicon.png','apple-touch-icon.png','icon-192.png','icon-512.png','icon-maskable.png','.nojekyll']){
 const asset=new URL(name,project);
 if(fs.existsSync(asset))fs.copyFileSync(asset,new URL(name,dist));
}
for(const name of ['worksheet-beef.pdf','worksheet-pork.pdf','worksheet-chicken.pdf','worksheet-diary.pdf']){
 const asset=new URL(name,project);
 if(fs.existsSync(asset))fs.copyFileSync(asset,new URL(name,dist));
}
for (const name of [...kitchenAssets,'cow-art.webp','pig-art.webp','hen-art.webp','runway-rib.webp','runway-beef.webp','runway-chicken.webp','animal-view.js']){
 const asset=new URL(name,project);
 if(fs.existsSync(asset))fs.copyFileSync(asset,new URL(name,dist));
}
for(const name of fieldAssets){
 const asset=new URL(name,project);
 if(!fs.existsSync(asset))throw new Error('Missing field image: '+name);
 fs.copyFileSync(asset,new URL(name,dist));
}
const hasAsset = (name) => fs.existsSync(new URL(name,dist));
const base = 'https://djnaoyaman.github.io/beforeweeat/';
const portfolio = 'https://djnaoyaman.github.io/';
const names = ['トップページ','このサイトと、書いている人','動物のくらしと畜産の現場','お肉の部位と栄養図鑑','ちゃんと「いただく」方法','買い物でわかること','現場を変える人たち','食卓で考える・やってみる','ことば・出典・訂正'];
const sources = {
...additionalSources,
shankmaff:['農林水産省 和牛肉の製品ガイドブック・すね（PDF）','https://www.maff.go.jp/j/chikusan/shokuniku/pdf/full_japan_1.pdf'],
meatheat:['日本フードサービス協会　衛生管理計画作成の手引き・資料編13頁（厚生労働省掲載PDF）','https://www.mhlw.go.jp/content/11130500/000496685.pdf'],
maff:['農林水産省　アニマルウェルフェアについて','https://www.maff.go.jp/j/chikusan/sinko/animal_welfare.html'],
survey:['農林水産省　令和6年度調査の採卵鶏の結果（PDF）','https://www.maff.go.jp/j/chikusan/sinko/attach/pdf/animal_welfare-116.pdf'],
chick:['農林水産省　鶏をめぐる情勢の補足説明資料（PDF）','https://www.maff.go.jp/j/chikusan/sinko/lin/l_katiku/attach/pdf/r6_niwatori-15.pdf'],
mext:['文部科学省　食品成分データベース','https://fooddb.mext.go.jp/'],
pork:['文部科学省　ぶた・もも・赤肉・生','https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11134_7'],
beef:['文部科学省　輸入牛肉・もも・赤肉・生','https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11077_7&MODE=0'],
chicken:['文部科学省　若どり・むね・皮なし・生','https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11220_7'],
loin:['日本食肉消費総合センター　ロース','https://www.jmi.or.jp/info/word/ra/ra_053.html'],
jmi:['日本食肉消費総合センター　食肉の情報','https://www.jmi.or.jp/'],
mhlw:['厚生労働省　家庭での食中毒予防','https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/syokuchu/01_00008.html'],
teacher:['文部科学省　食に関する指導の手引','https://www.mext.go.jp/a_menu/sports/syokuiku/1292952.htm'],
eggrules:['日本養鶏協会　鶏卵の表示に関する公正競争規約（PDF）','https://www.jpa.or.jp/keiran_root/pdf/rules202407_01.pdf'],
caa:['消費者庁　家庭での食品ロス対策','https://www.no-foodloss.caa.go.jp/eating-home.html']
};
const bySlug = new Map(rows.map(row=>[row.slug,row]));
if (bySlug.size !== rows.length) throw new Error('Duplicate article slug');
const plain = (text) => text.replace(/<([^:]+):[^>]+>/g,'$1').replace(/\[\[([^\[\]]+)\]\]/g,'$1');
const escape = (text) => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const readings = {必要:'ひつよう',対策:'たいさく',清潔:'せいけつ',状態:'じょうたい',記録:'きろく',換算:'かんさん',食欲:'しょくよく',体調:'たいちょう',児童:'じどう',実際:'じっさい',指針:'ししん',研究:'けんきゅう',休息:'きゅうそく',衛生:'えいせい',砂浴び:'すなあび',処理:'しょり',殺菌:'さっきん',農林水産省:'のうりんすいさんしょう',採卵鶏:'さいらんけい',肉用鶏:'にくようけい',親鶏:'おやどり',成鶏:'せいけい',鶏舎:'けいしゃ',鶏群:'けいぐん',鶏卵:'けいらん',雌鶏:'めんどり',雄鶏:'おんどり',養鶏:'ようけい',種鶏:'しゅけい',糞尿:'ふんにょう',烏骨鶏:'うこっけい',赤鶏:'あかどり',動物:'どうぶつ',食卓:'しょくたく',畜産:'ちくさん',栄養:'えいよう',図鑑:'ずかん',部位:'ぶい',脂質:'ししつ',可食部:'かしょくぶ',加熱:'かねつ',出典:'しゅってん',調査:'ちょうさ',資料:'しりょう',飼養:'しよう',乳牛:'にゅうぎゅう',獣医師:'じゅういし',生産者:'せいさんしゃ',農場:'のうじょう',雄:'おす',雌雄:'しゆう',鶏むね:'とりむね',鶏もも:'とりもも',鶏肉:'とりにく',鶏:'にわとり',平飼い:'ひらがい',囲い:'かこい',授業:'じゅぎょう',給食:'きゅうしょく',観察:'かんさつ',食感:'しょっかん',断面:'だんめん',脂身:'あぶらみ',繊維:'せんい',中心温度:'ちゅうしんおんど',訂正:'ていせい',根拠:'こんきょ',自由研究:'じゆうけんきゅう',家庭:'かてい',保護者:'ほごしゃ',編者:'へんしゃ',手引:'てびき',食品:'しょくひん',生姜焼き:'しょうがやき'};
const known = new RegExp(Object.keys(readings).sort((a,b)=>b.length-a.length).join('|'),'g');
const ruby = (base,rt) => '<ruby>'+escape(base)+'<rt>'+escape(rt)+'</rt></ruby>';
function typeset(text){
 return text.split(/(\[\[[^\[\]]+\]\]|<[^:]+:[^>]+>)/g).map(part=>{
  if(part.startsWith('[[')) return '<span class="reading-phrase">'+typeset(part.slice(2,-2))+'</span>';
  const manual = part.match(/^<([^:]+):([^>]+)>$/);
  return manual ? ruby(manual[1],manual[2]) : escape(part).replace(known,word=>ruby(word,readings[word]));
 }).join('');
}
const write=(file,text)=>fs.writeFileSync(new URL(file,dist),text);
const pageLink=(slug,label)=>'<a href="'+slug+'.html">'+typeset(label||bySlug.get(slug).title)+'</a>';
const description='食べる前に、一つ、知る。動物のくらし、肉の部位と栄養、いちばんおいしい食べ方。先生や家族と使える食育教材も。';
function meta(title,desc,path,image='og.jpg',article=false){
 const url=base+path, imageUrl=base+image;
 const ld=article?{'@context':'https://schema.org','@type':'Article',headline:title,description:desc,url,image:imageUrl,inLanguage:'ja',author:{'@type':'Person',name:'MINA'}}:{'@context':'https://schema.org','@type':'WebSite',name:'Before We Eat',url,inLanguage:'ja'};
 return '<meta name="description" content="'+escape(desc)+'"><meta name="author" content="MINA"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#f7f4e9"><link rel="canonical" href="'+url+'"><link rel="icon" href="favicon.png?v=3" sizes="32x32" type="image/png"><link rel="icon" href="icon.svg?v=3" type="image/svg+xml"><link rel="apple-touch-icon" href="apple-touch-icon.png?v=3" sizes="180x180"><link rel="manifest" href="site.webmanifest?v=3">'+Object.entries({'og:site_name':'Before We Eat','og:type':article?'article':'website','og:title':title,'og:description':desc,'og:url':url,'og:image':imageUrl,'og:image:alt':'Before We Eat の誌面イメージ','og:locale':'ja_JP','twitter:card':'summary_large_image','twitter:title':title,'twitter:description':desc,'twitter:image':imageUrl,'twitter:image:alt':'Before We Eat の誌面イメージ'}).map(([k,v])=>'<meta '+(k.startsWith('og:')?'property':'name')+'="'+k+'" content="'+escape(v)+'">').join('')+'<script type="application/ld+json">'+JSON.stringify(ld).replaceAll('<','\\u003c')+'</script>';
}
const menu = '<nav aria-label="サイト案内">'+pageLink('animals','動物のくらし')+pageLink('cuts')+pageLink('cooking')+pageLink('field-cases','現場の事例')+pageLink('shopping')+pageLink('lessons','先生・保護者の方へ')+'</nav>';
function feature(row){
 if(row.slug==='hens') return '<figure class="survey"><strong>408件の回答</strong><div aria-hidden="true">'+Array.from({length:408},(_,i)=>'<i class="n'+(i<304?1:i<363?2:3)+'"></i>').join('')+'</div><figcaption>ケージのみ304件 ／ 平飼いのみ59件 ／ 両方45件</figcaption></figure>';
 if(row.slug==='loin') return representativeLoin({typeset});
 return '';
}
const groupLanding={2:'animals',3:'cuts',4:'cooking',5:'shopping',6:'people',7:'lessons',8:'sources'};
function directory(row){
 if(groupLanding[row.group]!==row.slug)return '';
 const links=rows.filter(r=>r.group===row.group&&r!==row).map(r=>'<li>'+pageLink(r.slug)+'</li>').join('');
 return '<section><h2>この章で読む</h2><ul class="story-list">'+links+'</ul></section>';
}
function extra(row){
 const learning=learningMarkup(row,{typeset,pageLink,species});
 if(learning)return learning;
 if(row.slug==='mina')return '<p><a href="'+portfolio+'">MINAのサイトへ</a></p>';
 if(row.slug==='corrections')return '<p><a href="https://github.com/djnaoyaman/beforeweeat/issues/new">記事について知らせる</a></p>';
 return '';
}
const featuredLabels = {start:'すべての目次', cooking:'料理', 'field-cases':'現場の事例', cuts:'部位図鑑'};
const chapterFonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&amp;family=Noto+Sans+JP:wght@400;500;600&amp;family=Noto+Serif+JP:wght@400;500;600&amp;display=swap">';
const readerOptions = '<div class="reader-options" aria-label="読み方"><button type="button" data-ruby aria-pressed="true">ふりがな</button><button type="button" data-size aria-pressed="false">大きな文字</button></div>';
const footer = '<footer><a href="start.html">すべての目次</a><a href="mina.html">編者 MINA</a><a href="corrections.html">更新・訂正</a></footer>';

function featuredBody(row) {
 const helpers = {rows, typeset, pageLink, hasAsset};
 if(row.slug==='start')return contentsPage({...helpers, names, groups:fieldGroups, plain});
 const breadcrumb = '<div class="trionav">'+pageLink('start','すべての目次')+'<span aria-hidden="true">／</span>'+typeset(featuredLabels[row.slug])+'</div>';
 const chapterTitle = row.slug==='field-cases'?'[[畜産の現場で]][[報告された事例]]':row.title;
 const content = row.slug==='cooking'?cookingContents(helpers)
  :row.slug==='cuts'?cutsContents(helpers)
  :editionMarkup({r:row,typeset,pageLink,hasAsset});
 return breadcrumb+'<h1>'+typeset(chapterTitle)+'</h1>'+content;
}
for(const r of rows){
 const title=(r.slug==='start'?'すべての目次':plain(r.title))+'｜Before We Eat';
 const page=r.slug+'.html';
 const refs=(r.slug==="cuts" ? [...r.refs,"cutsmaff"] : r.refs).map(key=>sources[key]);
 if(refs.some(ref=>!ref))throw Error('Missing source: '+r.slug);
 const check=articleChecks[r.slug];
 const sourceLabel=check?'出典':'ことばのもとになった資料を見る';
 const safety=hasCookingSafety(r.slug);
 const priority=priorityEditorialPage({r,typeset});
 const welfare=hasWelfareGuide(r.slug);
 const metadataLead=priority?priorityEditorialPage({r,typeset:plain}).lead:welfare?welfareGuideLead(r.slug,{typeset:plain}).replace(/<[^>]*>/g,''):plain(r.lead);
 const bodyHtml=priority?priority.body:welfare?welfareGuide(r.slug,{typeset}):safety?cookingSafety(r.slug,{typeset}):r.ingredients
  ? '<figure class="food-plate"><img src="'+r.art+'" alt="'+escape(r.title)+'"></figure><h2>材料（2人分）</h2><ul>'+r.ingredients.split('、').map(item=>'<li>'+typeset(item)+'</li>').join('')+'</ul><h2>作り方</h2><ol>'+r.steps.map(step=>'<li>'+typeset(step)+'</li>').join('')+'</ol><p>'+typeset('肉の火の通りは中心温度計で確かめます。最も厚いところの中心が75℃に達してから、1分以上加熱してください。')+' '+pageLink('heat','温度計で確かめるときは')+'</p>'
  : r.body.split('\n').map(section=>'<p>'+typeset(section)+'</p>').join('');
 const ironHtml=meatIronMarkup({slug:r.slug,typeset});
 const ironStyles=ironHtml ? '<link rel="stylesheet" href="meat-iron.css?v=1">' : '';
 const readerEdition=priority||welfare ? '' : r.slug==='animals' ? editorialContextMarkup({r,typeset,pageLink})+animalsDirectory({typeset}) :
   editorialContextMarkup({r,typeset,pageLink})+editionMarkup({r,typeset,pageLink,hasAsset})+extra(r)+directory(r);
 const foodNext=priorityFoodNext({r,typeset,pageLink});
 const recipeNext=plateRelated({r,typeset,pageLink});
 const customNext = remainingOnward[r.slug]?.map(([href,label,reason]) => {
  if(!/^[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/.test(href) || !bySlug.has(href.split('.')[0]) || !label || !reason) throw Error('Invalid onward link in ' + r.slug);
  return '<li><a href="'+escape(href)+'">'+typeset(label)+'</a><p>'+typeset(reason)+'</p></li>';
 });
 const contextualAside = customNext ? '<aside class="representative-next" aria-labelledby="onward-reading"><h2 id="onward-reading">この続きが気になったら</h2><ul>'+customNext.join('')+'</ul></aside>' : null;
 const articleAside=priority?.related ?? representativeNext({r,typeset,pageLink}) ?? foodNext ?? recipeNext ?? contextualAside ?? '<aside aria-label="次に読む"><h2>次は、どれを読む？</h2><ul class="story-list">'+r.links.map(slug=>'<li>'+pageLink(slug)+'</li>').join('')+'</ul></aside>';
 const readerAside=r.slug==='animals' ? '' : welfare ? '<aside aria-label="次に読む"><h2>この続きが気になったら</h2>'+welfareGuideNext(r.slug,{typeset,pageLink})+'</aside>' : safety ? '<aside aria-label="次に読む"><h2>この続きが気になったら</h2>'+cookingSafetyNext(r.slug,{typeset,pageLink})+'</aside>' : articleAside;
 const extraStyles=r.slug==='animals' ? '<link rel="stylesheet" href="directory-animals.css?v=1">' :
   (['loin','ginger-pork'].includes(r.slug)||foodNext||recipeNext||contextualAside) ? '<link rel="stylesheet" href="representative-content.css?v=1">' : priority ? '<link rel="stylesheet" href="priority-editorial.css?v=1">' : welfare ? welfareGuideStyle : safety ? cookingSafetyStyle : '';
 const refsHtml=priority?'':welfare?welfareGuideSources(r.slug,{typeset}):safety?cookingSafetySources(r.slug,{typeset}):refs.length?'<details class="references"><summary>'+sourceLabel+'</summary><ul>'+refs.map(([label,url])=>'<li><a href="'+escape(url)+'">'+escape(label)+'</a></li>').join('')+'</ul></details>':'';
 if(Object.hasOwn(featuredLabels,r.slug)){
  const scripts={start:['chapter-search.js'], 'field-cases':['chapter-search.js','field-finder.js'], cuts:['chapter-cuts.js'], cooking:[]};
  const headAssets=chapterFonts+'<link rel="stylesheet" href="reading.css?v=4"><link rel="stylesheet" href="featured-chapters.css'+(r.slug==='start'?'?v=renewal1':'')+'">'+(r.slug==='field-cases'?'<link rel="stylesheet" href="representative-content.css?v=1">':'')+'<script src="reading.js?v=2" defer></script>'
   +scripts[r.slug].map(src=>'<script src="'+src+(r.slug==='start'||(r.slug==='field-cases'&&src==='field-finder.js')?'?v=renewal1':'')+'" defer></script>').join('');
  write(page,'<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+escape(title)+'</title>'
   +meta(title,plain(r.lead),page,'og.jpg',true)+headAssets+'</head><body class="featured-chapter"><a class="skip" href="#main">本文へ</a>'
   +chapterHeader(pageLink)+'<main id="main" class="contents"><article class="chapter-page">'+featuredBody(r)+refsHtml+'</article>'+readerOptions+'</main>'+footer+'</body></html>');
  continue;
 }
 write(page,'<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+escape(title)+'</title>'+meta(title,r.ingredients ? r.title+'の材料と作り方。2人分。' : metadataLead,page,r.art || (r.slug==='bbq-ribs'&&hasAsset('runway-rib.webp')?'runway-rib.webp':'og.jpg'),true)+'<link rel="stylesheet" href="reading.css?v=4"><link rel="stylesheet" href="editorial-context.css">'+extraStyles+ironStyles+'<script src="reading.js'+(r.slug==='field-cases'?'?v=2':'')+'" defer></script></head><body'+(hasLearningSheet(r.slug)?' class="worksheet-page"':'')+'><a class="skip" href="#main">本文へ</a><header class="site-head"><a class="brand" href="./"><img src="logo.webp" alt="Before We Eat" width="2172" height="724"></a><a href="start.html">すべての目次</a></header>'+menu+'<main id="main"><div class="reader-options" aria-label="読み方"><button type="button" data-ruby aria-pressed="true">ふりがな</button><button type="button" data-size aria-pressed="false">大きな文字</button></div><article><div class="rubric">'+typeset(caseLabels[r.slug]||names[r.group])+'</div><h1>'+typeset(r.title)+'</h1>'+(priority?'<p class="lead">'+priority.lead+'</p>':welfare?welfareGuideLead(r.slug,{typeset}):r.lead?'<p class="lead">'+typeset(r.lead)+'</p>':'')+feature(r)+bodyHtml+priorityFoodMarkup({r,typeset,pageLink})+readerEdition+ironHtml+refsHtml+(check?factCheck(check,typeset):'')+'</article>'+readerAside+'</main><footer><a href="start.html">すべての目次</a><a href="mina.html">編者 MINA</a><a href="corrections.html">更新・訂正</a></footer></body></html>');
}
let top=fs.readFileSync(new URL('top.template',project),'utf8').replace(/<meta name="description"[^>]*>/gi,'');
top=top.replace('</head>',meta('Before We Eat｜ちゃんと「いただきます」。',description,'')+'<meta name="referrer" content="strict-origin-when-cross-origin"><link rel="stylesheet" href="front-links.css"></head>')
.replace('トップページ・HTMLサンプル','編者 MINA')
.replace(/<span>X 000[^<]*<\/span>/,'$&')
.replace('</header>','</header><div class="school-entry"><a href="lessons.html">先生・保護者の方へ</a><a href="start.html">すべての目次</a></div>')
.replace('動きをひかえめにする</button></div></nav>','動きをひかえめにする</button><a href="lessons.html">先生・保護者の方へ</a><a href="start.html">すべての目次</a></div></nav>')
.replace('</main>','<section class="edition-index" aria-labelledby="ed-index"><h2 id="ed-index">食卓から、知りたいことへ。</h2><div>'+['animals','cuts','cooking','field-cases','shopping','people','lessons','mina','sources','start'].map(slug=>pageLink(slug)).join('')+'</div></section></main>')
.replace('href="#about">このサイトについて','href="mina.html">このサイトについて')
.replace('<button class="outline" data-info="cooking">MINAと、おいしさを探す<span>＋</span></button>','<a class="outline" href="cooking.html">MINAと、おいしさを探す<span>＋</span></a>')
.replace('お肉の場所を見てみる<span>＋</span></button>','お肉の場所を見てみる<span>＋</span></button> <a href="loin.html">ロースを図鑑で読む</a>')
.replace('href="#cook">料理へ進む','href="cooking.html">料理へ進む');
const flagship = hasAsset('runway-rib.webp')?'runway-rib.webp':'rib.jpg';
top=top
 .replace(/<script>const localImages=\{[^\r\n]*?\};/,'<script>const localImages='+JSON.stringify({pig:'pig-art.webp',logo:'logo.webp',rib:flagship})+';')
 .replace('<section class="hero" id="observe">','<section class="hero" id="observe"><div class="animal-switch" aria-label="動物を選ぶ">'+['pig','cow','hen'].map(key=>'<button type="button" data-animal="'+key+'" aria-pressed="'+(key==='pig')+'">'+species[key].name+'</button>').join('')+'</div>')
 .replace('ぶたの<ruby>体<rt>からだ</rt></ruby>を<ruby>観察<rt>かんさつ</rt></ruby>する','<span id="animal-name">ぶた</span>の<ruby>体<rt>からだ</rt></ruby>を<ruby>観察<rt>かんさつ</rt></ruby>する')
 .replace('href="loin.html">ロースを図鑑で読む','href="pig-cuts.html" id="animal-guide">ぶたの部位を見る')
 .replace('</button> <a href="pig-cuts.html" id="animal-guide">ぶたの部位を見る</a>','</button> <a href="pig-cuts.html" id="animal-guide">ぶたの部位を見る</a><a href="pig.html" id="animal-life">ぶたのくらし</a>')
 .replace('私は、お肉を食べます。<br>だからこそ、どうぶつが生きている間の<br><ruby>苦<rt>くる</rt></ruby>しみを、ひとつでも減らしたい。','私はお肉が好きです。おいしく食べながら、食卓に届く前のどうぶつのくらしも知っていたい。生きている間に減らせる<ruby>苦<rt>くる</rt></ruby>しみがあるなら、そのことも考えたいと思います。')
 .replace('そして、食卓に届いたお肉は、<br>その部位に合った、とびきりおいしい食べ方で。','作りたい料理を探しても、どうぶつの絵をのぞいても。気になった方から読んでみてください。<a class="intro-essay" href="mina.html">MINAの手紙を読む</a>')
 .replace('アニマルウェルフェアって？<span>＋</span></button>','アニマルウェルフェアって？<span>＋</span></button><a class="outline field-link" href="field-cases.html">畜産の現場で報告された事例</a>')
 .replace('<footer><a href="#top">Before We Eat</a>','<footer><a class="footer-brand" href="#top"><img src="logo.webp" alt="Before We Eat" width="2172" height="724"></a>')
 .replace('</body>','<script src="animal-view.js" defer></script></body>');
write('index.html',top);
// Every published article except the catalog itself must have a directory link and search entry.
const catalog = fs.readFileSync(new URL('start.html', dist), 'utf8');
const catalogLinks = new Set([...catalog.matchAll(/href="([^"]+)"/g)].map(match => match[1]));
const catalogData = catalog.match(/<script id="catalog-data" type="application\/json">([^<]*)<\/script>/);
const searchableUrls = new Set(JSON.parse(catalogData[1]).map(item => item.url));
for (const {slug} of rows) {
 if (slug === 'start') continue;
 const url = slug + '.html';
 if (!catalogLinks.has(url) || !searchableUrls.has(url)) throw new Error('Article missing from catalog: ' + url);
}
const urls=['',...rows.map(r=>r.slug+'.html')];
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(p=>'<url><loc>'+base+p+'</loc></url>').join('')+'</urlset>');
write('robots.txt','User-agent: *\nAllow: /\nSitemap: '+base+'sitemap.xml\n');
write('llms.txt','# Before We Eat\n\n> 肉をおいしく食べることから、動物のくらしを考える食育サイト。\n\n'+['animals','cuts','cooking','shopping','lessons','sources'].map(slug=>'- ['+plain(bySlug.get(slug).title)+']('+base+slug+'.html)').join('\n')+'\n');
write('llms-full.txt','# Before We Eat\n\n'+rows.map(r=>'## '+plain(r.title)+'\n'+base+r.slug+'.html\n\n'+plain(r.lead)+'\n'+(r.ingredients ? [r.ingredients,...r.steps].join('\n') : plain(r.body))+'\n'+r.refs.map(k=>sources[k].join(' ')).join('\n')).join('\n\n'));
const caseManuscript = [];
function addCase(heading,body,refs,check){
 const citations=refs.map(([label,url])=>'- ['+label+']('+url+')').join('\n');
 caseManuscript.push('## '+heading+'\n\n### 掲載本文\n\n'+body.trim().replace(/\n+/g,'\n\n')+'\n\n### 出典\n\n'+citations
  +'\n\n### 編集者向けの事実確認メモ\n\n「'+check.strongest+'」\n\n'+check.locator+' [原資料を開く]('+check.sourceUrl+')'
  +(check.notes?'\n\n'+check.notes:''));
}
for(const group of fieldGroups){
 for(const entry of group.entries){
  addCase(String(entry.number).padStart(2,'0')+'　'+entry.title,entry.summary,entry.sources,entry.check);
 }
}
caseManuscript.push('# 関連する個別記事');
for(const r of rows.filter(r=>articleChecks[r.slug])){
 addCase(plain(r.title),plain(r.lead)+'\n'+plain(r.body),r.refs.map(key=>sources[key]),articleChecks[r.slug]);
}
write('field-cases-manuscript.md','# Before We Eat　畜産の現場で報告された事例\n\n元の番号順に79項目、続いて関連する個別記事8本を収録。\n\n'+caseManuscript.join('\n\n')+'\n');
write('site.webmanifest',JSON.stringify({name:'Before We Eat',short_name:'Before We Eat',description,lang:'ja',start_url:'./',scope:'./',display:'browser',background_color:'#f7f4e9',theme_color:'#1b3027',icons:[{src:'icon.svg?v=3',sizes:'any',type:'image/svg+xml'},{src:'icon-192.png?v=3',sizes:'192x192',type:'image/png'},{src:'icon-512.png?v=3',sizes:'512x512',type:'image/png'},{src:'icon-maskable.png?v=3',sizes:'512x512',type:'image/png',purpose:'maskable'}]}));
write('404.html','<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>ページが見つかりません｜Before We Eat</title><link rel="stylesheet" href="'+base+'reading.css?v=4"><main><h1>ページが見つかりませんでした。</h1><p><a href="'+base+'start.html">すべての目次を開く</a></p></main></html>');
console.log('Built '+urls.length+' editorial pages.');

