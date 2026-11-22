// Editorial lesson plans and family activities. These are authored activities,
// not reports of classroom trials or observations of a particular farm.
const welfareSource = 'https://www.maff.go.jp/j/chikusan/sinko/attach/pdf/230726-50.pdf';
export const worksheetFiles = {
 'lesson-beef':'worksheet-beef.pdf', 'lesson-pork':'worksheet-pork.pdf',
 'lesson-chicken':'worksheet-chicken.pdf', 'food-diary':'worksheet-diary.pdf'
};
const pdfDownloadLink=(slug,typeset)=>'<a class="worksheet-download" href="'+worksheetFiles[slug]+'" download>'+typeset('1枚のシートを保存する（PDF）')+'</a>';
const sharedCards = [
 {title:'水と食べもの', text:'動物がきれいな水を飲み、必要な食べものをとれるようにします。水入れやえさ入れの点検とそうじも大切です。'},
 {title:'過ごす場所', text:'動物の動き方に合う場所、暑さや寒さへの対策、清潔さを保つ工夫が大切です。'},
 {title:'毎日、ようすを見る', text:'動物のようすを毎日見て、いつもと違うことや、場所の使いにくさがないかを確かめます。'}
];

export const lessonUnits = {
 'lesson-beef': {
  key:'cow', label:'牛の教材', food:'牛すねのシチュー', part:'すね', location:'脚の下のほう', guide:'beef-cuts',
  title:'牛の体と、休む場所を見てみよう',
  look:'脚はどこにつながっているかな。すねのあたりに丸をつけよう。',
  focus:'牛が立つ、歩く、横になって休むとき、どんな場所が必要だろう。',
  evidence:'資料2に、動物の動き方に合う場所が大切と書いてある。',
  thought:'立ったり横になったりするには、体のまわりにも場所が必要かもしれない。',
  question:'牛が休みたいときに休めているか、何を見て確かめていますか。'
 },
 'lesson-pork': {
  key:'pig', label:'ぶたの教材', food:'豚ロースのとんかつ', part:'ロース', location:'背中のあたり', guide:'pig-cuts',
  title:'ぶたの体と、過ごす場所を見てみよう',
  look:'背中はどこからどこまでかな。ロースのあたりに丸をつけよう。',
  focus:'ぶたが立つ、体の向きを変える、横になるとき、何を確かめたいだろう。',
  evidence:'資料2に、動物の動き方に合う場所が大切と書いてある。',
  thought:'となりのぶたがいても、体の向きを変えられる場所が必要かもしれない。',
  question:'ぶたが無理なく横になれているか、どんなときに確かめていますか。'
 },
 'lesson-chicken': {
  key:'hen', label:'にわとりの教材', food:'鶏ももの料理', part:'もも', location:'脚のつけ根に近いところ', guide:'chicken-cuts',
  title:'にわとりの体と、動ける場所を見てみよう',
  look:'脚は羽の下のどこにつながっているかな。もものあたりに丸をつけよう。',
  focus:'にわとりが歩く、羽を広げる、水を飲みに行くとき、何を確かめたいだろう。',
  evidence:'資料1に、動物が水を飲めるようにすることが大切と書いてある。',
  thought:'水入れがあっても、そこまで歩いて行けるかを見たい。',
  question:'水を飲みに行けていないにわとりがいないか、何を見て確かめていますか。'
 }
};

