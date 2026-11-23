// Optional reading paths. These are invitations, never progress requirements.
// Keep the existing article URLs; no answer, record or report unlocks a step.
export const readingRoutes = [
  {
    id: 'cow', animal: '牛', title: 'シチューから、牛の脚へ',
    intro: 'スプーンでほどけるお肉は、どこから？　すねの場所と、牛のくらしを少し読んでみよう。',
    art: 'runway-beef.webp', width: 1080, height: 810,
    alt: '牛すね肉を煮込んだシチューの料理イメージ', lesson: 'lesson-beef',
    steps: [
      {slug: 'stew', label: '牛すねのシチュー', kind: '料理', time: '1分', note: 'ゆっくり煮る料理。作り方を読んだら、ここまででも。'},
      {slug: 'beef-shank', label: 'すねは、脚のどのあたり？', kind: '体', time: '2分', note: '体の場所と、お肉のすじを図で見くらべます。'},
      {slug: 'cow', label: '牛の一日を少し読む', kind: 'くらし', time: '2分', note: '食べる、歩く、休む。料理につながる動物のくらしへ。'}
    ]
  },
  {
    id: 'pig', animal: 'ぶた', title: 'とんかつから、ぶたの背中へ',
    intro: '衣の中に見える赤身と脂身。ロースの場所を見てから、ぶたが休む場所へ。',
    art: 'kitchen-pork-cutlet.webp', width: 640, height: 360,
    alt: '切り分けた豚ロースのとんかつの料理イメージ', lesson: 'lesson-pork',
    steps: [
      {slug: 'pork-cutlet', label: '豚ロースのとんかつ', kind: '料理', time: '1分', note: '切り口や揚げ方を読む。作って食べる日の楽しみに。'},
      {slug: 'loin', label: 'ロースは、背中のあたり', kind: '体', time: '2分', note: '全身図と切り口から、赤身と脂身の位置を見ます。'},
      {slug: 'pig-rest', label: 'ぶたが横になる場所', kind: 'くらし', time: '2分', note: '床や姿勢の図を見て、休みやすさの手がかりを読みます。'}
    ]
  },
  {
    id: 'hen', animal: 'にわとり', title: 'パリッと焼いた、もも肉から',
    intro: '皮をこんがり焼く一皿から、むねとももの場所へ。にわとりのくらしも、気になったら。',
    art: 'runway-chicken.webp', width: 1080, height: 810,
    alt: '皮をこんがり焼いた鶏もも肉の料理イメージ', lesson: 'lesson-chicken',
    steps: [
      {slug: 'crispy-chicken', label: '鶏ももの皮をパリッと焼く', kind: '料理', time: '1分', note: '焼き目をつける手順を読む。おいしく作るところへ。'},
      {slug: 'chicken-cuts', label: 'むねとももは、どこが違う？', kind: '体', time: '2分', note: '二つの場所と、肉の特徴を見くらべます。'},
      {slug: 'hen', label: 'にわとりのくらしを読む', kind: 'くらし', time: '2分', note: '歩く、羽を広げる、水を飲む。体の動きにつなげます。'}
    ]
  }
];

const plain = value => value.replace(/<([^:>]+):[^>]+>/g, '$1');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function readingRoutesMarkup({typeset}) {
  return '<section class="reading-routes" id="short-routes" aria-labelledby="short-routes-title">'
    + '<p class="reading-route-eyebrow">' + typeset('子どもも選べる、短い読み方') + '</p>'
    + '<h2 id="short-routes-title">' + typeset('どの一皿から、読もう？') + '</h2>'
    + '<p class="reading-routes-intro">' + typeset('三つとも、5分くらいの寄り道です。料理、体、くらしから、気になるところを一つ選んでね。全部を回らなくても、読んだところでおしまいにして大丈夫。作る・食べるだけでも、このサイトの楽しみ方です。') + '</p>'
    + readingRoutes.map((route, index) => '<section class="reading-route" id="route-' + route.id + '" aria-labelledby="route-' + route.id + '-title">'
      + '<figure class="reading-route-photo"><img src="' + route.art + '" alt="' + escape(route.alt) + '" width="' + route.width + '" height="' + route.height + '" loading="lazy"><figcaption>' + typeset('料理のイメージ') + '</figcaption></figure>'
      + '<div class="reading-route-copy"><p class="reading-route-number">0' + (index + 1) + ' <span>' + typeset(route.animal) + '</span></p>'
      + '<h3 id="route-' + route.id + '-title">' + typeset(route.title) + '</h3><p>' + typeset(route.intro) + '</p>'
      + '<ol class="reading-route-steps">' + route.steps.map((step, i) => '<li><span class="reading-route-step-number" aria-hidden="true">' + (i + 1) + '</span><div><span class="reading-route-kind">' + typeset(step.kind + ' · ' + step.time + 'ほど') + '</span><h4><a href="' + step.slug + '.html">' + typeset(step.label) + '</a></h4><p>' + typeset(step.note) + '</p></div></li>').join('') + '</ol>'
      + '<p class="reading-route-stop">' + typeset('質問や家族への報告は、したくなったらで。どのページからも、この一皿へ戻れます。') + '</p></div></section>').join('')
    + '</section>';
}

export function readingRouteContextMarkup({slug, typeset}) {
  const route = readingRoutes.find(item => item.steps.some(step => step.slug === slug));
  if (!route) return '';
  return '<section class="reading-route-context" aria-labelledby="reading-route-context-title" data-reading-route="' + route.id + '">'
    + '<p class="reading-route-eyebrow">' + typeset('一皿から、体とくらしへ') + '</p>'
    + '<h2 id="reading-route-context-title">' + typeset(route.title) + '</h2>'
    + '<p>' + typeset('ここまで読んで、おしまいでも大丈夫。続きが気になったら、次の二つから選べます。') + '</p>'
    + '<ol class="reading-route-stations">' + route.steps.map(step => '<li' + (step.slug === slug ? ' class="is-current"' : '') + '><span class="reading-route-kind">' + typeset(step.kind) + '</span>'
      + (step.slug === slug ? '<span aria-current="page">' + typeset(step.label) + '</span><small>' + typeset('いま読んでいる記事') + '</small>'
        : '<a href="' + step.slug + '.html">' + typeset(step.label) + '</a><small>' + typeset(step.note) + '</small>') + '</li>').join('') + '</ol>'
    + '<p class="reading-route-stop">' + typeset('読む・作る・食べる。今日の楽しみ方でどうぞ。') + ' <a href="lessons.html#route-' + route.id + '">' + typeset('この短い読み方を見る') + '</a></p></section>';
}

export function readingRouteSearchText(slug) {
  const typeset = plain;
  const markup = slug === 'lessons' ? readingRoutesMarkup({typeset}) : readingRouteContextMarkup({slug, typeset});
  return markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
