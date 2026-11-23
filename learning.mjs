import {readingRoutes, readingRoutesMarkup} from './reading-routes.mjs';

// Authored reading and lesson ideas. No classroom or cooking trial is claimed.
const welfareSource = 'https://www.maff.go.jp/j/chikusan/sinko/attach/pdf/230726-50.pdf';
export const worksheetVersion = '2026-11-23';
const siteBase = 'https://djnaoyaman.github.io/beforeweeat/';
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
  key:'cow', label:'牛の教材', food:'牛すねのシチュー', part:'すね', location:'脚の下のほう', guide:'beef-cuts', recipe:'stew',
  title:'牛の体と、休む場所を見てみよう',
  summary:'煮込むとほどけるすね肉。その場所を図で見て、立つ・歩く・休む牛の体へつなげます。',
  look:'すねは、脚の下のほうです。全身図と部位図鑑を見くらべてみよう。',
  focus:'牛が立つ、歩く、横になって休むとき、どんな場所が必要だろう。',
  evidence:'資料2に、動物の動き方に合う場所が大切と書いてある。',
  thought:'立ったり横になったりするには、体のまわりにも場所が必要かもしれない。',
  question:'牛が休みたいときに休めているか、何を見て確かめていますか。'
 },
 'lesson-pork': {
  key:'pig', label:'ぶたの教材', food:'豚ロースのとんかつ', part:'ロース', location:'背中のあたり', guide:'pig-cuts', recipe:'pork-cutlet',
  title:'ぶたの体と、過ごす場所を見てみよう',
  summary:'とんかつの赤身と脂身から、ロースの場所へ。体を動かしたり、横になったりするぶたを思い浮かべます。',
  look:'ロースは、背中のあたりです。全身図と部位図鑑を見くらべてみよう。',
  focus:'ぶたが立つ、体の向きを変える、横になるとき、どんな場所が必要だろう。',
  evidence:'資料2に、動物の動き方に合う場所が大切と書いてある。',
  thought:'となりのぶたがいても、体の向きを変えられる場所が必要かもしれない。',
  question:'ぶたが無理なく横になれているか、どんなときに確かめていますか。'
 },
 'lesson-chicken': {
  key:'hen', label:'にわとりの教材', food:'鶏ももの料理', part:'もも', location:'脚のつけ根に近いところ', guide:'chicken-cuts', recipe:'crispy-chicken',
  title:'にわとりの体と、動ける場所を見てみよう',
  summary:'パリッと焼いたもも肉から、脚の場所へ。歩く、羽を広げる、水を飲みに行く動きにつなげます。',
  look:'ももは、脚のつけ根に近いところです。全身図と部位図鑑を見くらべてみよう。',
  focus:'にわとりが歩く、羽を広げる、水を飲みに行くとき、どんな場所が必要だろう。',
  evidence:'資料1に、動物が水を飲めるようにすることが大切と書いてある。',
  thought:'水入れがあっても、そこまで歩いて行けるかを見たい。',
  question:'水を飲みに行けていないにわとりがいないか、何を見て確かめていますか。'
 }
};

const teacherNotes = [
 '対象の目安は小学校3〜6年生です。低学年では大人が読み上げ、絵を見る、指さす、聞くといった参加のしかたを選べます。',
 'ねらいは、料理に使う肉と動物の体やくらしのつながりを知り、目の前の一皿をおいしくいただくきっかけにすることです。読む・作る・食べるところでも、その時間を終えられます。',
 '5分版は画面だけで使えます。45分版も、画面を見ながら読むだけで参加できます。シートや鉛筆は、書きたい人が使う分を用意します。実物の肉や動物、農場の写真はなくても使えます。',
 '線画は体の場所を考えるための絵です。特定の農場の記録ではなく、動物の気持ち、健康、実際の飼い方まではわかりません。資料カードも、すべての農場が実施しているという意味ではありません。',
 '食べ方や家庭の事情、宗教、アレルギーには違いがあります。食べること、食べきること、決まった感想を求めず、「まだわからない」「今日は書かない」も受け止めます。',
 '感想が出たら、まずその言葉を受け止めます。説明を深めたいときは、絵や資料でわかることと、そこから考えたことを一緒に分けます。その場で答えを求めなくてもかまいません。',
 '見取りは、料理と体の場所やくらしのつながりが伝わったかを、読むようすや自発的な言葉から確かめ、次の説明に生かします。質問、発表、調査、家族への報告、シートの全欄記入や提出を全員の達成条件にしません。肉を食べる・食べないという選択や感想の方向も採点しません。',
 'これは編者MINAが作った進め方の案です。子どもや授業での実施結果、料理の試作結果を報告したものではありません。'
];