const teacherNotes = [
 '対象の目安は小学校3〜6年生です。低学年では先生が資料を読み、文の代わりに絵や口頭で答えてもかまいません。',
 'ねらいは、料理と動物の体を結びつけ、見えたこと・資料に書いてあることと、自分の考えを分け、確かめられる問いを一つつくることです。',
 '用意するものは、このページを映す画面か印刷した児童用シート、鉛筆、今日の献立です。実物の肉や動物、農場の写真は使わずに実施できます。',
 '線画は体の場所を考えるための絵です。特定の農場の記録ではなく、動物の気持ち、健康、実際の飼い方まではわかりません。資料カードも、すべての農場が実施しているという意味ではありません。',
 '食べ方や家庭の事情、宗教、アレルギーには違いがあります。食べること、食べきること、決まった感想を求めず、「まだわからない」「今日は書かない」も受け止めます。',
 '「かわいそう」「うれしそう」などの感想が出たら、否定せず「どこを見てそう考えた？　確かめるには何が必要？」と問い返します。動物の状態を手がかりと一緒に考えます。',
 '見取りは、体の場所を示せたか、資料と考えを分けられたか、調べられる問いになったかの3点です。肉を食べる・食べないという結論や、感想の方向を評価しません。'
];

function renderCards(typeset, compact=false){
 return '<div class="learning-cards'+(compact?' compact-cards':'')+'">'+sharedCards.map((card,i)=>'<div><h3>'+typeset('資料'+(i+1)+'　'+card.title)+'</h3><p>'+typeset(card.text)+'</p></div>').join('')+'</div>';
}

function worksheet(unit, species, typeset){
 const animal=species[unit.key];
 return '<section class="worksheet pupil-sheet" id="worksheet" aria-labelledby="worksheet-title">'
  +'<h2 id="worksheet-title">'+typeset(unit.title)+'</h2>'
  +'<p class="sheet-name">'+typeset('名前')+' ____________________　'+typeset('日付')+' __________</p>'
  +'<div class="sheet-observe"><figure><img src="'+animal.art+'" alt="横から見た'+animal.name+'の全身の線画"><figcaption>'+typeset('体の場所を考えるための絵')+'</figcaption></figure>'
  +'<div><p><strong>'+typeset('今日の一皿　'+unit.food)+'</strong></p><p>'+typeset(unit.look)+'</p><p class="sheet-small">'+typeset('図鑑で確かめた部位　'+unit.part+'／'+unit.location)+'</p></div></div>'
  +renderCards(typeset,true)
  +'<div class="sheet-answer"><h3>'+typeset('1　観察したこと・資料で確かめたこと')+'</h3><p>'+typeset('絵のどこ？　資料は何番？　手がかりも書こう。')+'</p><div class="answer-space" aria-label="観察したことの記入欄"></div></div>'
  +'<div class="sheet-answer"><h3>'+typeset('2　そこから考えたこと')+'</h3><p>'+typeset('「〜かもしれない」「もっと見たい」も書けます。')+'</p><div class="answer-space" aria-label="考えたことの記入欄"></div></div>'
  +'<div class="sheet-answer"><h3>'+typeset('3　次に確かめたい問い')+'</h3><p>'+typeset('だれに、何を聞く？　何を見れば確かめられる？')+'</p><div class="answer-space" aria-label="問いの記入欄"></div></div>'
  +'<p class="sheet-credit">'+typeset('資料カードは農林水産省の指針解説を要約。絵だけでは、実際の農場や動物の状態はわかりません。')+'<br>Before We Eat · '+Object.keys(lessonUnits).find(key=>lessonUnits[key]===unit)+'.html</p>'
  +'</section>';
}

