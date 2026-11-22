// Scoped P2 content: these neutral diagrams are original illustrations, not source photographs.
const home = {
  href:'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/syokuchu/01_00006.html',
  label:'厚生労働省「家庭でできる食中毒予防の６つのポイント」'
};
const frige = {
  href:'https://www.maff.go.jp/j/syouan/seisaku/foodpoisoning/frige.html',
  label:'農林水産省「冷蔵庫のかしこい使い方」'
};
const labels = {
  href:'https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/expiration_date',
  label:'消費者庁「食品の期限表示に関する情報」'
};
const probe = {
  href:'https://www.fsc.go.jp/fsciis/foodSafetyMaterial/print/syu06140580106',
  label:'食品安全委員会「米国農務省食品安全検査局による食品温度計の使い方」'
};
const heatArt = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 176" width="420" height="176" aria-hidden="true" focusable="false"><path fill="#f6eddb" d="M0 0h420v176H0z"/><path d="M75 134Q43 132 58 99Q74 51 143 57Q188 58 239 74Q300 80 332 110Q346 132 303 134Z" fill="#da987f" stroke="#2a3e30" stroke-width="4"/><path d="M276 109q18-3 26 4q4 8-10 13h-19q-10-4 3-17z" fill="#fff2d0" stroke="#2a3e30" stroke-width="3"/><path d="M348 49L176 100" fill="none" stroke="#263c30" stroke-width="5" stroke-linecap="round"/><path d="M352 48l47-17" fill="none" stroke="#263c30" stroke-width="15" stroke-linecap="round"/><circle cx="176" cy="100" r="9" fill="#fff2d0" stroke="#263c30" stroke-width="4"/><path d="M176 112v33" stroke="#263c30" stroke-width="2" stroke-dasharray="5 4"/></svg>';
const coldArt = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 130" width="420" height="130" aria-hidden="true" focusable="false"><path fill="#f6eddb" d="M0 0h420v130H0z"/><g fill="none" stroke="#294233" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M28 54h57l-6 42H34Z M39 54l8-14h19l8 14 M106 69h20l-5-5m5 5-5 5 M147 38h53v61h-53z M147 60h53m-41-13v6m0 18v9 M221 69h20l-5-5m5 5-5 5 M259 68q25-19 51 0l-5 22h-41z m4 9h43 M323 69h20l-5-5m5 5-5 5 M357 75h41q0 18-11 21h-18q-12-4-12-21z M398 77l12-9 m-40 1q-5-5 2-12 m12 11q-5-5 2-12"/></g></svg>';
const content = {
  heat:{
    sections:[
      ['差す場所は、いちばん厚いところ', '料理用の<温度計:おんどけい>の先を、いちばん厚い肉のまんなかに入れます。骨付きなら、先が骨に当たらないように。薄い肉は、<温度計:おんどけい>の説明を読んで、横から先を届かせます。何枚も焼くときは、厚いものから何枚かをはかります。'],
      ['まだ足りなかったら、火に戻す', '<家庭:かてい>で肉を<加熱:かねつ>するときの目安は、<中心:ちゅうしん>が75℃になってから、その温度で1分間以上。足りなかったら、その肉をなべやフライパンに戻して火を通し、もう一度はかります。<表面:ひょうめん>の色や、焼いた時間だけでは決めません。'],
      ['焼く前と、盛りつけを分ける', '生のお肉をつかんだトングと、焼けたお肉をお皿にのせるトングを分けます。同じ<道具:どうぐ>を使うなら、使い直す前によく洗います。生肉にふれた手、まな板、<温度計:おんどけい>の先も洗いましょう。焼いた肉は、生肉を置いたお皿に戻しません。']
    ],
    diagram:heatArt,
    diagramDescription:'図の丸は、<温度計:おんどけい>の先が届く場所。白い骨ではなく、厚い肉のまんなかをはかります。',
    citations:[[home,'<家庭:かてい>での<加熱:かねつ>の目安、手と<道具:どうぐ>の洗い方'],[probe,'厚い場所や<薄切り:うすぎり>のはかり方。温度の<基準:きじゅん>は日本の<家庭:かてい>向け<資料:しりょう>を使っています。']],
    links:[['crispy-chicken','皮がパリッと焼けたあと、身の厚いところをはかる例へ。'],['storage','焼く前のお肉を、どこに置くか決めたいときに。']]
  },
  storage:{
    sections:[
      ['1｜冷たいまま持ち帰る', 'お肉は買い物の終わりにかごへ。長く持ち歩きそうな日は<保冷剤:ほれいざい>を使い、帰ったら早めにしまいます。'],
      ['2｜<表示:ひょうじ>を見て、汁を分けて置く', 'まず袋の<保存方法:ほぞんほうほう>と<消費期限:しょうひきげん>を見ます。期限は、開けていないものを、<表示:ひょうじ>どおりにしまった場合のもの。<消費期限:しょうひきげん>を過ぎたものは食べず、開けたら早めに使います。生肉は汁がもれない袋や<容器:ようき>に入れ、すぐ食べるほかの食品と分けます。<冷凍:れいとう>するなら、<表示:ひょうじ>を先に確かめ、一回分ずつ分けると使いやすくなります。'],
      ['3｜使う分だけとかす', '<冷蔵庫:れいぞうこ>の中か<電子レンジ:でんしレンジ>で、使う分だけとかします。台の上に置いたままにはしません。<冷蔵庫:れいぞうこ>でとかすときも、汁がほかにたれないよう、袋をお皿や<容器:ようき>にのせます。'],
      ['4｜とかしたら、すぐに火を通す', 'とかし終わったら、すぐ料理に使います。<冷凍:れいとう>と<解凍:かいとう>をくり返さないようにします。']
    ],
    diagram:coldArt,
    diagramDescription:'持ち帰る、しまう、使う分だけとかす、すぐ火を通す。左から右へ、台所までの四つの場面です。',
    check:'たとえば、今夜の一回分と、あとで使う分に分けるとき。まずパックの<表示:ひょうじ>を見ます。<冷凍:れいとう>できるものなら、あとで使う分を早めに分け、包みに入れた日を書きます。書いた日は、新しい<消費期限:しょうひきげん>ではありません。',
    citations:[[home,'買い物から<解凍:かいとう>・<調理:ちょうり>まで'],[frige,'汁をほかの食品と分ける方法と、一回分ずつの保存'],[labels,'期限の意味と、<表示:ひょうじ>どおりに保存する条件']],
    links:[['shopping','お店で、<表示:ひょうじ>のどこを見るか知りたいときに。'],['heat','使う分をとかしたら、<中心:ちゅうしん>まで火が通ったかを確認する方法へ。']]
  }
};
export function hasCookingSafety(slug) {return Object.hasOwn(content,slug);}
export function cookingSafety(slug,{typeset}) {
  const c=content[slug]; if(!c)return '';
  const figure='<figure class="safety-figure">'+c.diagram+'<figcaption>'+typeset(c.diagramDescription)+'</figcaption></figure>';
  const sections=c.sections.map(([heading,copy],i)=>'<section aria-labelledby="safety-part-'+i+'"><h2 id="safety-part-'+i+'">'+typeset(heading)+'</h2><p>'+typeset(copy)+'</p></section>').join('');
  const check=c.check?'<p class="safety-example">'+typeset(c.check)+'</p>':'';
  return '<div class="safety-guide">'+figure+sections+check+'</div>';
}
export function cookingSafetySources(slug,{typeset}) {
  const c=content[slug]; if(!c)return '';
  return '<details class="references"><summary>出典</summary><ul>'+c.citations.map(([source,point])=>'<li><a href="'+source.href+'">'+typeset(source.label)+'</a> '+typeset(point)+'</li>').join('')+'</ul></details>';
}
export function cookingSafetyNext(slug,{typeset,pageLink}) {
  const c=content[slug]; if(!c)return '';
  return '<ul class="story-list safety-next">'+c.links.map(([url,why])=>'<li>'+pageLink(url)+'<p>'+typeset(why)+'</p></li>').join('')+'</ul>';
}

// Page-local rules are emitted only for the two guide pages.
export const cookingSafetyStyle = '<style>.safety-guide{margin-block:1.4em 2.2em}.safety-guide section{margin-block:1.35em}.safety-guide h2{margin-block-end:.35em}.safety-guide p{margin-block-start:0}.safety-figure{max-width:32rem;margin:0 0 1.5em;padding:0}.safety-figure svg{display:block;max-width:100%;height:auto}.safety-figure figcaption{margin-top:.6em;font-size:.92em}.safety-example{border-inline-start:.18em solid #566146;padding-inline-start:.85em}.safety-next li p{margin:.3em 0 0}.safety-next a{text-decoration:underline;text-underline-offset:.21em}.safety-next a:focus-visible{outline:2px solid currentColor;outline-offset:.2em}</style>';
export function cookingSafetySearchText(slug,{plain}) {
  const c=content[slug];
  return c?plain([c.diagramDescription,c.check??'',...c.sections.flat(),...c.links.map(([,why])=>why)].join(' ')):'';
}