function renderCards(typeset, compact=false){
 return '<div class="learning-cards'+(compact?' compact-cards':'')+'">'+sharedCards.map((card,i)=>'<div><h3>'+typeset('資料'+(i+1)+'　'+card.title)+'</h3><p>'+typeset(card.text)+'</p></div>').join('')+'</div>';
}
function sheetCredit(slug, typeset, withSource=true){
 return '<p class="sheet-credit">'+(withSource?typeset('資料は農林水産省の2023年9月の解説、本文3〜6ページを要約。絵は体の説明用です。')+'<br>':'')
  +'Before We Eat · MINA · '+typeset('版')+' '+worksheetVersion+'<br><a href="'+siteBase+slug+'.html">'+siteBase+slug+'.html</a></p>';
}

function worksheet(slug, unit, species, typeset){
 const animal=species[unit.key];
 return '<section class="worksheet pupil-sheet" id="worksheet" aria-labelledby="worksheet-title">'
  +'<h2 id="worksheet-title">'+typeset(unit.title)+'</h2>'
  +'<p class="sheet-choice">'+typeset('読むだけでも使えます。書きたいところだけ、絵やことばで。空いている欄があっても大丈夫。')+'</p>'
  +'<p class="sheet-name">'+typeset('名前・日付（書きたいときに）')+' ______________________________</p>'
  +'<div class="sheet-observe"><figure><img src="'+animal.art+'" alt="横から見た'+animal.name+'の全身の線画"><figcaption>'+typeset('体の場所を考えるための絵')+'</figcaption></figure>'
  +'<div><p><strong>'+typeset('今日の一皿　'+unit.food)+'</strong></p><p>'+typeset(unit.look)+'</p><p class="sheet-small">'+typeset('図鑑の部位　'+unit.part+'／'+unit.location)+'</p></div></div>'
  +renderCards(typeset,true)
  +'<div class="sheet-answer"><h3>'+typeset('1　絵や資料から見つけたこと')+'</h3><p>'+typeset('場所を指でさしたり、図に丸をつけたりしても。')+'</p><div class="answer-space" aria-label="見つけたことを書く任意の欄"></div></div>'
  +'<div class="sheet-answer"><h3>'+typeset('2　そこから思ったこと')+'</h3><p>'+typeset('「おいしそう」「もう少し見たい」「まだわからない」も。')+'</p><div class="answer-space" aria-label="思ったことを書く任意の欄"></div></div>'
  +'<div class="sheet-answer"><h3>'+typeset('3　気になったら、聞きたいこと')+'</h3><p>'+typeset('聞いてみたい相手や、見てみたいものがあれば。')+'</p><div class="answer-space" aria-label="気になることがあるときだけ使う欄"></div></div>'
  +sheetCredit(slug,typeset)+'</section>';
}

