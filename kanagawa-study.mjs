// One public research record, rendered for three different reading purposes.
// The source update date is not a claim about when the experiment took place.
export const kanagawaStudy = {
  id: 'kanagawa-enriched-cage',
  country: '日本',
  institution: '神奈川県畜産技術センター',
  sourceType: '研究機関による公開解説',
  sourceTitle: '研究内容の紹介（畜産技術センター）',
  sourceUrl: 'https://www.pref.kanagawa.jp/docs/a2d/cnt/sciencelab/202402tikusangijutu.html',
  sourceUpdated: '2026-07-10',
  checkedOn: '2026-11-23',
  sections: ['研究の内容', '今後の展開'],
  setting: '県内で多く飼われている種類の鶏を、従来のケージと、巣箱や止まり木などを備えたケージで比べた研究です。',
  collaboration: '県の研究者が国内のケージメーカーと協力し、鶏の行動と、卵の産まれ方などを調べました。',
  observations: [
    {id: 'nest', place: '巣箱', observed: '巣箱の中で、より多くの卵が産まれました。', limit: 'どの巣箱でも同じ結果になる、とまでは言えません。'},
    {id: 'perch', place: '止まり木', observed: '昼も夜も、休むときに使う姿が確認されました。', limit: '使ったことと、すべての鶏が十分に休めたことは分けて読みます。'},
    {id: 'dust', place: '砂浴び用の人工芝', observed: '4週間の間にふんが積もり、砂浴びに似た動きが見られなくなりました。', limit: '床をネットに変えた後、砂浴びが十分にできたとは、この資料では確認できません。'}
  ],
  change: '汚れへの対策として、人工芝からポリエチレン製のネットへ床を変えました。',
  next: '砂浴びの場所の改良と、汚れた卵や割れた卵を減らす方法が、続けて調べる課題です。',
  unreported: 'この解説には、試験した鶏の数や試験全体の日程、農場への広がりは書かれていません。'
};

export const kanagawaSource = [
  '神奈川県畜産技術センターの研究紹介', kanagawaStudy.sourceUrl
];

// This national survey has a different population from the Kanagawa experiment.
export const henHousingSurvey = {
  period: '令和6年度', country: '日本', total: 408,
  categories: [['ケージのみ', 304], ['平飼いのみ', 59], ['両方', 45]],
  sourceUrl: 'https://www.maff.go.jp/j/chikusan/sinko/attach/pdf/animal_welfare-116.pdf'
};

export function henHousingSurveyMarkup({typeset:t}) {
  const s = henHousingSurvey;
  return '<section class="housing-survey"><h2>' + t('日本の飼い方を、別の調査から読む') + '</h2>'
    + '<p>' + t('農林水産省の' + s.period + '調査で、鶏の飼い方を答えた' + s.total + '件の内訳です。鶏の羽数の割合ではありません。') + '</p>'
    + '<figure class="survey"><strong>' + s.total + '件の回答</strong><div aria-hidden="true">'
    + s.categories.map(([,n],i) => ('<i class="n' + (i+1) + '"></i>').repeat(n)).join('')
    + '</div><figcaption>' + s.categories.map(([name,n]) => t(name) + n + '件').join(' ／ ') + '</figcaption></figure>'
    + '<p>' + t('この数字だけでは、ケージの中に巣箱や止まり木があるかまではわかりません。神奈川県の研究で使った設備が、全国でどのくらい使われているかを示す数字でもありません。') + '</p>'
    + '<p class="context-sources"><a href="' + s.sourceUrl + '">' + t('農林水産省の採卵鶏の調査結果（PDF）') + '</a></p></section>';
}

export function kanagawaStudyMarkup({slug, typeset: t}) {
  if (!['hens', 'people', 'rest-questions'].includes(slug)) return '';
  const s = kanagawaStudy;
  const h = value => '<h2>' + t(value) + '</h2>';
  const p = value => '<p>' + t(value) + '</p>';
  const source = '<p class="context-sources"><a href="' + s.sourceUrl + '">' + t(s.sourceTitle) + '</a><br>'
    + t('日本・神奈川県／' + s.sourceType + '。元のページの更新日 ' + s.sourceUpdated.replaceAll('-', '.')
      + '。参照箇所「' + s.sections.join('」「') + '」。このサイトによる取材ではありません。') + '</p>';
  const note = '<details class="references"><summary>' + t('この資料でわかる範囲') + '</summary>' + p(s.unreported) + '</details>';
  let body = '';
  if (slug === 'hens') {
    body = h('置いたものを、鶏はどう使った？') + p(s.setting)
      + '<dl class="study-observations">' + s.observations.map(o => '<div data-study-observation="' + o.id + '"><dt>'
        + t(o.place) + '</dt><dd>' + p(o.observed) + '<p class="study-limit">' + t('読み取るときに　' + o.limit) + '</p></dd></div>').join('') + '</dl>'
      + p('ここに書いたのは、この研究で見られたことです。下の日本の飼い方の調査とは、対象が異なります。') + note;
  } else if (slug === 'people') {
    body = h('つくる人と、確かめる人') + p(s.collaboration)
      + '<ol class="study-process"><li><h3>' + t('使う場所をつくる') + '</h3>' + p('巣箱、止まり木、爪とぎ、砂浴びの場所を備えたケージを用意しました。')
      + '</li><li><h3>' + t('行動を見て、手直しする') + '</h3>' + p(s.observations.find(o => o.id === 'dust').observed) + p(s.change)
      + '</li><li><h3>' + t('残った課題を調べる') + '</h3>' + p(s.next) + '</li></ol>'
      + p('道具を置いて終わりにせず、使われ方を確かめながら直していく。この順序を、公開資料からたどれます。') + note;
  } else {
    body = h('見たことと、まだわからないこと')
      + p('研究の結果を読むときは、何を、いつ、どこで見たかを一組にします。たとえば、同じ研究の止まり木の記録を読むとき。')
      + '<dl class="study-observations"><div><dt>' + t('資料に書かれていること') + '</dt><dd>' + p(s.observations.find(o => o.id === 'perch').observed)
      + '</dd></div><div><dt>' + t('この記述だけではわからないこと') + '</dt><dd>'
      + p('どの鶏が、どのくらいの時間、そこで休んだか。一度のようすから、いつも同じだとは決められません。') + '</dd></div></dl>'
      + '<details class="study-optional"><summary>' + t('観察をしてみたい人へ') + '</summary>'
      + p('次の三つは、このサイトが考えた見方です。研究者が実施した手順ではありません。読むだけで終えてもかまいません。')
      + '<ol><li>' + t('時刻と場所をそろえて、使っている鶏と使っていない鶏を分けて見る。') + '</li><li>'
      + t('床の汚れと、掃除からの時間を一緒に残す。') + '</li><li>'
      + t('「使っていない」と「使えない」を分け、理由がわからないときは、わからないと残す。') + '</li></ol>'
      + p('実際に見るときは、飼っている人の案内に従い、動物を動かしたり、囲いに入ったりせず、外から静かに見ます。') + '</details>';
  }
  return '<section class="documented-case research-study" data-study="' + s.id + '" data-study-role="' + slug + '">'
    + body + source + '</section>';
}
