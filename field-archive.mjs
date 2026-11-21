import fs from 'node:fs';

export const fieldGroups = JSON.parse(fs.readFileSync(new URL('field-records.json', import.meta.url), 'utf8'));
const captions = {
 chicks:'ふ化場のひなと育成設備',layers:'採卵鶏のケージと飼養設備',henhouse:'採卵鶏が過ごす鶏舎と止まり木',
 broilers:'敷料を使った肉用鶏の鶏舎',breeder:'繁殖用の親鶏と給餌設備',
 farrowing:'母ぶたと子ぶたが過ごす分娩用の囲い',
 piglets:'子ぶたが過ごす豚舎',pigs:'ぶたの群れと豚舎の囲い',
 dairy:'牛をつないで飼う形式の牛舎',beef:'牛舎にいる肉用牛',calves:'一頭ずつの囲いで育つ子牛',
 newborn:'敷料の上で休む生まれたばかりの子牛と母牛',goats:'ヤギの子と畜舎',
 ducklings:'育成設備の中にいるアヒルのひな',ducks:'畜舎のアヒルと飲み水の設備',
 quail:'ケージに入った採卵用のウズラ',turkeys:'足とくちばしが見える七面鳥',
 rabbits:'足休めの板を置いた飼育用の囲いとウサギ',sheep:'囲いの中にいる羊と子羊',
 livestockship:'港に停泊する家畜運搬船',cattletruck:'農場で家畜を載せる車両と積み込み口',
 pigtruck:'ぶたを運ぶ車両と積み込み口',poultrytruck:'家きんを運ぶ車両と通気口のある容器',
 processing:'家畜を処理する施設の搬入通路',poultryplant:'家きんを処理する施設の設備',
 cowbarn:'屋外の地面と、屋根のある牛の休息場所',buffalo:'水牛の子と成長した水牛',
 heat:'牛が日差しを避ける屋根、換気扇、水飲み場',horse:'輸送用の囲いにいる馬',
 shearing:'羊の毛刈り台と道具',
 geese:'放牧地のガチョウと羽毛',emptybarn:'農場の畜舎と搬入口',
 mixed:'別々の囲いで飼われる牛とぶた',duckenclosure:'一羽用の囲いにいるアヒル',
 dairyhandling:'牛と牛舎の通路'
};
const originals = {
 'devon-record': {
  label:'現場写真',alt:'廃材が置かれ、汚泥に覆われた調査先の農場の敷地',
  source:['英国 Environment Agency・Animal and Plant Health Agency（2025年10月30日）','https://www.gov.uk/government/news/devon-farmer-jointly-prosecuted-over-horror-movie-conditions'],
  license:['Open Government Licence v3.0','https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/']
 },
 'sowstall-reference': {
  label:'関連写真',alt:'繁殖用の母ぶたを一頭ずつ飼う妊娠ストール',
  source:['Farm Sanctuary, Gestcrate01（Wikimedia Commons）','https://commons.wikimedia.org/wiki/File:Gestcrate01.jpg'],
  license:['CC BY 1.0','https://creativecommons.org/licenses/by/1.0/']
 },
 'camel-reference': {
  label:'関連写真',alt:'カタールのアブ・ハムール卸売市場で持ち上げられるラクダ',
  source:['Alex Sergeev（Wikimedia Commons）','https://commons.wikimedia.org/wiki/File:Camel_being_lifted_at_Abu_Hamour_Wholesale_Market.jpg'],
  license:['CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/'],
  warning:'市場の関連写真を見る（ラクダを持ち上げる場面）'
 },
 'layers-reference': {
  label:'関連写真',alt:'インドネシアの採卵鶏のケージ飼養設備',
  source:['Rickyandriandra, Kandang Baterai Ayam Layer（Wikimedia Commons、2022年）','https://commons.wikimedia.org/wiki/File:Kandang_Baterai_Ayam_Layer.jpg'],
  license:['CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/']
 },
 footpad: {
  label:'研究写真',alt:'ポーランドの研究で撮影された肉用鶏の足うらの傷を4段階で示す写真と顕微鏡写真',
  source:['Damaziak ほか（2024年）図2','https://doi.org/10.3390/agriculture14071091'],
  license:['CC BY 4.0','https://creativecommons.org/licenses/by/4.0/'],
  warning:'研究の記録写真を見る（足うらの傷が写っています）'
 },
 'tail-record': {
  label:'研究写真',alt:'食肉処理後のぶたの尾を、長さと形の異なる三つの例で比較した写真',
  source:['Romano ほか（2026年）図2','https://doi.org/10.3389/fvets.2026.1751411'],
  license:['CC BY 4.0','https://creativecommons.org/licenses/by/4.0/'],
  warning:'研究の記録写真を見る（処理後のぶたの尾が写っています）'
 }
};

