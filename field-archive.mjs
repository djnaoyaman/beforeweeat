import fs from 'node:fs';

export const fieldGroups = JSON.parse(fs.readFileSync(new URL('field-records.json', import.meta.url), 'utf8'));
export const articleChecks = JSON.parse(fs.readFileSync(new URL('field-article-checks.json', import.meta.url), 'utf8'));
const captions = {
  record17:'給水器の前に立つアヒル。頭を浸せる水場がない',
  record20:'くちばしの付け根を横から見た七面鳥',
  record26:'一頭ずつ仕切られた囲いにいる子牛',
  record27:'乳を飲んで育つ子牛',
  record28:'干し草の見当たらない囲いの子牛',
  record37:'処理施設で人に扱われる子牛',
  record38:'地面に横たわる、やせた子牛',
  record43:'乳牛の脚の関節周辺の腫れ',
  record45:'輸送用のかごの中で動かずに横たわる鶏',
  record48:'出産前後の乳牛と子牛',
  record50:'脚をかばう姿勢の乳牛',
  record52:'給餌の場所にいる母豚',
  record53:'出産後の母豚と足元の子豚',
  record54:'母豚の肩にできた床ずれ',
  record57:'輸送用の箱の中に身を寄せるひな',
  record58:'羽毛が抜けた採卵鶏',
  record59:'一か所に集まり、体の重なった鶏',
  record60:'背の羽毛が抜け、皮膚が露出した雌鶏',
  record61:'鶏の体を支え、骨や関節を調べる場面',
  record63:'繁殖のために人に体を支えられた七面鳥',
  record65:'空の餌入れのそばに集まるウサギ',
  record71:'処理場で気絶処置を受ける牛',
  record72:'処理ラインで脚をつられ、湯槽の手前にいる鶏',
  record73:'処理場に運ばれる家畜',
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
  "dairyhandling": "人の足元で横たわる牛",
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
export function factCheck(check,typeset){
 const quote = '<p>「'+typeset(check.strongest)+'」</p>';
 const locator = '<p>'+escape(check.locator)+'　'+link(['原資料を開く',check.sourceUrl])+'</p>';
 const notes = check.notes ? '<p>'+typeset(check.notes)+'</p>' : '';
 return '<details class="references field-check"><summary>編集者向けの事実確認メモ</summary>'+quote+locator+notes+'</details>';
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
function protectedMedia(markup, tag = 'div') {
 return '<'+tag+' data-field-media></'+tag+'><template>'+markup+'</template>';
}
function thumbnail(key) {
 const item = originals[key];
 const label = item?.label ?? 'イメージ写真';
 return protectedMedia('<span class="field-thumbnail"><img loading="lazy" decoding="async" src="'+localName(key)+'" alt=""><small>'+label+'</small></span>', 'span');
}
export function fieldArticlePhoto(slug,typeset){
 if (!articles[slug]) return '';
 return '<details class="evidence"><summary>写真を見る（動物の傷や飼育環境を扱います）</summary>'+photo(articles[slug],typeset)+'</details>';
}

export function fieldArchive({caseLabels,typeset,pageLink}){
 const links = Object.entries(caseLabels).map(([id,label])=>'<li>'+thumbnail(articles[id])+'<p>'+typeset(label)+'</p>'+pageLink(id)+'</li>').join('');
 const total = fieldGroups.reduce((count, group) => count + group.entries.length, 0);
 const cover = '<section class="field-cover" aria-labelledby="field-cover-title"><h2 id="field-cover-title">写真を見る前に</h2>'
  +'<p>'+typeset('けがをした動物や死んだ動物、処理施設の様子を写した写真と、記録をもとにしたイメージ写真があります。')+'</p>'
  +'<p>写真を表示しなくても、すべての本文と出典を読めます。</p>'
  +'<button hidden type="button" id="show-field-photos" aria-pressed="false">内容を理解して写真を表示する</button> <a href="#field-archive">本文だけ読む</a></section>';
 const featured = cover+'<div class="fieldjump"><a href="#field-archive">全'+total+'件を探す</a>'
  +'<a href="#field-related">掘り下げ記事 '+Object.keys(caseLabels).length+'本</a></div>'
  +'<section class="docket"><p class="dateline">'+typeset('英国・デヴォン　／　2024年3月の立ち入り調査')+'</p>'
  +'<h2>'+pageLink('case-devon')+'</h2><p>'+pageLink('case-devon','調査の経過を読む')+'</p>'
  +protectedMedia(photo(articles['case-devon'],typeset))+'</section>';
 const entries = fieldGroups.map(group=>{
  const rows = group.entries.map(({number,title,context,kind,summary,sources,check,photo:scene})=>{
   const related = articlesByNumber[number];
   const key = originalByNumber[number]??scene;
   const media = protectedMedia(photo(key,typeset));
   return '<li id="record-'+number+'"><details class="field-record"><summary><span class="field-record-number">'+String(number).padStart(2,'0')+'</span><span><strong>'+typeset(title)+'</strong><small>'+typeset(context+' ／ '+kind)+'</small></span>'+thumbnail(key)+'</summary>'
    +'<div class="field-record-body"><div class="field-account">'+summary.split(/\n+/).map(p=>'<p>'+typeset(p)+'</p>').join('')+'</div>'+media
    +(related?'<p>'+pageLink(related,number===5?'ポーランドの研究記事を読む':'掘り下げ記事を読む')+'</p>':'')
    +'<h4>出典</h4><ul>'+sources.map(source=>'<li>'+link(source)+'</li>').join('')+'</ul>'+factCheck(check,typeset)+'</div></details></li>';
  }).join('');
  return '<details class="field-group" id="record-group-'+group.entries[0].number+'"><summary><h3>'+typeset(group.title)+'</h3></summary><ol class="case-records" start="'+group.entries[0].number+'">'+rows+'</ol></details>';
 }).join('');
 const search = '<div class="field-search" hidden><label for="field-query">記録を探す</label>'
  +'<input type="search" id="field-query" placeholder="地名・動物・出来事"><p id="field-count" role="status"></p></div>';
 return featured+'<section class="subindex field-index" aria-labelledby="field-archive"><h2 id="field-archive">現場の記録　全'+total+'項目</h2>'
  +search+entries+'</section>'
  +'<section class="subindex field-featured" id="field-related"><h2>記録を掘り下げて読む</h2><ul class="case-list">'+links+'</ul></section>'
  +'<p><a href="field-cases-manuscript.md" download>全記事と事実確認メモをダウンロード（Markdown）</a></p>';
}