function formatOptions(typeset){
 const formats=[['five-min','5','分','一皿から、少し読む','画面だけで使えます。書く時間はとらなくても。'],['forty-five','45','分','教室で、ゆっくり','読む・見る・話す・書くから、参加のしかたを選びます。'],['worksheet','A4','1枚','紙で手元に','書きたい欄だけ使えるシート。持ち帰って読むことも。']];
 return '<div class="learning-formats" aria-label="教材の使い方">'+formats.map(([id,n,unit,title,body])=>'<div><p class="learning-format-time">'+n+'<span>'+typeset(unit)+'</span></p><h3><a href="#'+id+'">'+typeset(title)+'</a></h3><p>'+typeset(body)+'</p></div>').join('')+'</div>';
}
function renderLesson(slug, {typeset,pageLink,species}){
 const u=lessonUnits[slug], animal=species[u.key], route=readingRoutes.find(item=>item.id===u.key);
 const five=[
  ['1分', '料理を眺める', u.food+'の写真と作り方を見ます。食べたことがなくても、料理名や色から楽しめます。'],
  ['1分', '体の場所を見る', '下の線画と部位図鑑で、'+u.part+'が'+u.location+'にあることを見ます。指さしや書き込みは、したい人が選べます。'],
  ['2分', 'くらしを少し読む', '資料カードから気になる一枚を読みます。'+u.focus+'と考えても、説明を読んだところで止めてもかまいません。'],
  ['1分', '一皿へ戻る', '料理のページに戻り、食べる日を思い浮かべます。今日はここまでで大丈夫。質問や会話は、続けたいときにどうぞ。']
 ];
 const full=[
  ['0〜5分', '料理から入る', '料理の写真や献立を見ます。今日食べていなくても使えます。シートは使いたい人に渡します。', '写真を見る、料理名を読む。思い出したことは、話したければ話す。'],
  ['5〜15分', '体の場所を見る', u.look+' 絵に描かれていることと、絵だけではわからないことを先生が整理します。', '図鑑を読む、体の場所を指さす、絵を描くなどから選ぶ。'],
  ['15〜30分', 'くらしの説明を読む', '資料1〜3を読みます。「'+u.focus+'」は考えるきっかけの一例です。先生の読み上げを聞くだけでも参加できます。', '気になるカードを読む。書くときは、資料の内容と自分の考えを分ける。'],
  ['30〜40分', '気になるところで過ごす', '料理の手順を読む、図を見直す、思ったことを話す、シートに書く時間を用意します。質問づくりや調査を選ぶ人も、この時間を使えます。', '一人で読むことも、友だちと話すことも選べる。シートは使いたい欄だけ。'],
  ['40〜45分', '食卓へつなげて終える', '料理のページをもう一度開き、体やくらしとのつながりを短く振り返ります。質問や家族への報告を宿題にせず、続きは興味のある人の入口として紹介します。', '読んだところで終える。さらに見たい記事があれば選ぶ。']
 ];
 const timeline=(items)=>'<ol class="lesson-timeline">'+items.map(([time,title,text,activity])=>'<li><span class="lesson-time">'+typeset(time)+'</span><div><h3>'+typeset(title)+'</h3><p>'+typeset(text)+'</p>'+(activity?'<p class="pupil-action">'+typeset('参加のしかた　'+activity)+'</p>':'')+'</div></li>').join('')+'</ol>';
 return '<div class="learning-lesson-intro"><figure><img src="'+route.art+'" width="'+route.width+'" height="'+route.height+'" alt="'+route.alt+'"><figcaption>'+typeset('料理のイメージ')+'</figcaption></figure><div><p class="learning-eyebrow">'+typeset('一皿と、動物のつながり')+'</p><h2>'+typeset(u.food+'から')+'</h2><p>'+typeset(u.summary)+'</p><p>'+pageLink(u.recipe,'この料理の作り方を読む')+'</p><p class="learning-small">'+typeset('読むだけでも、ここで終えても大丈夫。質問・調査・記録は、やってみたいときに選べます。')+'</p><p><a href="lessons.html#route-'+u.key+'">'+typeset('子どもが選べる、短い読み方へ')+'</a></p></div></div>'
  +formatOptions(typeset)
  +'<div class="learning-jumps" role="navigation" aria-label="教材の中を読む"><a href="#materials">'+typeset('見る資料')+'</a><a href="#teacher-notes">'+typeset('先生・保護者の方へ')+'</a></div>'
  +'<section class="lesson-section" id="five-min"><h2>'+typeset('給食や家庭で、[[5分くらい]]')+'</h2><p>'+typeset('食べる時間を急がせず、読みたいときに使います。会話や記入がなくても、一皿と動物をつなぐ時間になります。')+'</p>'+timeline(five)+'<p class="learning-return">'+pageLink(u.recipe,'一皿の作り方に戻る')+'</p></section>'
  +'<section class="lesson-section" id="forty-five"><h2>'+typeset('教室で、[[45分くらい]]')+'</h2><p>'+typeset('小学校3〜6年生を目安にした進め方の案です。時間と活動は、子どもに合わせて調節します。読むだけの参加も含めて、全員に同じ発表や記入を求めません。')+'</p>'+timeline(full)+'</section>'
  +'<section class="lesson-section" id="materials"><h2>'+typeset('体の場所と、くらしを見る')+'</h2><figure class="animal-plate"><img src="'+animal.art+'" alt="横から見た'+animal.name+'の全身の線画"><figcaption>'+typeset(u.look+' この線画は特定の農場を写したものではありません。')+'</figcaption></figure><p>'+pageLink(u.guide,'部位図鑑で'+u.part+'の場所を見る')+'</p><h3>'+typeset('動物のくらしを読む、三つの資料')+'</h3><p>'+typeset('国の指針の解説から、大切にする点を短くまとめました。現場で実際にどう過ごしているかを確かめるには、別の観察や資料が必要です。')+'</p>'+renderCards(typeset)+'<p class="learning-source"><a href="'+welfareSource+'">'+typeset('農林水産省「アニマルウェルフェアに関する新たな国の指針について」2023年9月、本文3〜6ページ（PDF）')+'</a></p></section>'
  +'<section class="lesson-section" id="teacher-notes"><h2>'+typeset('先生・保護者の方へ')+'</h2><ul>'+teacherNotes.map(text=>'<li>'+typeset(text)+'</li>').join('')+'</ul><details class="learning-optional"><summary>'+typeset('話したり調べたりしたくなったら')+'</summary><h3>'+typeset('資料と、自分の考えを分ける例')+'</h3><dl class="learning-examples"><dt>'+typeset('資料に書いてあること')+'</dt><dd>'+typeset('「'+u.evidence+'」')+'</dd><dt>'+typeset('そこから考えたこと')+'</dt><dd>'+typeset('「'+u.thought+'」')+'</dd><dt>'+typeset('聞いてみたいことがあれば')+'</dt><dd>'+typeset('「'+u.question+'」')+'</dd></dl><p>'+typeset('これは話し方の例です。子どもの言葉をこの文に合わせたり、全員から質問を集めたりする必要はありません。')+'</p></details></section>'
  +'<div class="print-help"><h2>'+typeset('紙のシートを使いたいときに')+'</h2><p>'+typeset('読む、図に丸をつける、好きな欄に書く。使い方を選べるA4縦1枚です。印刷ボタンは下のシートだけを出力します。A4・倍率100％・ブラウザのヘッダーとフッターなしで、1枚に収まるかプレビューを確かめてください。')+'</p><button type="button" data-print>'+typeset('シートを印刷')+'</button>'+pdfDownloadLink(slug,typeset)+'</div>'
  +worksheet(slug,u,species,typeset);
}

