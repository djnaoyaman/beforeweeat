import {kanagawaStudy, kanagawaSource, kanagawaStudyMarkup, henHousingSurveyMarkup} from './kanagawa-study.mjs';
const sources = {
  iron: ['文部科学省の食品成分表・版と訂正', 'https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html'],
  ironData: ['36品の計算に使った食品番号と条件', 'meat-iron-data.json'],
  journey: ['農林水産省のお仕事紹介', 'https://www.maff.go.jp/j/kids/about/page7.html'],
  meat: ['食肉処理施設の役割（資料の3〜4ページ）', 'https://www.maff.go.jp/j/council/seisaku/tikusan/attach/pdf/bukai602-10.pdf#page=3'],
  chicken: ['農林水産省の鶏肉の流通図', 'https://www.maff.go.jp/j/chikusan/sinko/lin/l_katiku/attach/pdf/r6_niwatori-25.pdf'],
  milk: ['農畜産業振興機構の牛乳の解説', 'https://www.alic.go.jp/koho/kikaku03_001435.html'],
  eggs: ['農林水産省の卵の出荷の解説', 'https://www.maff.go.jp/j/pr/aff/2404/spe1_03.html'],
  kanagawa: kanagawaSource,
  beef: ['輸入牛もも・赤肉・生', 'https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11077_7&MODE=0'],
  pork: ['ぶたもも・赤肉・生', 'https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11134_7'],
  poultry: ['若どりむね・皮なし・生', 'https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11220_7'],
  heating: ['厚生労働省の家庭での食中毒予防', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/syokuchu/01_00008.html'],
  learning: ['文部科学省の食育の手引', 'https://www.mext.go.jp/a_menu/sports/syokuiku/1292952.htm']
};

const meatJourney = [
  {name: '農場で育つ', body: '動物に水や食べ物を用意し、体のようすを見ながら育てます。', question: '飲みたいときに水を飲み、楽な姿勢で休めるかな。'},
  {name: '施設まで移動する', body: '生きている動物を、車などでお肉にする施設へ運びます。', question: '暑さや寒さ、長い移動のつらさを減らすには、何ができるかな。'},
  {name: 'お肉にする施設', body: 'ここで動物は命を終え、その体がお肉になります。検査や部位ごとの切り分けなどを行います。', question: '最後まで、こわさや痛みをできるだけ少なくするには、どんな仕事が必要かな。'},
  {name: 'お店で選ぶ', body: '加工や流通に関わる人を通して、お肉がお店に届きます。', question: '動物の種類、部位、育った場所。パックから何がわかるかな。'},
  {name: '料理して、いただく', body: '食べる分を用意し、部位に合う方法で料理して食卓へ。', question: 'どう料理したらおいしいかな。次も食べきれる量にするには、何を覚えておこう。'}
];

const milkJourney = ['牧場で乳をしぼり、冷やす', '乳業工場で検査し、<殺菌:さっきん>する', '容器につめ、冷やして保管する', 'お店へ運ぶ'];
const eggJourney = ['農場で産まれた卵を集める', '洗い、割れや中のようすを調べる', '大きさなどを分け、容器につめる', 'お店などへ運ぶ'];

const sourceMap = [
  {claim: '動物が育ち、お肉になって食卓へ届く道', pages: [['animals', '動物から食卓まで']], refs: ['journey', 'meat', 'chicken'], note: '資料にある流れを、五つの場面にまとめています。お肉の種類や届け方によって、間に入る仕事は変わります。'},
  {claim: '牛乳は、しぼった乳を冷やして工場へ運ぶ', pages: [['cow', '牛肉と牛乳の道']], refs: ['milk'], note: '「牛乳が消費者に届くまで」の1〜3を参照。2023年4月5日更新。'},
  {claim: '卵は、集めたあとに検査や包装をして出荷する', pages: [['hen', 'お肉と卵の道']], refs: ['eggs'], note: '「産まれたたまごを出荷するまで」の各工程を参照。'},
  {claim: '設備を変えたあとも、鶏の行動を確かめる', pages: [['hens', '研究で見られたこと'], ['people', '工夫をした人たち'], ['rest-questions', '休む場所を確かめる']], refs: ['kanagawa'], note: '「研究の内容」と「今後の展開」を参照。元のページの更新日 ' + kanagawaStudy.sourceUpdated + '。このサイトによる取材ではなく、公開された研究の紹介です。'},
  {claim: '栄養表で比べている三つの食品', pages: [['nutrition', '栄養を比べる']], refs: ['beef', 'pork', 'poultry'], note: '文部科学省の各食品のページに対応します。同じ100gでも、部位、皮の有無、生か調理後かをそろえて読みます。'},
  {claim: '36品の、お肉の量から求めた鉄の目安', pages: [['crispy-chicken', '肉の重さと人数を読む'], ['miso-soup', '少量の肉を使う例']], refs: ['iron', 'ironData'], note: '料理全体の値ではなく、加熱前のお肉の可食部をもとにした目安です。加熱による変化、野菜、たれなどは計算に含めません。各レシピの詳細から、食品番号・部位・重さ・人数・成分表の版をたどれます。'},
  {claim: '肉の中心の温度を確かめる', pages: [['heat', '火の通りを確かめる']], refs: ['heating'], note: '「ポイント4 調理」の加熱条件を参照。料理の時間だけで火の通りを決めず、温度計で確かめます。'},
  {claim: '一皿から、動物や食べ物を知る', pages: [['lessons', '先生・保護者の方へ']], refs: ['learning'], note: '食育の考え方を参照しています。このサイトの教材やシートは編者が作ったものです。会話や記入は、使いたいときに選べます。'}
];

// The publishing agent keeps only completed entries before releasing this page.
export const editorialUpdates = [
  {date: '2026-11-23', title: '好きな一皿から、短く読む・教材を使う', body: '牛・ぶた・にわとりの三つの短い読み方を加えました。読む、作る、食べるだけでも使え、会話や記入は選べます。教材本文と4種類のPDFをそろえ、印刷用シートに元のページと版の日付を載せました。トップの編者表記にはMINAの既存ロゴを使っています。', links: [['lessons', '三つの読み方と教材'], ['food-diary', '使いたい日の量をメモする']]},
  {date: '2026-11-23', title: '36品の料理と、章ごとの記事を選びやすく', body: '料理を動物と作り方で絞り込めるようにしました。買い物、現場の工夫、部位、出典の入口には、図や短い紹介を添えています。同じ神奈川県の研究を扱う三つの記事は、結果・改善の工程・観察の見方に分けました。似た二つのとんかつ記事は、材料と加熱条件をそろえ、詳しい版と短い版に分けています。', links: [['cooking', '36品から料理を選ぶ'], ['people', '現場で試した工夫を読む']]},
  {date: '2026-11-23', title: '図解と、その記事に合う次の読みものを整理', body: '動物の休む場所、肉の切り口、加熱や保存、卵の表示などを、比較の図や手順で読めるようにしました。目次は写真や図を使った紹介へ、記事の終わりは内容に合う理由付きの紹介へ改めました。実際の調理・試食を行っていないことも編集方針に記しています。', links: [['start', 'すべての目次'], ['editorial', '出典と試作について読む']]},
  {date: '2026-11-23', title: '36品に、お肉の鉄の目安を追加', body: '36品のレシピに、材料のお肉の量をもとにした1人分の鉄の目安を加えました。火を通す前のお肉だけを計算した値です。計算に使った部位・重さ・人数・出典も確かめられます。', links: [['crispy-chicken', '鶏もも肉の皮をパリッと焼く'], ['pork-cutlet', 'とんかつを作る'], ['miso-soup', '豚汁を作る']]},
  {date: '2026-11-23', title: '料理を、作れる記事へ', body: '生姜焼き・とんかつ・豚汁に、材料、分量、道具、作り方、食べる前の観察の問いをそろえました。', links: [['cooking', '料理を選ぶ']]},
  {date: '2026-11-23', title: '本文にあることばを探しやすく', body: '「ネック」「せせり」などの部位名や、料理の作り方にあることばでも記事を探せるようにしました。', links: [['start', 'ことばで探す']]},
  {date: '2026-11-23', title: '部位と体の場所をつなぐ', body: '部位を選びながら、動物の体のどこかを見比べる図鑑を整えました。', links: [['cuts', '部位図鑑を見る']]},
  {date: '2026-11-23', title: '観察したことを残す', body: '牛・ぶた・にわとりの教材に、5分版と45分版の進め方、印刷用シートを追加しました。', links: [['lessons', '教材を選ぶ']]},
  {date: '2026-11-23', title: '食卓までの道と、元の資料をたどる', body: '動物からお肉になる道、牛乳と卵が届く道を分けて紹介しました。研究の紹介と、その説明を確かめる資料も整理しました。', links: [['animals', '食卓までの道を見る'], ['sources', '元の資料を読む']]},
  {date: '2026-11-22', title: 'Before We Eatを公開', body: '動物のくらし、部位、料理、現場の記録、食育の教材を公開しました。', links: [['animals', '動物から読む']]}
];

const escapeAttribute = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

export function editorialContextMarkup({r, typeset, pageLink}) {
  const heading = value => '<h2>' + typeset(value) + '</h2>';
  const paragraph = value => '<p>' + typeset(value) + '</p>';
  const sourceLink = key => '<a href="' + escapeAttribute(sources[key][1]) + '">' + typeset(sources[key][0]) + '</a>';
  const sourceNote = (keys, note = '') => '<p class="context-sources">' + keys.map(sourceLink).join(' ／ ') + (note ? '<br>' + typeset(note) : '') + '</p>';
  const question = value => '<aside class="context-question"><h3>もう少し考えてみたいときに</h3>' + paragraph(value) + '</aside>';
  const simpleRoute = steps => '<ol class="product-route">' + steps.map(step => '<li>' + typeset(step) + '</li>').join('') + '</ol>';
  let content = '';

  if (r.slug === 'animals') {
    content = '<section id="meat-route">' + heading('お肉が届く、五つの場面')
      + '<ol class="delivery-path">' + meatJourney.map((step, index) => '<li><span class="path-number" aria-hidden="true">' + (index + 1)
        + '</span><div><h3>' + typeset(step.name) + '</h3>' + paragraph(step.body)
        + '</div></li>').join('') + '</ol>'
      + sourceNote(['journey', 'meat', 'chicken'], '道のりを知るための図です。農場やお肉の種類によって、順番の間に入る仕事は変わります。') + '</section>'
      + '<section>' + heading('牛乳と卵には、別の道がある')
      + paragraph('牛乳は牛からしぼった乳で、卵はにわとりが産んだものです。お肉が届くまでと、牛乳や卵が届くまででは、働く人や仕事が少しずつちがいます。') + '</section>';
  }

  if (r.slug === 'cow') {
    content = heading('牛肉と牛乳、二つの道')
      + paragraph('牛肉は、農場で育った牛が施設で命を終え、その体をお肉にして届けられます。')
      + '<p><a href="animals.html#meat-route">' + typeset('お肉が届く五つの場面を見る') + '</a></p>'
      + '<section id="milk-route"><h3>' + typeset('牛乳が届く道') + '</h3>'
      + paragraph('牛乳は、生きている牛からしぼった乳で作ります。しぼったあとは、冷やしながら工場へ運びます。')
      + simpleRoute(milkJourney) + sourceNote(['milk'], '2023年4月5日更新の解説をもとにしています。') + '</section>'
      + question('牛乳のパックから、どこで作られたかはわかるかな。その牛がどんな場所で暮らしていたか、知る手がかりはあるかな。');
  }

  if (r.slug === 'pig') {
    content = heading('農場を出てからも、くらしは続く')
      + paragraph('ぶたは生きたまま施設へ運ばれ、そこで命を終えてお肉になります。農場の中だけでなく、移動するときや施設で過ごすときにも目を向けます。')
      + '<p><a href="animals.html#meat-route">' + typeset('ぶたから食卓までの五つの場面を見る') + '</a></p>'
      + question('ぶたが乗る車や、車から降りる通り道。ぶたが立ち止まったら、働く人はどんなことを確かめるとよいだろう。')
      + sourceNote(['journey', 'meat']);
  }

  if (r.slug === 'hen') {
    content = heading('お肉になる道、卵が届く道')
      + paragraph('お肉になるにわとりは、農場から施設へ運ばれ、そこで命を終えます。その体を部位ごとに分けたものが、鶏肉として届きます。')
      + '<p><a href="animals.html#meat-route">' + typeset('お肉が届く五つの場面を見る') + '</a></p>' + sourceNote(['chicken'])
      + '<section id="egg-route"><h3>' + typeset('卵が届く道') + '</h3>'
      + paragraph('卵を集めたあとは、洗って調べ、大きさなどを分けて容器につめます。こうした仕事をする施設を、GPセンターと呼びます。')
      + simpleRoute(eggJourney) + sourceNote(['eggs']) + '</section>'
      + question('卵のパックにあることばから、産んだにわとりのくらしまでわかるかな。書いていないことは、だれに聞けるだろう。');
  }

  if (['hens', 'people', 'rest-questions'].includes(r.slug)) {
    content = kanagawaStudyMarkup({slug:r.slug, typeset}) + (r.slug === 'hens' ? henHousingSurveyMarkup({typeset}) : '');
  }

  if (r.slug === 'sources') {
    content = heading('この説明は、どの資料から？')
      + '<table class="source-map"><thead><tr><th scope="col">このサイトの説明</th><th scope="col">確かめる資料</th></tr></thead><tbody>'
      + sourceMap.map(item => '<tr><th scope="row">' + typeset(item.claim) + '<div class="source-pages">'
        + item.pages.map(([slug, label]) => pageLink(slug, label)).join(' ') + '</div></th><td>'
        + item.refs.map(key => '<p>' + sourceLink(key) + '</p>').join('') + paragraph(item.note) + '</td></tr>').join('') + '</tbody></table>'
      + '<section>' + heading('現場の出来事は、その記録の出典へ')
      + paragraph('現場の事例は、国や年、調べた範囲がそれぞれ違います。各記録にある「出典」から元の資料を開き、何が確認され、何がまだわからないかを確かめます。')
      + '<p>' + pageLink('field-cases', '79件の記録と出典を読む') + '</p></section>';
  }

  if (r.slug === 'corrections') {
    content = heading('これまでの更新') + '<ol class="changes-list">' + editorialUpdates.map(update =>
      '<li><time datetime="' + update.date + '">' + update.date.replaceAll('-', '.') + '</time><h3>' + typeset(update.title)
      + '</h3>' + paragraph(update.body) + '<div class="context-links">' + update.links.map(([slug, label]) => pageLink(slug, label)).join('') + '</div></li>'
    ).join('') + '</ol>';
  }
  return content ? '<div class="editorial-context">' + content + '</div>' : '';
}

export function editorialContextSearchText(row) {
  const plain = value => value.replace(/<([^:>]+):[^>]+>/g, '$1').replace(/\[\[([^\[\]]+)\]\]/g, '$1');
  return editorialContextMarkup({
    r: typeof row === 'string' ? {slug: row} : row,
    typeset: plain, pageLink: (slug, label) => plain(label || slug)
  }).replace(/<[^>]*>/g, ' ').replaceAll('&amp;', '&').replace(/\s+/g, ' ').trim();
}