function renderLesson(slug, {typeset,pageLink,species}){
 const u=lessonUnits[slug];
 const animal=species[u.key];
 const five=[
  ['1分', '一皿と体をつなぐ', '「'+u.food+'の'+u.part+'は、'+animal.name+'の体のどこかな？」と尋ねます。食べた経験がなくても、料理名から考えられます。'],
  ['2分', '見えたことを言う', '下の線画で'+u.location+'を指し、部位図鑑で確かめます。「絵には何が描いてある？」と聞き、見えたことを一つ出します。'],
  ['1分', '資料から考える', '資料2を読み、「'+u.focus+'」と問いかけます。答えを一つにまとめず、考えたことを聞きます。'],
  ['1分', '問いを残す', '「農場の人に一つ聞けるなら？」と問いかけます。声に出すかノートに一つ書き、あとで調べる問いとして残します。']
 ];
 const full=[
  ['0〜5分', '入口', '献立と料理名を確かめます。「体のどの場所かな？」と問い、児童用シートを配ります。', '料理の名前と予想を伝える。'],
  ['5〜15分', '体を観察する', u.look+' 図鑑で場所を確かめ、「絵に描いてあること」と「絵だけではわからないこと」を板書で分けます。', '場所に丸をつけ、シート1に見えたことを書く。'],
  ['15〜30分', 'くらしを考える', '資料1〜3を読みます。「'+u.focus+'」を考え、どの資料を手がかりにしたか聞きます。', 'シート1に資料番号、シート2に自分の考えを書く。'],
  ['30〜40分', '友だちと確かめる', '2〜3人で読み合い、「その手がかりはどこ？」「ほかに何を見る？」と尋ね合います。図にないことは、予想として扱います。', '違う考えを一つ聞き、必要なら書き足す。'],
  ['40〜45分', '問いを決める', '「だれに聞く？　何を見たら確かめられる？」と聞きます。次に読むページか、家族・先生と調べる方法を一つ選びます。', 'シート3に問いを書き、調べ方を口頭か余白に残す。']
 ];
 const timeline=(items)=>'<ol class="lesson-timeline">'+items.map(([time,title,text,activity])=>'<li><strong>'+typeset(time+'　'+title)+'</strong><p>'+typeset(text)+'</p>'+(activity?'<p class="pupil-action">'+typeset('子どもの活動　'+activity)+'</p>':'')+'</li>').join('')+'</ol>';
 return '<div class="learning-jumps" role="navigation" aria-label="教材の中を読む"><a href="#five-min">5分版</a><a href="#forty-five">45分版</a><a href="#materials">観察資料</a><a href="#worksheet">児童用シート</a><a href="#teacher-notes">先生用メモ</a></div>'
  +'<section class="lesson-section" id="five-min"><h2>'+typeset('給食や家庭で、5分')+'</h2><p>'+typeset('書く用紙がなくても、指さしと会話で進められます。給食では食べることを急がせず、話せる時間に使います。')+'</p>'+timeline(five)+'</section>'
  +'<section class="lesson-section" id="forty-five"><h2>'+typeset('授業で、45分')+'</h2><p>'+typeset('小学校3〜6年生を目安にした進め方の案です。読む時間や話す時間は、子どもに合わせて調節します。')+'</p>'+timeline(full)+'</section>'
  +'<section class="lesson-section" id="materials"><h2>'+typeset('一緒に見る、観察資料')+'</h2><figure class="animal-plate"><img src="'+animal.art+'" alt="横から見た'+animal.name+'の全身の線画"><figcaption>'+typeset(u.look+' この線画は特定の農場を写したものではありません。')+'</figcaption></figure><p>'+pageLink(u.guide,'部位図鑑で'+u.part+'の場所を確かめる')+'</p><h3>'+typeset('動物のくらしを考える、三つの資料')+'</h3><p>'+typeset('国の指針の解説から、大切にする点を短くまとめました。実際にできているかは、動物と現場を見て確かめる必要があります。')+'</p>'+renderCards(typeset)+'<p class="learning-source"><a href="'+welfareSource+'">'+typeset('農林水産省「アニマルウェルフェアに関する新たな国の指針について」2023年9月、本文3〜6ページ（PDF）')+'</a></p></section>'
  +'<section class="lesson-section" id="teacher-notes"><h2>'+typeset('先生・保護者の方へ')+'</h2><ul>'+teacherNotes.map(text=>'<li>'+typeset(text)+'</li>').join('')+'</ul><h3>'+typeset('言葉の分け方の例')+'</h3><dl class="learning-examples"><dt>'+typeset('資料で確かめたこと')+'</dt><dd>'+typeset('「'+u.evidence+'」')+'</dd><dt>'+typeset('そこから考えたこと')+'</dt><dd>'+typeset('「'+u.thought+'」')+'</dd><dt>'+typeset('これから確かめたい問い')+'</dt><dd>'+typeset('「'+u.question+'」')+'</dd></dl><p>'+typeset('これは話し方の例です。子どもの答えをこの文に合わせる必要はありません。この授業案は本サイトの編者が作成したもので、実施結果の報告ではありません。')+'</p></section>'
  +'<div class="print-help"><h2>'+typeset('児童用シートを使う')+'</h2><p>'+typeset('印刷すると、下のシートだけをA4縦1枚に出力する設定です。用紙をA4、倍率を100％にし、ブラウザのヘッダー・フッターを外してください。プレビューで1枚に収まるか確かめてから印刷します。画面で読む場合は、三つの見出しをノートに写して使えます。')+'</p><button type="button" data-print>'+typeset('児童用シートを印刷')+'</button>'+pdfDownloadLink(slug,typeset)+'</div>'
  +worksheet(u,species,typeset);
}

