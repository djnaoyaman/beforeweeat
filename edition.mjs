import {fieldArchive, fieldArticlePhoto} from './field-archive.mjs';

export const species = {
 cow:{name:'牛',reading:'うし',art:'cow-art.webp',guide:'beef-cuts',cuts:[['ネック','首','細かいすじが多い','煮込み・ひき肉'],['かた','肩から前脚にかけて','赤身が多く、部位内でかたさに差がある','煮込み・薄切り'],['かたロース','肩の背中側','赤身と脂の両方がある','すき焼き・焼き物'],['リブロース','背中の中央寄り','脂のうまみが出やすい','厚切りステーキ・ロースト'],['サーロイン','腰に近い背中','きめが細かく、脂の層がつくことがある','ステーキ'],['ヒレ','背骨の内側','やわらかい赤身','ステーキ・カツ'],['ばら','胸から腹','脂と赤身が重なる','焼肉・煮込み'],['もも','後ろ脚の内側など','赤身の味を楽しめる','薄切り・ロースト','beef-round'],['そともも','後ろ脚の外側','しっかりした肉質','薄切り・煮込み'],['らんぷ','腰からお尻','やわらかさと赤身の味がある','ステーキ・ロースト'],['すね','前脚・後ろ脚の下の方','すじが多く、煮込むとほどける','シチュー','beef-shank'],['タン','舌','先端と根元で食感が異なる','薄切り焼き・煮込み']]},
 pig:{name:'ぶた',reading:'ぶた',art:'pig-art.webp',guide:'pig-cuts',cuts:[['かた','肩・前脚の上','よく動く部分で、味がしっかりしている','煮込み・炒め物'],['かたロース','肩から背中へ続く部分','赤身の間に脂が入る','しょうが焼き・焼き豚'],['ロース','背中','きめが細かく、外側に脂身がつく','とんかつ・ソテー','loin'],['ヒレ','腰のあたりの内側','細長く、脂身が少ない','ヒレカツ'],['ばら','おなか側','脂と赤身が層になる','角煮・薄切りの炒め物'],['もも','後ろ脚の上','赤身が多い','薄切り・焼き物','pork-round'],['そともも','後ろ脚の外側','きめは粗めで、しっかりした食感','薄切り・煮込み'],['スペアリブ','あばら骨まわり','骨付きで、脂と肉を一緒に味わえる','炭火焼き・煮込み','ribs']]},
 hen:{name:'にわとり',reading:'とり',art:'hen-art.webp',guide:'chicken-guide',cuts:[['むね','胸','皮なしでは脂質が比較的少ない','蒸し焼き・炒め物','chicken-cuts'],['もも','脚の上の部分','焼くと肉汁を感じやすい','皮をカリッと焼く・から揚げ','crispy-chicken'],['ささみ','むねの内側','脂が少なく、すじがある','蒸し焼き・和え物'],['手羽元','つばさの根元','骨の周りに肉がつく','煮物・スープ'],['手羽中','つばさの中央','皮の香ばしさを楽しみやすい','塩焼き'],['手羽先','つばさの先の方','皮と骨を含む','焼き物・煮物'],['せせり','首','歯ごたえがある','焼き鳥・炒め物'],['ぼんじり','尾のつけ根','脂が多い','焼き鳥'],['砂肝','胃の一部','こりっとした食感','炒め物・串焼き'],['レバー','肝臓','独特のうまみと香りがある','煮物・焼き物']]}
};
export const caseLabels={
 'case-shimane':'日本・島根県／2023年／行政資料・判決報道',
 'case-devon':'英国・デヴォン／2024年の現場調査／英国政府・州の発表',
 'case-cambridge':'英国・ケンブリッジシャー／2024年／自治体の発表',
 'case-ibaraki':'日本・茨城県／2005〜2014年度／食肉衛生検査所の調査',
 'case-footpad':'ポーランド／2024年発表／飼育研究・記録写真',
 'case-keel':'デンマーク／2021年発表／商業鶏群の研究',
 hens:'日本／神奈川県の飼育試験・農林水産省の令和6年度調査',
 chicks:'日本／2022年ほか／国会会議録・農林水産省資料'
};
export const recipes={
 'bbq-ribs':{art:'runway-rib.webp',alt:'炭火の焼き目とつやのある骨付き豚スペアリブ',items:'豚スペアリブ 500g、塩 3g、しょうゆ・はちみつ 各大さじ1、米酢 小さじ1。2〜3人分。',steps:['肉の表面の水気をふき、塩を振る。たれは別の容器で混ぜる。','屋外のふた付きグリルで、炭の真上を避けてじっくり火を入れる。骨を避けた最も厚い肉で加熱を確かめる。','仕上げに新しい刷毛でたれを薄く塗り、炭に近い側で焼き色をつける。焦げそうなら炭から離す。']},
 stew:{art:'runway-beef.webp',alt:'牛すね肉と野菜をデミグラスで煮込んだシチュー',items:'牛すね肉 400g、玉ねぎ 1個、にんじん 1本、デミグラスソース 290g、水 300mL、油 小さじ2。2〜3人分。',steps:['肉を大きめに切り、水気をふいて油で全面に焼き色をつける。いったん取り出し、同じ鍋で玉ねぎを炒める。','肉を戻して水を加え、沸いたら弱火にする。ふたを少しずらし、煮汁を見ながら静かに煮る。','串が通るくらいに軟らかくなったら、にんじんとソースを加えて煮る。最後はスプーンでほぐれる食感と、ソースの濃さを確かめる。']},
 'crispy-chicken':{art:'runway-chicken.webp',alt:'皮をこんがり焼いて切り分けた鶏もも肉',items:'皮付き鶏もも肉 1枚（約250g）、塩 小さじ1/3、油 小さじ1、好みでレモン。2人分。',steps:['皮と身の表面の水気をふき、厚いところを開いて厚みをそろえる。','フライパンに油を入れ、皮を下にして広げ、弱めの中火で焼く。出てきた脂を多すぎる分だけふく。','皮の端まで色づいたら返し、中心部75℃で1分以上が目安。厚いところで測り、十分に加熱できたら皮を上にして切り分ける。']}
};
export const additionalSources={
 cutsmaff:['農林水産省　牛、豚、鶏のお肉丸わかり図鑑','https://www.maff.go.jp/j/pr/aff/2009/spe1_02.html'],
 woah:['WOAH　アニマルウェルフェア','https://www.woah.org/en/what-we-do/animal-health-and-welfare/animal-welfare/'],
 shimane:['島根県　農林水産委員会資料（PDF）','https://www.pref.shimane.lg.jp/industry/norin/info/shiryo_/nosuisyoko_r5.data/230629nourin_siryo.pdf'],
 bss:['山陰放送　大田市の乳牛への暴力事案の判決報道','https://newsdig.tbs.co.jp/articles/bss/737018?display=1'],
 govdevon:['英国環境庁・動植物衛生庁　デヴォンの調査と判決','https://www.gov.uk/government/news/devon-farmer-jointly-prosecuted-over-horror-movie-conditions'],
 kanagawa:['神奈川県畜産技術センター　巣箱・止まり木・砂浴び場で観察した鶏の行動','https://www.pref.kanagawa.jp/docs/a2d/cnt/sciencelab/202402tikusangijutu.html'],
 kokkai:['参議院農林水産委員会（2022年11月8日）発言134・136・138','https://kokkai.ndl.go.jp/simple/detail?minId=121015007X00320221108&spkNum=134'],
 devon:['Devon County Council　現場調査と裁判の発表','https://www.devon.gov.uk/news/honiton-farmer-prosecuted-for-pollution-and-animal-welfare-offences/'],
 cambridge:['Cambridgeshire County Council　牛・豚の飼養をめぐる判決','https://www.cambridgeshire.gov.uk/news/farmer-sentenced-following-animal-welfare-offences'],
 ibaraki:['茨城県　食肉衛生検査所事業概要（平成26年度）','https://www.pref.ibaraki.jp/hokenfukushi/seiei/eisei/documents/h26jigyougaiyou_1.pdf'],
 footstudy:['Damaziak ほか（2024）Agriculture 14, 1091　図2','https://doi.org/10.3390/agriculture14071091'],
 keel:['Thøfner ほか（2021）PLOS ONE　デンマークの採卵鶏の胸骨調査','https://doi.org/10.1371/journal.pone.0256105'],
 diet:['厚生労働省　食事バランスガイド','https://www.mhlw.go.jp/bunya/kenkou/eiyou-syokuji.html']
};
export function editionMarkup({r,typeset,pageLink,hasAsset}){
 const {slug}=r;
 const paragraph=(value)=>'<p>'+typeset(value)+'</p>';
 const heading=(value)=>'<h2>'+typeset(value)+'</h2>';
 const links=(items)=>'<div class="entries">'+items.map(([path,label])=>pageLink(path,label)).join('')+'</div>';
 const figure=(image,alt,caption)=>'<figure class="animal-plate"><img src="'+image+'" alt="'+alt+'" loading="lazy"><figcaption>'+typeset(caption)+'</figcaption></figure>';
 const group=Object.entries(species).find(([key,s])=>key===slug||s.guide===slug);
 if(group){
  const [key,s]=group;
  const img=figure(s.art,s.name+'の体を横から描いた線画','横から見た'+s.name+'。体の位置を見つけるための線画です。');
  if(slug===key)return img+links([[s.guide,'主要部位を見る'],['field-cases','現場の記録を読む']]);
  const cards=s.cuts.map(([name,place,body,meal,article])=>'<div class="cut-item"><dt>'+typeset(name)+'</dt><dd>'+paragraph(place)+paragraph(body)+'<p class="cut-meal">'+typeset(meal)+'</p>'+(article?pageLink(article,'詳しく読む'):'')+'</dd></div>').join('');
  return img+heading('主な部位と向く料理')+'<dl class="cut-list">'+cards+'</dl>'+links([[key,'動物のくらしを知る'],['nutrition','栄養を比べる']]);
 }
 if(['animals','cuts'].includes(slug)){
  const cards=Object.entries(species).map(([key,s])=>'<div><a href="'+(slug==='animals'?key:s.guide)+'.html"><img src="'+s.art+'" alt="" loading="lazy"><strong>'+typeset(s.name)+'</strong></a></div>').join('');
  return '<div class="species-gallery">'+cards+'</div>'+(slug==='animals'?links([['field-cases','現場で報告された事例'],['welfare','アニマルウェルフェアを知る']]):links([['nutrition','数字で比べる']]));
 }
 if(slug==='field-cases')return fieldArchive({caseLabels,typeset,pageLink});
 const casePhoto=fieldArticlePhoto(slug,typeset);
 if(slug==='case-footpad')return casePhoto;
 if(slug==='case-shimane')return casePhoto+'<details class="evidence"><summary>当時の報道を読む（暴力の映像を含む場合があります）</summary><p><a href="https://newsdig.tbs.co.jp/articles/bss/737018">山陰放送の判決記事を開く</a></p></details>';
 if(slug==='case-keel')return casePhoto+'<p><a href="https://doi.org/10.1371/journal.pone.0256105.g001">研究の図1で、農場の鶏の群れごとの差を見る</a></p>';
 if(caseLabels[slug])return casePhoto;
 if(slug==='mina')return heading('食べることと、どうぶつのくらし')+paragraph('私はヴィーガンではありません。お肉を食べます。せっかく命をいただくのなら、食べられる量を買い、その部位に合う方法でおいしく料理し、感謝していただきたいと思っています。')+paragraph('同じくらい大事なのが、アニマルウェルフェアです。食卓に届くまでの間、その動物は水を飲み、体を動かし、安心して休めたか。なくせる痛みや苦しみ、無用な暴力を一つでも減らしたい。食べる自分にも、考え、知り、選べることがあると思います。')+paragraph('「いただきます」のあとに残るのは、感謝と、次に何を知りたいかという問いです。')+'<p class="folio-sign">MINA</p>';
 if(slug==='nutrition')return '<table class="nutrition"><caption>生の可食部100gあたり</caption><thead><tr><th scope="col">肉の種類</th><th scope="col">たんぱく質</th><th scope="col">脂質</th><th scope="col">鉄</th></tr></thead><tbody><tr><th scope="row">輸入牛もも・赤肉</th><td>21.2g</td><td>4.3g</td><td>2.6mg</td></tr><tr><th scope="row">大型種豚もも・赤肉</th><td>22.1g</td><td>3.6g</td><td>0.9mg</td></tr><tr><th scope="row">若どりむね・皮なし</th><td>23.3g</td><td>1.9g</td><td>0.3mg</td></tr></tbody></table>';
 if(slug==='shopping')return heading('パックのここを見る')+'<ol><li>品名と部位。作りたい料理に合う厚みか、骨付きかを確認。</li><li>量と値段。骨付きは骨も含めた量。人数分の量を決める。</li><li>期限・保存方法・原産地。帰ったら表示に合わせて保管する。</li></ol>'+links([['storage','家での保存'],['heat','中心までの加熱']]);
 if(slug==='welfare')return heading('動物の様子から考える')+'<ul><li>水と食べ物は足りる？</li><li>乾いた場所で、体を動かしたり休んだりできる？</li><li>痛みや病気に気づき、手当てを受けられる？</li><li>ぶたが鼻で探るような、その動物らしい行動ができる？</li><li>こわさや強いストレスを減らす工夫はある？</li></ul>'+links([['cow','牛のくらし'],['pig','ぶたのくらし'],['hen','にわとりのくらし'],['field-cases','現場で何が起きたか']]);
 if(slug==='cooking'){
  return '<div class="meal-gallery">'+Object.entries(recipes).map(([id,recipe])=>'<div>'+(hasAsset(recipe.art)?'<img src="'+recipe.art+'" alt="'+recipe.alt+'" loading="lazy">':'')+pageLink(id)+'</div>').join('')+'</div>'+links([['storage','肉の保存を知る'],['heat','安全に火を通す']]);
 }
 if(recipes[slug]){
  const r=recipes[slug];return (hasAsset(r.art)?'<figure class="food-plate"><img src="'+r.art+'" alt="'+r.alt+'" loading="lazy"></figure>':'')+heading('材料')+paragraph(r.items)+heading('作り方')+'<ol>'+r.steps.map(s=>'<li>'+typeset(s)+'</li>').join('')+'</ol>'+paragraph('肉の厚みや火力に合わせて調節します。中心部75℃で1分間以上を目安に、温度計で確かめます。')+links([['heat','肉の加熱を確かめる']]);
 }
 if(slug==='start')return links([['cow','牛から読む'],['pig','ぶたから読む'],['hen','にわとりから読む'],['field-cases','現場事例'],['lessons','先生・保護者の方へ']]);
 return '';
}
