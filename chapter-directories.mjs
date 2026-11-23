import { directoryCopy } from './directory-copy.mjs';
import { cutAtlas } from './cut-atlas.mjs';
import { kanagawaStudy } from './kanagawa-study.mjs';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const animalArt = { cow: 'cow-art.webp', pig: 'pig-art.webp', hen: 'hen-art.webp' };

// These drawings are reading guides, not photographs or measured diagrams.
function drawing(kind) {
  const paper = '<path fill="#e8e7d7" d="M28 45Q300 4 572 45L562 302Q305 329 38 302Z"/>';
  const drawings = {
    'egg-pack': '<g stroke="currentColor" stroke-width="3" fill="#f8f5eb"><path d="M86 115Q300 78 514 115L493 269Q300 296 107 269Z"/>' +
      [155, 300, 445].map(x => '<ellipse cx="' + x + '" cy="177" rx="43" ry="61" transform="rotate(-8 ' + x + ' 177)"/>').join('') +
      '<path fill="#dadfcf" d="M94 202Q300 226 506 202L499 249Q300 276 101 249Z"/></g><text x="300" y="70" text-anchor="middle">たまごのパック</text><text x="300" y="244" text-anchor="middle">ことばを よむ</text>',
    'bone-weight': '<g stroke="currentColor" stroke-width="3"><path fill="#cfad93" d="M132 91Q196 53 252 104Q274 143 238 176L152 197Q94 177 111 130Z"/>' +
      '<path fill="#f8f5eb" d="M145 126C119 103 100 130 119 148C100 167 124 191 143 171L212 130C234 150 257 122 238 107C252 83 222 71 209 98Z"/>' +
      '<path fill="#f8f5eb" d="M74 211H292L278 282H89Z"/><path fill="#dadfcf" d="M136 234H230V266H136Z"/>' +
      '<path fill="#cfad93" d="M391 117Q439 80 486 113Q518 159 473 191Q420 212 386 167Z"/><path fill="none" d="M366 216Q440 237 514 216"/></g>' +
      '<text x="185" y="60" text-anchor="middle">ほねも ふくむ</text><text x="442" y="268" text-anchor="middle">たべる ぶぶん</text>',
    'observation-note': '<g stroke="currentColor" stroke-width="3"><path fill="#f8f5eb" d="M97 50H477V295H97Z"/><path fill="none" d="M137 50V295M161 130H441M161 196H441M161 262H441"/>' +
      '<path fill="#dadfcf" d="M246 36H336V72H246Z"/></g><text x="168" y="113">いつ</text><text x="168" y="179">どこ</text><text x="168" y="245">どう つかった</text>',
    'hen-observations': '<image href="hen-art.webp" x="44" y="31" width="239" height="266"/>' +
      '<g stroke="currentColor" stroke-width="2" fill="none"><path d="M332 109H526M332 148H494M332 233H526M332 272H473"/></g>' +
      '<text x="332" y="80">みた こと</text><text x="332" y="204">これから</text>',
    'changes-note': '<g stroke="currentColor" stroke-width="3"><path fill="#f8f5eb" d="M98 65H493V293H98Z"/><path fill="#dadfcf" d="M98 65H493V121H98Z"/>' +
      '<path fill="none" d="M169 43V85M422 43V85M131 189H459M131 253H459"/></g><text x="295" y="104" text-anchor="middle">ひづけ</text>' +
      '<text x="136" y="171">かわった こと</text><text x="136" y="235">その わけ</text>',
    'editorial-notes': '<g stroke="currentColor" stroke-width="3" fill="#f8f5eb"><path d="M54 88H207V278H54Z"/><path d="M224 53H377V278H224Z"/><path d="M394 106H547V278H394Z"/>' +
      '<path fill="none" d="M76 170H185M76 202H169M246 135H355M246 167H337M416 188H525M416 220H509"/></g>' +
      '<text x="131" y="139" text-anchor="middle">しりょう</text><text x="300" y="104" text-anchor="middle">しゃしん</text><text x="471" y="157" text-anchor="middle">すうじ</text>',
    'nutrition-conditions': [110, 300, 490].map(x => '<g stroke="currentColor" stroke-width="3"><ellipse cx="' + x + '" cy="174" rx="84" ry="52" fill="#f8f5eb"/>' +
      '<ellipse cx="' + x + '" cy="174" rx="61" ry="32" fill="#cfad93"/></g><text x="' + x + '" y="264" text-anchor="middle">100g</text>').join('') +
      '<text x="300" y="74" text-anchor="middle">おなじ おもさで</text>'
  };
  if (!drawings[kind]) throw new Error('Unknown chapter drawing: ' + kind);
  return '<svg class="chapter-drawing" viewBox="0 0 600 340" aria-hidden="true" focusable="false">' + paper + drawings[kind] + '</svg>';
}