function renderLessonIndex({typeset,pageLink,species}){
 return '<section class="lesson-section"><h2>'+typeset('今日の一皿から選ぶ')+'</h2><div class="species-gallery">'+Object.entries(lessonUnits).map(([slug,u])=>'<div><a href="'+slug+'.html"><img src="'+species[u.key].art+'" alt=""><strong>'+typeset(u.label)+'</strong><span class="lesson-card-food">'+typeset(u.food)+'</span></a></div>').join('')+'</div><p>'+typeset('どの教材にも、5分の進行、45分の進行、体の線画、三つの資料カード、先生用メモ、児童用シートがあります。料理を食べていない日にも使えます。')+'</p></section>'
  +'<section class="lesson-section"><h2>'+typeset('使う前の準備')+'</h2><ol><li>'+typeset('料理と動物を一つ選びます。5分版は画面と会話、45分版は画面と児童用シートで進めます。')+'</li><li>'+typeset('先生用メモを読みます。線画で見えたこと、資料に書いてあること、自分の考えを分けるのが共通の約束です。')+'</li><li>'+typeset('シートを使うときは教材ページの印刷ボタンから、A4縦・100％・ヘッダーとフッターなしでプレビューを確認します。児童用1枚だけを印刷する設定です。')+'</li></ol><p>'+typeset('小学校3〜6年生が目安です。低学年は絵や指さし、読み上げで使えます。ふりがなと文字の大きさは、ページ上のボタンで変えられます。')+'</p><p>'+typeset('動物のくらしを手がかりと一緒に考え、次の問いを見つけます。決まった食べ方や感想を求める教材ではありません。')+'</p></section>'
  +'<div class="entries">'+pageLink('food-diary','家庭で7日間、量を観察する')+pageLink('thanks','親子で会話する')+'</div>';
}