const articles = {
 'case-shimane':'dairyhandling','case-devon':'devon-record','case-cambridge':'mixed',
 'case-ibaraki':'poultrytruck','case-footpad':'footpad','case-keel':'henhouse',
 hens:'layers-reference',chicks:'chicks'
};
const articlesByNumber = {
 1:'chicks',2:'hens',5:'case-footpad',12:'case-shimane',23:'case-keel',45:'case-ibaraki'
};
const originalByNumber = {2:'layers-reference',5:'footpad',6:'sowstall-reference',52:'sowstall-reference',55:'tail-record',69:'camel-reference'};
const localName = key => 'field-'+key+'.webp';
export const fieldAssets = [...new Set([
 ...fieldGroups.flatMap(group=>group.entries.map(entry=>originalByNumber[entry.number]??entry.photo)),
 ...Object.values(articles)
])].map(localName);

function escape(value){
 return value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}
function link([label,url]){
 return '<a href="'+escape(url)+'">'+escape(label)+'</a>';
}
function photo(key,typeset){
 const item = originals[key];
 const alt = item?.alt??captions[key];
 if(!alt)throw new Error('Missing field image description: '+key);
 const caption = '<strong>'+(item?.label??'イメージ写真')+'</strong>　'+typeset(alt)
  +(item?'。出典 '+link(item.source)+' ／ '+link(item.license)+(key==='footpad'?'。表示用に形式・解像度を変更。':'。表示用に縮小・形式変換。'):'。制作 Before We Eat。');
 const figure = '<figure class="field-photo"><img src="'+localName(key)+'" alt="'+escape(alt)+'" loading="lazy" decoding="async"><figcaption>'+caption+'</figcaption></figure>';
 return item?.warning?'<details class="evidence"><summary>'+typeset(item.warning)+'</summary>'+figure+'</details>':figure;
}
export function fieldArticlePhoto(slug,typeset){
 return articles[slug]?photo(articles[slug],typeset):'';
}

export function fieldArchive({caseLabels,typeset,pageLink}){
 const links = Object.entries(caseLabels).map(([id,label])=>'<li><p>'+typeset(label)+'</p>'+pageLink(id)+'</li>').join('');
 const sectionId = group => 'record-group-'+group.entries[0].number;
 const groupLinks = fieldGroups.map(group=>'<li><a href="#'+sectionId(group)+'">'+typeset(group.title)+'</a></li>').join('');
 const entries = fieldGroups.map(group=>{
  const rows = group.entries.map(({number,title,context,kind,summary,sources,photo:scene})=>{
   const related = articlesByNumber[number];
   const media = photo(originalByNumber[number]??scene,typeset);
   return '<li id="record-'+number+'"><details class="field-record"><summary><span class="field-record-number">'+String(number).padStart(2,'0')+'</span><span><strong>'+typeset(title)+'</strong><small>'+typeset(context+' ／ '+kind)+'</small></span></summary>'
    +'<div class="field-record-body"><p>'+typeset(summary)+'</p>'+media
    +(related?'<p>'+pageLink(related,number===5?'ポーランドの研究記事を読む':'掘り下げ記事を読む')+'</p>':'')
    +'<h4>原資料</h4><ul>'+sources.map(source=>'<li>'+link(source)+'</li>').join('')+'</ul></div></details></li>';
  }).join('');
  return '<section class="field-group" id="'+sectionId(group)+'"><h3>'+typeset(group.title)+'</h3><ol class="case-records" start="'+group.entries[0].number+'">'+rows+'</ol></section>';
 }).join('');
 return '<section class="field-featured"><h2>8本の掘り下げ記事</h2><ul class="case-list">'+links+'</ul></section>'
  +'<section aria-labelledby="field-archive"><h2 id="field-archive">畜産の現場で記録された79項目</h2>'
  +'<p>'+typeset('番号は調査台帳に対応します。個別事件、調査で確認された慣行、健康被害、事故、防疫の記録を収録しています。写真には、現場写真・研究写真・関連写真・イメージ写真のいずれかを記しました。')+'</p>'
  +'<ul class="field-jumps">'+groupLinks+'</ul>'+entries+'</section>';
}