function cutDrawing(animal, parts) {
  const atlas = cutAtlas[animal];
  const selected = parts.map(id => atlas.parts.find(part => part.id === id));
  if (selected.some(part => !part)) throw new Error('Unknown cut preview: ' + animal + '/' + parts.join(','));
  const markers = selected.map(part => part.points.map(([x, y]) =>
    '<g class="chapter-cut-point' + (part.inner ? ' is-inner' : '') + '"><circle cx="' + atlas.width * x / 100 + '" cy="' +
    atlas.height * y / 100 + '" r="' + atlas.width * .04 + '"/><circle class="chapter-cut-core" cx="' + atlas.width * x / 100 +
    '" cy="' + atlas.height * y / 100 + '" r="' + atlas.width * .011 + '"/></g>').join('')).join('');
  return '<svg class="chapter-cut-drawing" viewBox="0 0 ' + atlas.width + ' ' + atlas.height +
    '" aria-hidden="true" focusable="false"><image href="' + animalArt[animal] + '" width="' + atlas.width +
    '" height="' + atlas.height + '"/>' + markers + '</svg>';
}

const directories = {
  shopping: {
    heading: 'パックと重さから、選んでみよう',
    intro: '書いてあることを読む入口と、食べる量を考える入口。今日の買い物に合うほうからどうぞ。',
    items: [
      { slug: 'eggs', kicker: 'パックのことば', drawing: 'egg-pack', caption: '表示を読むためのイラスト',
        description: '卵のパックの見本で、書いてあることと、まだわからないことを見分けます。「平飼い」ということばも確かめられます。' },
      { slug: 'buy-bone', kicker: '骨つき肉の量', drawing: 'bone-weight', caption: '重さを考えるための図',
        description: '手羽やスペアリブは、骨もふくめた重さで売られています。何人で食べるかを決め、料理の分量と見くらべます。' }
    ]
  },
  people: {
    heading: '鶏の研究を、二つの入口から',
    intro: 'ここまで読んだ工夫の続きです。研究で見えた行動を読むか、確かめ方を考えるか。気になるほうを選べます。',
    items: [
      { slug: 'hens', kicker: '研究で見えたこと', drawing: 'hen-observations', caption: '行動の記録への案内',
        description: '巣箱や止まり木を、鶏はどう使ったのでしょう。研究の条件と、観察された行動を一緒に読みます。' },
      { slug: 'rest-questions', kicker: '確かめ方を考える', drawing: 'observation-note', caption: '見ることを整理する図',
        description: '道具を置いたあと、いつ、どこを、どう見るか。研究でわかったことを手がかりに、次に確かめたいことを考えます。' }
    ],
    source: { label: kanagawaStudy.sourceTitle, url: kanagawaStudy.sourceUrl, date: kanagawaStudy.sourceUpdated }
  },
  sources: {
    heading: '書き方と、変わったところを読む',
    intro: '元の資料を確かめたら、記事の作り方や、その後の更新もたどれます。知りたいことに合う入口を選んでください。',
    items: [
      { slug: 'corrections', kicker: '日付からたどる', drawing: 'changes-note', caption: '更新を見るための図',
        description: 'いつ、どの記事を、なぜ変えたか。更新・訂正の記録から、変わった記事に戻れます。' },
      { slug: 'editorial', kicker: '説明の作り方', drawing: 'editorial-notes', caption: '書き方を確かめる図',
        description: '出典の選び方、数値につける条件、写真とイラストの区別。MINAが記事を作るときの約束を読めます。' }
    ]
  }
};

function story(item, context) {
  const { rows, typeset, hasAsset } = context;
  const row = rows.find(row => row.slug === item.slug);
  if (!row) throw new Error('Missing chapter directory article: ' + item.slug);
  const art = item.photo || (item.animal ? animalArt[item.animal] : item.drawing === 'hen-observations' ? animalArt.hen : '');
  if (art && hasAsset && !hasAsset(art)) throw new Error('Missing chapter directory art: ' + art);
  const visual = item.photo ? '<img loading="lazy" src="' + item.photo + '" width="1080" height="810" alt="">' :
    item.animal ? cutDrawing(item.animal, item.parts) : drawing(item.drawing);
  return '<li class="chapter-story' + (item.photo ? ' chapter-story--meal' : '') + '" data-directory-slug="' + item.slug + '">' +
    '<a href="' + item.slug + '.html"><div class="chapter-story-art">' + visual + '<span class="chapter-art-caption">' +
    typeset(item.caption || (item.photo ? '料理のイメージ' : '場所の目安')) + '</span></div><div class="chapter-story-copy"><p class="chapter-story-kicker">' +
    typeset(item.kicker) + '</p><h3>' + typeset(row.title) + '</h3><p>' + typeset(item.description || directoryCopy[item.slug]) + '</p></div></a></li>';
}