function renderLessonIndex({typeset,pageLink,species}){
 const formats=[['5分','画面で、気軽に','料理の写真、体の場所、くらしの説明を少しずつ。会話や記入をしなくても使えます。'],['45分','教室で、ゆっくり','先生用の進め方があります。読む・見る・話す・書くから、参加のしかたを選べます。'],['A4 1枚','紙を手元に','牛・ぶた・にわとりのシートと、食べる量のメモ。使いたい欄だけ、1回だけでも。']];
 return readingRoutesMarkup({typeset})
  +'<section class="lesson-section" id="choose-format"><p class="learning-eyebrow">'+typeset('先生・保護者の方へ')+'</p><h2>'+typeset('時間と使い方から選ぶ')+'</h2><div class="learning-formats learning-format-guide">'+formats.map(([time,title,body])=>'<div><p class="learning-format-time">'+typeset(time)+'</p><h3>'+typeset(title)+'</h3><p>'+typeset(body)+'</p></div>').join('')+'</div><p>'+typeset('料理と動物のつながりを知り、おいしくいただくきっかけに。読んだり、作ったり、食べたりするだけでも目的につながります。質問、調査、家族への報告は、興味がある人の入口です。')+'</p></section>'
  +'<section class="lesson-section" id="lesson-plans"><h2>'+typeset('一皿ごとの教材を開く')+'</h2><div class="lesson-editorial-list">'+Object.entries(lessonUnits).map(([slug,u])=>{const route=readingRoutes.find(item=>item.id===u.key);return '<section><figure><img src="'+route.art+'" alt="'+route.alt+'" width="'+route.width+'" height="'+route.height+'" loading="lazy"></figure><div><p class="learning-eyebrow">'+typeset(u.label+' · 5分／45分／A4')+'</p><h3><a href="'+slug+'.html">'+typeset(u.food+'から、体とくらしへ')+'</a></h3><p>'+typeset(u.summary)+'</p><p class="learning-small">'+typeset('進め方、体の絵、資料カード、先生用メモとPDF。')+'</p></div></section>';}).join('')+'</div></section>'
  +'<section class="lesson-section"><h2>'+typeset('使う前に、少しだけ')+'</h2><ul><li>'+typeset('小学校3〜6年生が目安です。低学年では絵を見る、指さす、大人の読み上げを聞くなど、読み方を選べます。')+'</li><li>'+typeset('絵や資料にあることと、そこから思ったことを分けて伝えます。線画は特定の農場の記録ではありません。')+'</li><li>'+typeset('ふりがなと文字の大きさはページ上のボタンで変えられます。シートは提出や全欄記入のためのものではありません。')+'</li></ul></section>'
  +'<section class="lesson-section learning-family"><h2>'+typeset('食卓で、気になったときに')+'</h2><div><h3>'+pageLink('food-diary','わが家で食べる量をメモする')+'</h3><p>'+typeset('7日分の欄を、使いたい日だけ。次に盛る量や買う量の手がかりにします。')+'</p>'+pdfDownloadLink('food-diary',typeset)+'</div><div><h3>'+pageLink('thanks','一皿に関わった動物や人を読む')+'</h3><p>'+typeset('料理が届くまでをたどる読みもの。話したいときには、短い会話の例も使えます。')+'</p></div><div><h3>'+pageLink('ask-shop','お店で聞きたいことがあれば')+'</h3><p>'+typeset('料理に合う部位や、お肉の量を知りたいときの質問例。お店で聞くことやメモを残すことは、やってみたいときに選べます。')+'</p></div></section>';
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
  +'<section class="lesson-section"><h2>'+typeset('買う量を考える、三つの手がかり')+'</h2><ol><li>'+typeset('何を、何人分作る？　レシピの材料量はいくつ？')+'</li><li>'+typeset('家に使える材料はどれだけある？　買い足す分はいくつ？')+'</li><li>'+typeset('食べたあと、量はどうだった？　次はどう調節する？')+'</li></ol><p>'+pageLink('food-diary','わが家の量を、使いたい日だけメモする')+'</p></section>';
}

