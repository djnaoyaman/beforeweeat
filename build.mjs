import fs from 'node:fs';
import {species, caseLabels, additionalSources, editionMarkup} from './edition.mjs';
const project = new URL('.', import.meta.url);
const dist = new URL('dist/', project);
fs.mkdirSync(dist,{recursive:true});
for (const name of ['reading.css','reading.js','front-links.css','pig.jpg','rib.jpg','og.jpg','icon.svg','brand.svg','logo.webp','favicon.png','apple-touch-icon.png','icon-192.png','icon-512.png','icon-maskable.png','.nojekyll']){
 const asset=new URL(name,project);
 if(fs.existsSync(asset))fs.copyFileSync(asset,new URL(name,dist));
}
for (const name of ['cow-art.webp','pig-art.webp','hen-art.webp','runway-rib.webp','runway-beef.webp','runway-chicken.webp','field-footpad.webp','animal-view.js']){
 const asset=new URL(name,project);
 if(fs.existsSync(asset))fs.copyFileSync(asset,new URL(name,dist));
}
const hasAsset = (name) => fs.existsSync(new URL(name,dist));
const base = 'https://djnaoyaman.github.io/beforeweeat/';
const portfolio = 'https://djnaoyaman.github.io/';
const names = ['トップページ','このサイトと、書いている人','動物のくらしと畜産の現場','お肉の部位と栄養図鑑','ちゃんと「いただく」方法','買い物でわかること','現場を変える人たち','食卓で考える・やってみる','ことば・出典・訂正'];
const sources = {
...additionalSources,
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
const rows = ['articles.txt','articles-v2.txt']
 .flatMap(file=>fs.readFileSync(new URL(file,project),'utf8').trim().split(/\r?\n/)).map(line=>{
 const [id,slug,title,lead,body,links='',refs=''] = line.split('|');
 return {group:Number(id[0]),slug,title,lead,body,links:links.split(',').filter(Boolean),refs:refs.split(',').filter(Boolean)};
});
const bySlug = new Map(rows.map(row=>[row.slug,row]));
const plain = (text) => text.replace(/<([^:]+):[^>]+>/g,'$1').replace(/\[\[([^\[\]]+)\]\]/g,'$1');
const escape = (text) => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const readings = {動物:'どうぶつ',食卓:'しょくたく',畜産:'ちくさん',栄養:'えいよう',図鑑:'ずかん',部位:'ぶい',脂質:'ししつ',可食部:'かしょくぶ',加熱:'かねつ',出典:'しゅってん',調査:'ちょうさ',資料:'しりょう',飼養:'しよう',乳牛:'にゅうぎゅう',獣医師:'じゅういし',生産者:'せいさんしゃ',農場:'のうじょう',雄:'おす',雌雄:'しゆう',鶏むね:'とりむね',鶏もも:'とりもも',鶏肉:'とりにく',鶏:'にわとり',平飼い:'ひらがい',囲い:'かこい',授業:'じゅぎょう',給食:'きゅうしょく',観察:'かんさつ',食感:'しょっかん',断面:'だんめん',脂身:'あぶらみ',繊維:'せんい',中心温度:'ちゅうしんおんど',訂正:'ていせい',根拠:'こんきょ',自由研究:'じゆうけんきゅう',家庭:'かてい',保護者:'ほごしゃ',編者:'へんしゃ',手引:'てびき',食品:'しょくひん',生姜焼き:'しょうがやき'};
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
 return '<meta name="description" content="'+escape(desc)+'"><meta name="author" content="MINA"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#f7f4e9"><link rel="canonical" href="'+url+'"><link rel="icon" href="favicon.png?v=2" sizes="32x32" type="image/png"><link rel="icon" href="icon.svg?v=2" type="image/svg+xml"><link rel="apple-touch-icon" href="apple-touch-icon.png?v=2" sizes="180x180"><link rel="manifest" href="site.webmanifest?v=2">'+Object.entries({'og:site_name':'Before We Eat','og:type':article?'article':'website','og:title':title,'og:description':desc,'og:url':url,'og:image':imageUrl,'og:image:alt':'Before We Eat の誌面イメージ','og:locale':'ja_JP','twitter:card':'summary_large_image','twitter:title':title,'twitter:description':desc,'twitter:image':imageUrl,'twitter:image:alt':'Before We Eat の誌面イメージ'}).map(([k,v])=>'<meta '+(k.startsWith('og:')?'property':'name')+'="'+k+'" content="'+escape(v)+'">').join('')+'<script type="application/ld+json">'+JSON.stringify(ld).replaceAll('<','\\u003c')+'</script>';
}
const menu = '<nav aria-label="サイト案内">'+pageLink('animals','動物のくらし')+pageLink('cuts')+pageLink('cooking')+pageLink('field-cases','現場の事例')+pageLink('shopping')+pageLink('lessons','先生・保護者の方へ')+'</nav>';
const lessonAnimals = {
 'lesson-beef': {key:'cow', label:'牛の教材', prompt:'牛の脚の下のほうを指してみよう。'},
 'lesson-pork': {key:'pig', label:'ぶたの教材', prompt:'ぶたの背中を指してみよう。'},
 'lesson-chicken': {key:'hen', label:'にわとりの教材', prompt:'にわとりの脚が体につながるところを探してみよう。'}
};
function feature(row){
 if(row.slug==='hens') return '<figure class="survey"><strong>408件の回答</strong><div aria-hidden="true">'+Array.from({length:408},(_,i)=>'<i class="n'+(i<304?1:i<363?2:3)+'"></i>').join('')+'</div><figcaption>ケージのみ304件 ／ 平飼いのみ59件 ／ 両方45件</figcaption></figure>';
 if(row.slug==='loin') return '<figure class="animal-plate"><img src="pig-art.webp" alt="横から見たぶたの全身"><figcaption>ぶたの背中を指してみよう。体の位置を見つけるための線画です。</figcaption></figure>';
 const animal = lessonAnimals[row.slug];
 if(animal){
  const {name,art} = species[animal.key];
  return '<figure class="animal-plate"><img src="'+art+'" alt="横から見た'+name+'の全身の線画"><figcaption>'+typeset(animal.prompt)+'</figcaption></figure>';
 }
 return '';
}
const groupLanding={2:'animals',3:'cuts',4:'cooking',5:'shopping',6:'people',7:'lessons',8:'sources'};
function directory(row){
 if(row.slug==='start')return '<section aria-labelledby="directory"><h2 id="directory">記事を探す</h2><label>ことばで探す <input id="find" type="search" placeholder="例　ぶた、給食、卵"></label><p id="count" role="status"></p><div id="catalog"><section><h3>トップページ</h3><p><a href="./">Before We Eat</a></p></section>'+names.slice(1).map((name,i)=>'<section class="chapter"><h3>'+typeset(name)+'</h3><ul>'+rows.filter(r=>r.group===i+1).map(r=>'<li data-entry data-key="'+escape(plain(r.title+' '+r.lead+' '+r.body))+'">'+pageLink(r.slug)+'</li>').join('')+'</ul></section>').join('')+'</div></section>';
 if(groupLanding[row.group]!==row.slug)return '';
 const list = (slugs) => '<ul class="story-list">'+slugs.map(slug=>'<li>'+pageLink(slug)+'</li>').join('')+'</ul>';
 const chapters = [
  ['牛',['beef-cuts','beef-shank','beef-round']],
  ['ぶた',['pig-cuts','loin','pork-round','ribs']],
  ['にわとり',['chicken-guide','chicken-cuts']],
  ['栄養',['nutrition']]
 ];
 const content = row.slug==='cuts'
  ? chapters.map(([label,slugs])=>'<section class="story-group"><h3>'+typeset(label)+'</h3>'+list(slugs)+'</section>').join('')
  : list(rows.filter(r=>r.group===row.group&&r!==row).map(r=>r.slug));
 return '<section><h2>この章で読む</h2>'+content+'</section>';
}
function extra(row){
 if(lessonAnimals[row.slug])return '<section class="worksheet"><h2>今日の観察シート</h2><p>名前 ____________________　　日付 __________</p><p>'+typeset(species[lessonAnimals[row.slug].key].name+'の体のどこだった？')+'</p><div class="write-line"></div><p>絵を見てわかったこと</p><div class="write-line"></div><p>農場の人に聞きたいこと</p><div class="write-line"></div><button type="button" data-print>観察シートを印刷</button></section>';
 if(row.slug==='lessons'){
  const cards = Object.entries(lessonAnimals).map(([slug,{key,label}]) =>
   '<div><a href="'+slug+'.html"><img src="'+species[key].art+'" alt=""><strong>'+typeset(label)+'</strong></a></div>'
  ).join('');
  return '<div class="species-gallery">'+cards+'</div><div class="entries">'+pageLink('thanks','親子で読む')+'</div>';
 }
 if(row.slug==='animals')return '<div class="entries">'+pageLink('welfare','はじめての動物福祉')+pageLink('hens','現場の記録を読む')+'</div>';
 if(row.slug==='mina')return '<p><a href="'+portfolio+'">MINAのサイトへ</a></p>';
 if(row.slug==='corrections')return '<p><a href="https://github.com/djnaoyaman/beforeweeat/issues/new">記事について知らせる</a></p>';
 return '';
}
for(const r of rows){
 const title=plain(r.title)+'｜Before We Eat';
 const page=r.slug+'.html';
 const refs=r.refs.map(key=>sources[key]);
 if(refs.some(ref=>!ref))throw Error('Missing source: '+r.slug);
 const refsHtml=refs.length?'<details class="references"><summary>ことばのもとになった資料を見る</summary><ul>'+refs.map(([label,url])=>'<li><a href="'+escape(url)+'">'+escape(label)+'</a></li>').join('')+'</ul></details>':'';
 write(page,'<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+escape(title)+'</title>'+meta(title,plain(r.lead),page,r.slug==='bbq-ribs'&&hasAsset('runway-rib.webp')?'runway-rib.webp':'og.jpg',true)+'<link rel="stylesheet" href="reading.css?v=2"><script src="reading.js" defer></script></head><body><a class="skip" href="#main">本文へ</a><header class="site-head"><a class="brand" href="./"><img src="logo.webp" alt="Before We Eat" width="2172" height="724"></a><a href="start.html">すべての目次</a></header>'+menu+'<main id="main"><div class="reader-options" aria-label="読み方"><button type="button" data-ruby aria-pressed="true">ふりがな</button><button type="button" data-size aria-pressed="false">大きな文字</button></div><article><div class="rubric">'+typeset(caseLabels[r.slug]||names[r.group])+'</div><h1>'+typeset(r.title)+'</h1><p class="lead">'+typeset(r.lead)+'</p>'+feature(r)+'<p>'+typeset(r.body)+'</p>'+editionMarkup({r,typeset,pageLink,hasAsset})+extra(r)+directory(r)+refsHtml+'</article><aside aria-label="次に読む"><h2>次は、どれを読む？</h2><ul class="story-list">'+r.links.map(slug=>'<li>'+pageLink(slug)+'</li>').join('')+'</ul></aside></main><footer><a href="start.html">すべての目次</a><a href="mina.html">編者 MINA</a><a href="corrections.html">更新・訂正</a></footer></body></html>');
}
let top=fs.readFileSync(new URL('top.html',project),'utf8').replace(/<meta name="description"[^>]*>/gi,'');
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
 .replace('私は、お肉を食べます。<br>だからこそ、どうぶつが生きている間の<br><ruby>苦<rt>くる</rt></ruby>しみを、ひとつでも減らしたい。','私はヴィーガンではありません。お肉を食べます。だからこそ、どうぶつが生きている間に、なくせる<ruby>苦<rt>くる</rt></ruby>しみを一つでも減らしたい。')
 .replace('そして、食卓に届いたお肉は、<br>その部位に合った、とびきりおいしい食べ方で。','せっかく<ruby>命<rt>いのち</rt></ruby>をいただくなら、食べられる分を買い、部位に合う調理で、最後のひと口まで感謝していただきたい。<a class="intro-essay" href="mina.html">MINAの手紙を読む</a>')
 .replace('アニマルウェルフェアって？<span>＋</span></button>','アニマルウェルフェアって？<span>＋</span></button><a class="outline field-link" href="field-cases.html">畜産の現場で報告された事例</a>')
 .replace('骨ぎわまでおいしく焼きあげたスペアリブ" loading="lazy"><span>おいしさを、最後のひと口まで。','骨ぎわまでおいしく焼きあげたスペアリブ" loading="lazy"><span>'+(flagship.startsWith('runway')?'Runwayで生成した仕上がりイメージ':'仕上がりのイメージ'))
 .replace('<footer><a href="#top">Before We Eat</a>','<footer><a class="footer-brand" href="#top"><img src="logo.webp" alt="Before We Eat" width="2172" height="724"></a>')
 .replace('</body>','<script src="animal-view.js" defer></script></body>');
write('index.html',top);
const urls=['',...rows.map(r=>r.slug+'.html')];
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(p=>'<url><loc>'+base+p+'</loc></url>').join('')+'</urlset>');
write('robots.txt','User-agent: *\nAllow: /\nSitemap: '+base+'sitemap.xml\n');
write('llms.txt','# Before We Eat\n\n> 肉をおいしく食べることから、動物のくらしを考える食育サイト。\n\n'+['animals','cuts','cooking','shopping','lessons','sources'].map(slug=>'- ['+plain(bySlug.get(slug).title)+']('+base+slug+'.html)').join('\n')+'\n');
write('llms-full.txt','# Before We Eat\n\n'+rows.map(r=>'## '+plain(r.title)+'\n'+base+r.slug+'.html\n\n'+plain(r.lead)+'\n'+plain(r.body)+'\n'+r.refs.map(k=>sources[k].join(' ')).join('\n')).join('\n\n'));
write('site.webmanifest',JSON.stringify({name:'Before We Eat',short_name:'Before We Eat',description,lang:'ja',start_url:'./',scope:'./',display:'browser',background_color:'#f7f4e9',theme_color:'#1b3027',icons:[{src:'icon.svg?v=2',sizes:'any',type:'image/svg+xml'},{src:'icon-192.png?v=2',sizes:'192x192',type:'image/png'},{src:'icon-512.png?v=2',sizes:'512x512',type:'image/png'},{src:'icon-maskable.png?v=2',sizes:'512x512',type:'image/png',purpose:'maskable'}]}));
write('404.html','<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>ページが見つかりません｜Before We Eat</title><link rel="stylesheet" href="'+base+'reading.css?v=2"><main><h1>ページが見つかりませんでした。</h1><p><a href="'+base+'start.html">すべての目次を開く</a></p></main></html>');
console.log('Built '+urls.length+' editorial pages.');