const purchaseExamples = [
 {slug:'plate-02', name:'手羽先の塩焼き', item:'鶏手羽先', amount:6, unit:'本', bone:true},
 {slug:'plate-06', name:'手羽のねぎスープ', item:'鶏手羽元', amount:4, unit:'本', bone:true},
 {slug:'ginger-pork', name:'豚こまの生姜焼き', item:'豚こま', amount:200, unit:'g', bone:false},
 {slug:'miso-soup', name:'ふたり分の豚汁', item:'豚こま', amount:80, unit:'g', bone:false}
];
const purchaseCopy = [
 '料理を決めてから、人数分を計算する',
 '下の数字は、このサイトの2人分のレシピを人数で換算した計算例です。必要な栄養量や、一人が食べるべき量を示すものではありません。ほかのおかずや、前に食べた量も考えて調節します。',
 '作る人数 ÷ レシピの人数 × 材料の量',
 'たとえば、2人分で手羽先6本なら、3人分は3 ÷ 2 × 6で9本。4人分なら12本です。調味料もまず同じ倍率で計算します。',
 '量を増やしても、加熱時間は同じ倍率にはなりません。鍋やフライパンに詰めこまず、必要なら分けて調理し、肉の中心までの加熱を確かめます。'
];
function purchaseTable(boneOnly,{typeset,pageLink}){
 const examples=boneOnly?purchaseExamples.filter(x=>x.bone):purchaseExamples;
 return '<div class="learning-table-wrap" tabindex="0" role="region" aria-label="人数別の買い物量。横にスクロールできます"><table class="learning-table purchase-table"><caption>'+typeset('既存レシピを、2人・3人・4人で作る計算例')+'</caption><thead><tr><th scope="col">'+typeset('料理と材料')+'</th><th scope="col">2人</th><th scope="col">3人</th><th scope="col">4人</th></tr></thead><tbody>'+examples.map(x=>'<tr><th scope="row">'+pageLink(x.slug,x.name)+'<small>'+typeset(x.item)+'</small></th>'+[2,3,4].map(n=>'<td>'+x.amount*n/2+x.unit+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function renderShopping(slug,helpers){
 const {typeset,pageLink}=helpers;
 const boneOnly=slug==='buy-bone';
 return '<section class="lesson-section"><h2>'+typeset(purchaseCopy[0])+'</h2><p>'+typeset(purchaseCopy[1])+'</p>'+purchaseTable(boneOnly,helpers)+'<h3>'+typeset('人数を変えるときの式')+'</h3><p class="quantity-formula">'+typeset(purchaseCopy[2])+'</p><p>'+typeset(purchaseCopy[3])+'</p><p>'+typeset(purchaseCopy[4])+' '+pageLink('heat','安全な加熱を確かめる')+'</p></section>'
  +(boneOnly?'<section class="lesson-section"><h2>'+typeset('重さで買う骨付き肉')+'</h2><p>'+typeset('このサイトのスペアリブのレシピは、骨付きで500g、2〜3人分です。骨を除いた肉500gという意味ではありません。')+' '+pageLink('bbq-ribs','スペアリブの材料を見る')+'</p><p>'+typeset('この500gを2人で分けて作ると決めた場合、同じ配分で4人分を用意する計算は1,000gです。3人で分ける場合なら、6人分が1,000g。元のレシピを何人で分けるか決めてから換算します。')+'</p><p>'+typeset('骨や肉のつき方は商品で違います。骨の重さを一律の割合で引かず、初めて買うものはお店で本数や大きさを確かめます。食べたあとに骨と残った料理を分けて見れば、次の買い物の手がかりになります。')+'</p></section>':'<section class="lesson-section"><h2>'+typeset('家にある分を引いて、買う量を決める')+'</h2><p>'+typeset('計算の例です。3人分の生姜焼きに必要な豚こまは300g。期限と保存状態を確認した豚こまが家に100gあれば、追加で買う量は200gです。')+'</p><p>'+typeset('ぴったりのパックがなければ、使う料理や量を変えるか、余る分の使い道と保存を買う前に考えます。量り売りなら、必要な量で買えるか聞いてみよう。')+' '+pageLink('storage','買ったあとの保存')+'</p></section>')
  +'<section class="lesson-section"><h2>'+typeset('買う前に、三つメモ')+'</h2><ol><li>'+typeset('何を、何人分作る？　レシピの材料量はいくつ？')+'</li><li>'+typeset('家に使える材料はどれだけある？　買い足す分はいくつ？')+'</li><li>'+typeset('食べたあと、量はどうだった？　次はどう調節する？')+'</li></ol><p>'+pageLink('food-diary','7日間の記録で、わが家の量を見つける')+'</p></section>';
}

const diaryCopy = [
 '毎日一皿だけ選び、7日間、同じ見方で書きます。ごはん茶わん、汁わん、おたま、個数など、家で使いやすい単位を決めましょう。重さを量らなくてもかまいません。',
 '「盛った量」にはおかわりも足します。「食べた量」と「残った量」は同じ単位で、およその量を書きます。骨や皮など食べなかった部分は、ひとこと欄で分けて書きます。',
 '食欲や体調は日によって変わります。残さないことを点数にせず、次に盛る量や買う量を家族で考える記録にします。書かなかった日は空欄のままで大丈夫です。',
 '書き方の例（実際の記録ではありません）',
 '1日目・夕食、豚汁。盛った量は1杯、食べた量は4/5杯、残った量は1/5杯。「おなかがいっぱい。次は少なく盛って、おかわりする」と書きます。',
 'ちょうどよく食べられた日は、何をどれくらい盛った？',
 '残った日や足りなかった日は、どんな理由があった？',
 '次の買い物や盛りつけで、一つ変えてみることは？'
];
function renderDiary({typeset,pageLink}){
 const heads=['日・食事','料理','盛った量','食べた量','残った量','ひとこと・次の工夫'];
 return '<section class="lesson-section"><h2>'+typeset('書く前に、量の見方を決めよう')+'</h2>'+diaryCopy.slice(0,3).map(t=>'<p>'+typeset(t)+'</p>').join('')+'<h3>'+typeset(diaryCopy[3])+'</h3><p>'+typeset(diaryCopy[4])+'</p><p>'+pageLink('shopping','レシピから買う量を計算する')+'</p></section>'
  +'<div class="print-help"><p>'+typeset('印刷して書くか、同じ表をノートに写して使います。印刷は下の7日シートだけです。A4縦・倍率100％・ブラウザのヘッダーとフッターなしで、1枚に収まるかプレビューを確認してください。')+'</p><button type="button" data-print>'+typeset('7日シートを印刷')+'</button>'+pdfDownloadLink('food-diary',typeset)+'</div>'
  +'<section class="worksheet diary-sheet" id="worksheet" aria-labelledby="diary-title"><h2 id="diary-title">'+typeset('一週間の食べきり観察')+'</h2><p class="sheet-name">'+typeset('名前')+' ______________　'+typeset('始める日')+' __________</p><p class="sheet-small">'+typeset('一日一皿。量は同じ単位で、おかわりも足します。無理に食べきらず、次の工夫を見つけよう。')+'</p><p class="sheet-name">'+typeset('使う単位（杯・個など）')+' ____________________</p>'
  +'<div class="learning-table-wrap" tabindex="0" role="region" aria-label="7日間の記録表。横にスクロールできます"><table class="learning-table diary-table"><caption>'+typeset('7日間の記録')+'</caption><thead><tr>'+heads.map(h=>'<th scope="col">'+typeset(h)+'</th>').join('')+'</tr></thead><tbody>'+Array.from({length:7},(_,i)=>'<tr><th scope="row">'+(i+1)+'日目<br><span>　／　</span><br><span>　　　</span></th>'+heads.slice(1).map(()=>'<td></td>').join('')+'</tr>').join('')+'</tbody></table></div>'
  +'<p class="diary-example">'+typeset('例　夕食・豚汁／盛った1杯／食べた4/5杯／残った1/5杯／次は少なく盛っておかわりする。')+'</p>'
  +'<h3>'+typeset('7日を見返して、家族と話そう')+'</h3>'+diaryCopy.slice(5).map(text=>'<div class="diary-reflection"><p>'+typeset(text)+'</p><div class="answer-space"></div></div>').join('')+'<p class="sheet-credit">Before We Eat · food-diary.html</p></section>';
}

export function hasLearningSheet(slug){return Object.hasOwn(lessonUnits,slug)||slug==='food-diary';}

export function learningMarkup(r,helpers){
 if(Object.hasOwn(lessonUnits,r.slug))return renderLesson(r.slug,helpers);
 if(r.slug==='lessons')return renderLessonIndex(helpers);
 if(r.slug==='food-diary')return renderDiary(helpers);
 if(['shopping','buy-bone'].includes(r.slug))return renderShopping(r.slug,helpers);
 return '';
}

// Search callers can index the rendered text so all authored lesson prompts,
// worksheet labels and purchase examples stay discoverable without duplication.
export function learningSearchText(slug, species){
 const markup=learningMarkup({slug},{species,typeset:text=>text,pageLink:(target,label)=>label||target});
 return markup.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
}