const diaryCopy = [
 '量を知りたい日の一皿を選びます。7日分の欄は、使いたい日だけで大丈夫。ごはん茶わん、汁わん、おたま、個数など、家で使いやすい単位にそろえます。重さを量らなくてもかまいません。',
 '書くときは、「盛った量」におかわりも足します。「食べた量」と「残った量」は同じ単位で、およその量を。骨や皮など食べなかった部分は、ひとこと欄で分けて書けます。',
 '食欲や体調は日によって変わります。残さないことを点数にせず、次に盛る量や買う量の手がかりにします。読むだけでも、1日分だけでも使えます。家族に話すことや、誰かに見せることも自由です。',
 '書き方の例（実際の記録ではありません）',
 '1日目・夕食、豚汁。盛った量は1杯、食べた量は4/5杯、残った量は1/5杯。「おなかがいっぱい。次は少なく盛って、おかわりする」という書き方もあります。',
 'ちょうどよく食べられた量があれば、メモしておこう。',
 '残った日や足りなかった日に、思い当たることは？',
 '次に試したい盛り方や、話してみたいことがあれば。'
];
function diaryWorksheet(typeset){
 const heads=['日・食事','料理','盛った量','食べた量','残った量','ひとこと'];
 return '<section class="worksheet diary-sheet" id="worksheet" aria-labelledby="diary-title"><h2 id="diary-title">'+typeset('一皿の量を見つける、7日メモ')+'</h2><p class="sheet-choice">'+typeset('使いたい日だけ。1日分でも、読むだけでも。家族に話すことも自由です。')+'</p><p class="sheet-name">'+typeset('名前・日付（書きたいときに）')+' ______________________________</p><p class="sheet-small">'+typeset('量は同じ単位で、おかわりも足します。無理に食べきらず、次に盛る量の手がかりに。')+'</p><p class="sheet-name">'+typeset('使う単位（杯・個など）')+' ____________________</p>'
  +'<div class="learning-table-wrap" tabindex="0" role="region" aria-label="使いたい日に書く7日分の表。横にスクロールできます"><table class="learning-table diary-table"><caption>'+typeset('7日分の欄。空いていても大丈夫')+'</caption><thead><tr>'+heads.map(h=>'<th scope="col">'+typeset(h)+'</th>').join('')+'</tr></thead><tbody>'+Array.from({length:7},(_,i)=>'<tr><th scope="row">'+(i+1)+'日目<br><span>　／　</span><br><span>　　　</span></th>'+heads.slice(1).map(()=>'<td></td>').join('')+'</tr>').join('')+'</tbody></table></div>'
  +'<p class="diary-example">'+typeset('書き方の例（実際の記録ではありません）　夕食・豚汁／盛った1杯／食べた4/5杯／残った1/5杯／次は少なく盛っておかわりする。')+'</p>'
  +'<h3>'+typeset('気づいたことがあれば、好きな欄に')+'</h3>'+diaryCopy.slice(5).map(text=>'<div class="diary-reflection"><p>'+typeset(text)+'</p><div class="answer-space" aria-label="気づいたことを自由に書く欄"></div></div>').join('')+sheetCredit('food-diary',typeset,false)+'</section>';
}
function renderDiary({typeset,pageLink}){
 return '<section class="lesson-section"><h2>'+typeset('使いたい日の一皿から')+'</h2>'+diaryCopy.slice(0,3).map(t=>'<p>'+typeset(t)+'</p>').join('')+'<h3>'+typeset(diaryCopy[3])+'</h3><p>'+typeset(diaryCopy[4])+'</p><p>'+pageLink('shopping','レシピから買う量を計算する')+'</p></section>'
  +'<div class="print-help"><p>'+typeset('印刷して書くか、使いたい欄をノートに写しても。印刷は下の7日メモだけです。A4縦・倍率100％・ブラウザのヘッダーとフッターなしで、1枚に収まるかプレビューを確かめてください。')+'</p><button type="button" data-print>'+typeset('7日メモを印刷')+'</button>'+pdfDownloadLink('food-diary',typeset)+'</div>'
  +diaryWorksheet(typeset);
}

// Render the same paper content directly for the PDF generator, without a site build.
export function worksheetMarkup(slug,{typeset,species}){
 if(Object.hasOwn(lessonUnits,slug))return worksheet(slug,lessonUnits[slug],species,typeset);
 if(slug==='food-diary')return diaryWorksheet(typeset);
 return '';
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
 return markup.replace(/\[\[([^\[\]]+)\]\]/g,'$1').replace(/<([^:>]+):[^>]+>/g,'$1').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
}