export function chapterDirectory({ r, ...context }) {
  const directory = directories[r.slug];
  if (!directory) return '';
  const { rows, typeset } = context;
  const covered = new Set(directory.items.map(item => item.slug));
  for (const row of rows.filter(row => row.group === r.group && row.slug !== r.slug)) {
    if (!covered.has(row.slug)) throw new Error('Chapter directory needs an introduction for ' + row.slug);
  }
  const id = r.slug + '-reading-directory';
  let source = '';
  if (directory.source) {
    const { label, url, date } = directory.source;
    source = '<p class="chapter-directory-source">' + typeset('日本・神奈川県の研究紹介') + ' ／ <time datetime="' + date + '">' +
      date.replaceAll('-', '.') + '</time> ' + typeset('更新') + '<br><a href="' + escape(url) + '">' + typeset(label) + '</a></p>';
  }
  return '<section class="chapter-editorial chapter-editorial--' + r.slug + '" aria-labelledby="' + id + '"><h2 id="' + id + '">' +
    typeset(directory.heading) + '</h2><p class="chapter-directory-intro">' + typeset(directory.intro) + '</p>' + source +
    '<ul class="chapter-stories">' + directory.items.map(item => story(item, context)).join('') + '</ul></section>';
}

const cutReadings = [
  { slug: 'loin', kicker: 'ぶたの背中', animal: 'pig', parts: ['loin'] },
  { slug: 'pork-round', kicker: 'ぶたの後ろあし', animal: 'pig', parts: ['round'] },
  { slug: 'ribs', kicker: 'ぶたのあばら骨', animal: 'pig', parts: ['spare-ribs'] },
  { slug: 'beef-shank', kicker: '牛のあしの下のほう', animal: 'cow', parts: ['shank'] },
  { slug: 'beef-round', kicker: '牛の後ろあし', animal: 'cow', parts: ['round'] },
  { slug: 'chicken-cuts', kicker: '鶏のむねと、もも', animal: 'hen', parts: ['breast', 'thigh'] },
  { slug: 'nutrition', kicker: '条件をそろえて比べる', drawing: 'nutrition-conditions', caption: '同じ重さで比べる図',
    description: '部位や皮、脂身の条件を確かめて、100g当たりの成分を読みくらべます。レシピ1人分の値とは分けて見ます。' }
];

export function cutReadingDirectory(context) {
  const { typeset } = context;
  const meals = [
    { slug: 'stew', kicker: '牛すねを煮る', photo: 'runway-beef.webp', description: 'すね肉をゆっくり煮る料理。水分や火加減を見ながら、ほぐれるまでの手順をたどれます。' },
    { slug: 'bbq-ribs', kicker: 'ぶたの骨つき肉を焼く', photo: 'runway-rib.webp', description: '骨のまわりの肉を焼き、たれをぬるのは仕上げに。スペアリブの形が料理につながります。' },
    { slug: 'crispy-chicken', kicker: '鶏ももを焼く', photo: 'runway-chicken.webp', description: '皮を下にして、フライパンで焼く一皿。皮と肉の食感のちがいを楽しめます。' }
  ];
  return '<section class="chapter-editorial chapter-editorial--cuts" aria-labelledby="cuts-reading-directory"><h2 id="cuts-reading-directory">' +
    typeset('場所がわかったら、切り口と料理へ') + '</h2><p class="chapter-directory-intro">' +
    typeset('同じ動物でも、場所や切り方で料理への使い方が変わります。気になった部位を、もう少し詳しく見てみましょう。') +
    '</p><p class="chapter-directory-note">' + typeset('目印はおおよその場所です。切り分ける線ではありません。点線は体の奥や内側もふくむ場所です。') +
    '</p><ul class="chapter-stories chapter-stories--cuts">' + cutReadings.map(item => story(item, context)).join('') + '</ul></section>' +
    '<section class="chapter-editorial" aria-labelledby="cuts-meal-directory"><h2 id="cuts-meal-directory">' + typeset('この部位で、作ってみたい一皿') +
    '</h2><ul class="chapter-stories chapter-stories--meals">' + meals.map(item => story(item, context)).join('') + '</ul></section>';
}
