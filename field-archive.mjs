import fs from 'node:fs';

export const fieldGroups = JSON.parse(fs.readFileSync(new URL('field-records.json', import.meta.url), 'utf8'));
const captions = {
"record17":"アヒルが頭を水に浸せない環境を考えるための構成場面","record20":"七面鳥のくちばしの上の肉垂を切除するを考えるための構成場面","record26":"子牛を個別の囲いで育てるを考えるための構成場面","record27":"白い子牛肉を作るために鉄を制限するを考えるための構成場面","record28":"子牛肉生産で繊維質の餌を少なくするを考えるための構成場面","record37":"ペットフード用処理施設で子牛を乱暴に扱うを考えるための構成場面","record38":"極度に衰弱した子牛への必要な処置を怠るを考えるための構成場面","record43":"乳牛の脚の関節周囲に腫れや膿瘍を考えるための構成場面","record45":"食鳥処理場への輸送・待機中の死亡を考えるための構成場面","record48":"乳用牛の分娩時期をそろえるために出産を誘発するを考えるための構成場面","record50":"乳牛の跛行を考えるための構成場面","record52":"妊娠中の母豚に少量の濃厚飼料を与え、空腹が長引くを考えるための構成場面","record53":"生後まもない子豚の圧死・飢餓死を考えるための構成場面","record54":"繁殖を終えた母豚の肩の褥瘡を考えるための構成場面","record57":"ふ化後、餌や水に初めて届くまでの遅れを考えるための構成場面","record58":"採卵鶏の羽つつきによる羽毛や皮膚の損傷を考えるための構成場面","record59":"採卵鶏が一か所に密集し、圧迫・窒息して死亡を考えるための構成場面","record60":"種鶏の交尾時に雌が負傷するを考えるための構成場面","record61":"産卵を終えた鶏の捕鳥・取り扱い時の骨折を考えるための構成場面","record63":"七面鳥の繁殖での反復的な保定を考えるための構成場面","record65":"肉用ウサギの離乳後の給餌制限を考えるための構成場面","record71":"牛のと畜で最初の気絶処置が不十分を考えるための構成場面","record72":"生きた鶏が湯槽の工程に入った事案を考えるための構成場面","record73":"妊娠中の家畜がと畜されるを考えるための構成場面",
  cattlesurgery:'身体への処置に備えて保定された雄の子牛',
  gas:'高濃度二酸化炭素の設備内で口を開けるぶた',
  sheepkill:'と畜に向けて頭と身体を保定された羊',
  mulesing:'羊の尻周辺に残るミュールジング後の瘢痕',
  malekids:'育成先の限られた雄の子ヤギが置かれた、餌の乏しい囲い',
  beak:'先端が短く処置されたひなのくちばし',
  "chicks": "選別用の容器に密集し、餌や水に届かないひな",
  "layers": "羽を広げにくい過密なケージと羽毛が傷んだ採卵鶏",
  "henhouse": "羽毛の脱落した鶏と、汚れた敷料のある過密な鶏舎",
  "broilers": "湿った敷料の上で脚を開き、立ち上がりにくい肉用鶏",
  "breeder": "餌のない給餌器をつつく親鶏",
  "farrowing": "細い柵に拘束された母ぶたと乳頭から離れて倒れた子ぶた",
  "piglets": "短く切られた子ぶたの尾の処置跡",
  "pigs": "探索する材料がなく、汚れた床に密集するぶた",
  "dairy": "短い鎖につながれ、敷料のない床で動きが制限される乳牛",
  "beef": "やせた牛が横たわる、寝床の乏しい囲い",
  "calves": "向きを変えにくい狭い囲いに一頭で隔離された子牛",
  "newborn": "母牛から柵で離され、汚れた敷料で休む子牛",
  "goats": "子ヤギの頭に残る除角芽処置の跡",
  "ducklings": "選別用の容器に密集したアヒルのひな",
  "ducks": "アヒルの身体を拘束する囲いと強制給餌の場面",
  "quail": "立つ・羽を広げる行動が制限される低いケージのウズラ",
  "turkeys": "先端への処置が行われた七面鳥の足指",
  "rabbits": "足を休める場所のない金網床に閉じ込められたウサギ",
  "sheep": "身体を保定された、尾の短い子羊",
  "livestockship": "蒸し暑い船内に密集し、口を開いて呼吸する羊",
  "cattletruck": "汚れた輸送車内で密集し、一部が横たわる子牛",
  "pigtruck": "過密な車内で口を開け、一頭が倒れたぶた",
  "poultrytruck": "羽を動かしにくい輸送容器で口を開いて呼吸する鶏",
  "processing": "汚れた搬入通路で倒れ、自力で立てない牛",
  "poultryplant": "処理工程で脚を固定され、逆さにつられた鶏",
  "cowbarn": "乾いて休める場所がなく、深い泥に立つ牛",
  "buffalo": "湿った地面に横たわる弱った水牛の子",
  "heat": "日陰の乏しい場所で口を開け、暑熱の負担を受ける牛",
  "horse": "狭い輸送用の囲いで動きを制限される馬",
  "shearing": "毛刈りのために仰向けで保定された羊と皮膚の擦り傷",
  "geese": "胸の羽毛が抜け、保定されたガチョウ",
  "emptybarn": "浸水した豚舎で逃げ場が限られたぶた",
  "mixed": "餌や寝床の管理が行き届かず、やせた牛とぶた",
  "duckenclosure": "翼を広げられず、水浴びもできない単飼のアヒル",
  "dairyhandling": "人の足元で横たわる牛と、乱暴な取り扱いを考える場面",
  "fire": "煙が広がる豚舎で柵に閉じ込められたぶた",
  "disease": "防疫が問題となる鶏舎で、動かず横たわる鶏",
  "dental": "口を保定された子ぶたと、短く処置された歯",
  "castration": "身体への処置に備えて四肢を固定された子ぶた",
  "horn": "子牛の頭に残る除角処置の跡",
  "nose": "鼻環につながる綱で頭の向きが引かれる牛",
  "cowtail": "過去の処置で短くなった乳牛の尾",
  "birth": "外科的処置の跡が見える、体の筋肉が大きく発達した牛",
  "foot": "ウサギの足裏に生じた、毛の抜けた赤い病変",
  "ship": "港で大きく傾いた家畜運搬船"
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
const originalByNumber = {2:'layers-reference',5:'footpad',6:'sowstall-reference',55:'tail-record',69:'camel-reference'};
const localName = key => (originals[key]?'field-':'field-welfare-')+key+'.webp';
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
  +(item?'。出典 '+link(item.source)+' ／ '+link(item.license)+(key==='footpad'?'。表示用に形式・解像度を変更。':'。表示用に縮小・形式変換。'):'。飼育・取り扱い上の問題を説明するために構成した場面。制作 Before We Eat。');
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
