// Original line drawings for comparison, never documentary images.
const svg=(w,h,inner)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true" focusable="false"><rect width="${w}" height="${h}" fill="#f6eddb"/><g stroke="#2c4a38" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
const pig = '<ellipse cx="53" cy="27" rx="41" ry="20" fill="#dcad92"/><path d="M79 32q11-24 21-16l-2 8 17 4v10l-23 2M30 43l-6 9h15l4-7m22-3 8 8h12l-3-9M13 25q-10 4-10-2t6-3" fill="#dcad92"/><circle cx="97" cy="31" r="1.5" fill="#2c4a38"/>';
const pen = '<rect x="13" y="13" width="294" height="124" fill="none" stroke="#7d8167"/><path d="M14 106h292" stroke="#7d8167" stroke-dasharray="5 5"/>';
const dry = svg(320,150,pen+'<path d="M20 119h33m8 0h18m16 4h27m13-5h21m17 0h22m12 4h26m18-4h38" stroke="#92774e"/><g transform="translate(31 65)">'+pig+'</g><g transform="translate(184 36) scale(.8)">'+pig+'</g>');
const wet = svg(320,150,pen+'<path d="M16 117q30-16 62-5t73 2q30 18-14 19H31q-18-3-15-16z" fill="#bbcccb" stroke="#526b6b"/><g transform="translate(36 65)">'+pig+'</g><g transform="translate(123 45) scale(.8)">'+pig+'</g>');
const sowBefore = svg(320,145,'<path d="M19 39h281v75H19zM41 41v73m32-73v73m32-73v73m36-73v73m36-73v73m37-73v73m34-73v73m32-73v73" fill="none" stroke="#85876f"/><g transform="translate(67 42) scale(1.42)">'+pig+'</g>');
const sowAfter = svg(320,145,'<path d="M15 18h290v109H15zM15 77h290m-290 29h290" fill="none" stroke="#85876f"/><g transform="translate(58 25) scale(1.25)">'+pig+'</g><g transform="translate(36 93) scale(.39)">'+pig+'</g><g transform="translate(93 100) scale(.39)">'+pig+'</g><g transform="translate(151 93) scale(.39)">'+pig+'</g><path d="M238 95h50v21h-50z" fill="#e7bd76" stroke="#92774e"/>');
const calf = svg(400,124,'<g fill="none"><path d="M38 82v-20q0-12 12-12h27q14 0 14 12v20m-47 0v10m41-10v10M53 50l-7-14 18 11 16-11-5 14m34 18h24l-6-6m6 6-6 6M174 90h25V57h-25zm0-33 6-7h13l6 7m-18-7v-9h11v9m43 19h22l-6-6m6 6-6 6m44 5h51l-6 16h-39zm12 0-4-17m12 17 2-22m7 22 9-19"/></g><circle cx="66" cy="61" r="2" fill="#2c4a38"/>');
const foot = svg(400,155,'<path d="M202 134q-17 0-19-14l-5-28-47-5q-13-2-12-11 1-8 15-7l47 4-7-37q-2-12 8-14 9-2 14 10l13 34 23-34q7-10 14-5 10 5 4 18l-15 34 39-1q12 0 12 9 0 10-12 11l-46 2-5 23q-3 12-21 12z" fill="#dfb375"/><ellipse cx="204" cy="101" rx="19" ry="16" fill="#eee1b7"/><path d="M224 101h91" fill="none" stroke-dasharray="5 5"/><circle cx="317" cy="101" r="4" fill="#eee1b7"/>');
const pigSource={url:'https://www.maff.go.jp/j/chikusan/sinko/attach/pdf/animal_welfare-133.pdf#page=18',label:'農林水産省「豚の飼養管理に関する技術的な指針」（2023年、日本、15〜18頁）'};
const cowSource={url:'https://www.maff.go.jp/j/chikusan/sinko/attach/pdf/animal_welfare-135.pdf#page=11',label:'農林水産省「乳用牛の飼養管理に関する技術的な指針」（2023年、日本、8頁）'};
const chickenSource={url:'https://www.maff.go.jp/j/chikusan/sinko/attach/pdf/animal_welfare-131.pdf#page=14',label:'農林水産省「ブロイラーの飼養管理に関する技術的な指針」（2023年、日本、11〜12・18〜19頁）'};
const sources = {
 forest:{url:'https://morisue-farm.com/',label:'森末牧場（香川県まんのう町、牧場自身の説明）'},
 mizumoto:{url:'https://rakuconne.net/journal/900/',label:'水本康洋「水本牧場ブログ9　初乳給与-実践」（北海道浜中町、2024年10月、牧場主の記録）'},
 ishikawa:{url:'https://www.pref.ishikawa.lg.jp/tikusou/tayori6.html',label:'石川県畜産試験場「今年度初の子牛が産まれた！」（2020年、同試験場の記録）'},
 taira:{url:'https://doi.org/10.1292/jvms.13-0321',label:'Tairaら「Effect of Litter Moisture on the Development of Footpad Dermatitis in Broiler Chickens」（2014年、肉用鶏の比較研究）'}
};
const data={
 'pig-rest':{
   intro:'ぶたが横になるところを考えるときは、床と、となりにいるぶたとの間を見てみよう。',
   figures:[[dry,'A｜床に水たまりがなく、横になったぶたと、となりのぶたの間にすきまがあります。'],[wet,'B｜同じ広さ・角度の図で、床に水たまりがあり、ぶたの体が近くにあります。']],
   sections:[
    ['見て分かること：床と体の位置','床のどこがぬれているか。どんな<姿勢:しせい>で横になっているか。となりのぶたや<柵:さく>との間に、立ち上がったり体を伸ばしたりできるすきまがあるか。<頭の数:あたまのかず>だけでなく、休める床が実際にどれくらいあるかも見ます。'],
    ['この絵だけでは分からないこと','本当にすべるかは床の見た目だけでは分かりません。実際に立ち上がるとき足がすべらないか、いつも同じぶたが休む場所を取れないのか、時間を変えて見ると分かることがあります。この図は説明用で、<農場:のうじょう>の<記録:きろく>ではありません。'],
    ['休む場所と、水を使う場所','日本の<指針:ししん>では、ぶたに水はけのよい、かわいた休み場所を用意することをすすめています。暑いときに体を冷やすため水を使うこともあり、水があるかどうかだけで良し悪しは決めません。']
   ],
   refs:[[pigSource,'第4の1〜3：群れでの休息、すべりにくい床、体を動かせる広さ。']],
   next:[['sows',null,'母ぶたの場合は、さくの形と使う時期で、動ける<範囲:はんい>も変わります。'],['loin',null,'同じぶたの背中側を、部位図と一皿で見てみたいときに。']]
 },
 sows:{
   intro:'母ぶたを囲う<設備:せつび>でも、おなかに子がいる時期と、子を産むころでは、目的が違います。母ぶたと子ぶた、両方の動きを見ます。',
   figures:[[sowBefore,'<出産:しゅっさん>前｜<妊娠:にんしん>ストール。母ぶた一頭ごとに仕切るしくみの<模式図:もしきず>。'],[sowAfter,'<出産:しゅっさん>のころから<授乳:じゅにゅう>期｜<分娩:ぶんべん>クレートを含む区画。子ぶたの通れる横の場所と休む区画を色分けした一例。']],
   sections:[
    ['おなかに子がいる時期','<妊娠:にんしん>ストールを使う場合は、母ぶた一頭ずつの餌や体の様子を<管理:かんり>するための<柵:さく>です。細長いタイプでは体の向きを変えにくいことがあります。母ぶたを群れで飼う方式もあり、全ての<農場:のうじょう>が同じ<柵:さく>を使うわけではありません。'],
    ['子を産む前後','母ぶたが立ったり横になったりするときに、子ぶたが下に入って押される事故を防ぐことと、子ぶたが母ぶたの乳を飲めることの両方が大切です。母ぶたを囲う部分がある方式では、その分、母ぶたの動ける<範囲:はんい>がせまくなることがあります。'],
    ['「何のため」と「実際にできる」を分ける','さくの目的が分かっても、どれだけ立ちやすいか、向きを変えられるか、子ぶたが飲んだり休んだりできるかは別の問いです。さくを使う<期間:きかん>、開け閉め、親子の動きは、説明図からは決められません。']
   ],
   refs:[[pigSource,'第4の1・3：一頭ずつと群れでの<管理:かんり>、母ぶたの寝起き、子ぶたへの配慮。']],
   next:[['pig-rest',null,'母ぶたが実際に立つ、横になる、そのときの床を比べる視点へ。'],['welfare',null,'動物ができることを、場所や<設備:せつび>だけでなく、体と行動から考える入口。']]
 },
 calves:{
   intro:'子牛には、生まれてすぐに飲む乳があり、そのあとに育つ時間があります。親子を別の場所にする時期は、<農場:のうじょう>によってちがいます。',
   figures:[[calf,'生まれる → 最初の乳を飲む → ミルクを飲みながら育つ → 草などを食べる。親子を別の場所にする時期は、この図で一つに決めていません。']],
   sections:[
    ['最初の乳から、草を食べるまで','<初乳:しょにゅう>は、<出産:しゅっさん>後の母牛の最初の乳。子牛の体を守る成分をふくむので、生まれて早いうちに飲ませます。その後は乳や子牛用のミルクを与えて見守り、体の育ちに合わせて少しずつ草や<固形:こけい>のえさへ移ります。'],
    ['例1｜香川県・森末牧場','牧場の<公開:こうかい>説明では、子牛を生まれてすぐに母牛と別に育て、母牛の<初乳:しょにゅう>を与えています。実際に一緒だった分数までは、その説明にはありません。'],
    ['例2｜北海道・水本牧場','2024年10月に牧場主は、母牛が子牛の体をなめ、自分で立てるようになったのを見てから、小屋に移すことが多いと説明しました。そのあと母牛の乳をしぼって与えています。'],
    ['育て方の理由と、親子の様子は別','人が飲んだ量や体調を見やすくするなど、<農場:のうじょう>ごとに育て方の理由があります。一方、国の<指針:ししん>では、親子が離れることは母牛にも子牛にも<負担:ふたん>とし、<負担:ふたん>が大きくならないよう計画することをすすめています。二つの例はそれぞれの<公開:こうかい>説明で、全国のやり方や、親子の<負担:ふたん>の大小を示す比較調査ではありません。']
   ],
   refs:[[cowSource,'親子が離れるときの<負担:ふたん>と、段階的な<離乳:りにゅう>。'],[sources.forest,'「子牛」の説明：<農場:のうじょう>での流れ。'],[sources.mizumoto,'母牛と過ごす時間と、最初の乳を与える手順。'],[sources.ishikawa,'同試験場で生まれた子牛の<初乳:しょにゅう>から<離乳:りにゅう>まで。']],
   next:[['cow',null,'子牛が育つ話から、母牛の乳が食卓に届く別の流れへ。'],['people',null,'動物の様子を見て、育て方を変えた人たちの<記録:きろく>を読む。']]
 },
 feet:{
   intro:'にわとりの足のうらが地面にふれるところを見てから、床、水を飲む場所、歩く様子の順に考えます。',
   figures:[[foot,'下から見た足のうらの<模式図:もしきず>。丸は体を支えて床にふれる部分です。傷は描いていません。']],
   sections:[
    ['1｜床を見てみる','おがくずなど、床に<敷:し>いたものが、ぬれて固まっていないかを見ます。肉用のにわとりでは、ぬれた床との<接触:せっしょく>が続くと、足のうらの皮ふが荒れる原因の一つになります。'],
    ['2｜水を飲む場所のまわり','飲み水の器具の下だけぬれているか、別の場所も同じか。水もれのほか、空気の入れかえや、同じ場所にいるにわとりの数など、床に関わる<条件:じょうけん>はいくつかあります。'],
    ['3｜歩き方を見る','歩くとき片足をかばったり、えさや水まで行きにくそうにしたりする様子も手がかりです。歩き方が変わる理由は、足のうらのほかにもあります。絵や一枚の写真だけでは病気や原因を決められません。'],
    ['この研究で分かったこと','肉用鶏をぬれた床材とかわいた床材で育てて比べた研究では、ぬれたほうで足のうらの<炎症:えんしょう>が早く見られました。これは研究で比べた<条件:じょうけん>の結果で、あらゆる<農場:のうじょう>の状態を表す数値ではありません。']
   ],
   refs:[[chickenSource,'第4の2・第7の2〜3：床材、歩き方、足のうらの皮ふ。'],[sources.taira,'床材の水分と足のうらの変化を比べた原著。図は研究の写真の転載ではありません。']],
   next:[['case-footpad','足のうらを調べた<記録:きろく>','調査が何を調べたかを本文から読めます。写真は、見たいときだけ既存の案内から。'],['hens',null,'床だけでなく、にわとりが動く場所や休む場所も見てみたいときに。']]
 }
};
export function hasWelfareGuide(slug){return Object.hasOwn(data,slug);}
export function welfareGuideLead(slug,{typeset}) {return data[slug]?'<p class="lead">'+typeset(data[slug].intro)+'</p>':'';}
export function welfareGuide(slug,{typeset}){
 const d=data[slug];if(!d)return '';
 const figs=d.figures.map(([art,cap])=>'<figure>'+art+'<figcaption>'+typeset(cap)+'</figcaption></figure>').join('');
 const chapters=d.sections.map(([title,p],i)=>'<section aria-labelledby="welfare-part-'+i+'"><h2 id="welfare-part-'+i+'">'+typeset(title)+'</h2><p>'+typeset(p)+'</p></section>').join('');
 return '<div class="welfare-guide"><div class="welfare-figures"'+(d.figures.length>1?' data-paired="true"':'')+'>'+figs+'</div>'+chapters+'</div>';
}
export function welfareGuideSources(slug,{typeset}){
 const d=data[slug];if(!d)return '';
 return '<details class="references"><summary>出典</summary><ul>'+d.refs.map(([src,why])=>'<li><a href="'+src.url+'">'+typeset(src.label)+'</a> '+typeset(why)+'</li>').join('')+'</ul></details>';
}
export function welfareGuideNext(slug,{typeset,pageLink}){
 const d=data[slug];if(!d)return '';
 return '<ul class="story-list welfare-next">'+d.next.map(([url,label,why])=>'<li>'+pageLink(url,label)+'<p>'+typeset(why)+'</p></li>').join('')+'</ul>';
}
export function welfareGuideSearchText(slug,{plain}){
 const d=data[slug];return d?plain([d.intro,...d.figures.map(([,cap])=>cap),...d.sections.flat()].join(' ')):'';
}
export const welfareGuideStyle='<style>.welfare-figures{display:grid;grid-template-columns:minmax(0,1fr);gap:1rem;margin:1.5em 0 2em;max-width:44rem}.welfare-figures[data-paired]{grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr))}.welfare-figures figure{margin:0;min-width:0}.welfare-figures svg{display:block;width:100%;height:auto}.welfare-figures figcaption{margin-top:.6em;font-size:.92em}.welfare-guide section{margin:1.3em 0}.welfare-guide h2{margin:0 0 .36em}.welfare-guide p,.welfare-next p{margin:.35em 0 0}.welfare-next a{text-decoration:underline;text-underline-offset:.21em}.welfare-next a:focus-visible{outline:2px solid currentColor;outline-offset:.2em}</style>';
