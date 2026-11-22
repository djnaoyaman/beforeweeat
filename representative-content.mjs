import {cutAtlas, cutUrl} from './cut-atlas.mjs';

// Same reference artwork and normalized position as the shareable cut atlas.
export function representativeLoin({typeset}) {
 const {width,height,parts}=cutAtlas.pig;
 const [[x,y]]=parts.find(part=>part.id==='loin').points;
 const cx=width*x/100,cy=height*y/100;
 const diagram='<svg viewBox="0 0 360 170" width="360" height="170" style="display:block;max-width:100%;height:auto" role="img" aria-labelledby="loin-section-title loin-section-desc">'+
  '<title id="loin-section-title">ぶたのロースの切り口を横から見た説明図</title><desc id="loin-section-desc">赤身は肉の大部分、脂身は外側に付く層、筋の目安は二つの境です。</desc>'+
  '<path d="M40 70C72 56 124 49 170 56s78 12 126 3c23-4 31 19 25 38-9 34-61 44-109 49-66 6-122-3-164-19-27-10-31-41-8-57Z" fill="#bd715e" stroke="#542c24" stroke-width="3"/>'+
  '<path d="M39 70C72 56 124 49 170 56s78 12 126 3c21-4 29 12 27 30-38 9-97 5-151-4-45-7-110-8-142 9-1-11 2-19 9-24Z" fill="#f7e6b5" stroke="#542c24" stroke-width="3"/>'+
  '<path d="M30 95c32-17 97-16 142-9 54 9 113 13 151 4" fill="none" stroke="#fff7e7" stroke-width="4" stroke-dasharray="7 5"/>'+
  '<g fill="none" stroke="#173b2c" stroke-width="2"><path d="M105 30v27"/><path d="M224 118l24 15"/><path d="M284 31l-30 60"/></g>'+
  '<g fill="#173b2c" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16"><text x="105" y="25">1</text><text x="216" y="116">2</text><text x="289" y="26">3</text></g></svg>';
 return '<figure class="animal-plate representative-figure"><svg viewBox="0 0 '+width+' '+height+'" width="'+width+'" height="'+height+'" style="display:block;max-width:100%;height:auto" role="img" aria-labelledby="loin-location-title">'+
  '<title id="loin-location-title">ぶたの体を横から見た図。ロースは肩よりうしろの背中側です。</title>'+
  '<image href="pig-art.webp" width="'+width+'" height="'+height+'"/>'+
  '<circle cx="'+cx+'" cy="'+cy+'" r="28" fill="#fbf5df" stroke="#173b2c" stroke-width="7"/>'+
  '<circle cx="'+cx+'" cy="'+cy+'" r="12" fill="#a64b31"/></svg>'+
  '<figcaption>'+typeset('体の場所を示す説明図。丸印はロースの目安で、肉を切り分ける線ではありません。')+'</figcaption></figure>'+
  '<h2>'+typeset('切った面の、どこを見ればいい？')+'</h2>'+
  '<figure class="representative-figure">'+diagram+'<figcaption>'+typeset('肉の切り口の説明図。実物の形や脂身の厚みは、一切れずつ違います。')+'</figcaption></figure>'+
  '<ol><li>'+typeset('脂身。外側についている白っぽいところ。')+'</li><li>'+typeset('<赤身:あかみ>。切り口の多くをしめる赤い肉。')+'</li><li>'+typeset('<筋:すじ>の目安。赤身と脂身の境に、かたい<筋:すじ>が見えることがあります。')+'</li></ol>'+
  '<h2>'+typeset('料理に合わせて、厚みを選ぶ')+'</h2>'+
  '<dl><dt>'+typeset('うす切り')+'</dt><dd>'+typeset('すき焼きなどに。となりの肉と重ならないように広げやすい厚みです。')+'</dd>'+
  '<dt>'+typeset('厚切り')+'</dt><dd>'+typeset('とんかつやソテーに。とんかつの記事では、厚さ約1cmを使います。厚みが違えば火の通り方も違うので、いちばん厚いところの中心を温度計で確かめます。')+'</dd></dl>';
}

export function representativeGinger({typeset}) {
 return '<section aria-labelledby="ginger-finishing"><h2 id="ginger-finishing">'+typeset('焼き色と、しょうがの香り')+'</h2>'+
  '<p>'+typeset('フライパンに汁がたまって焼き色がつきにくいときは、次に入れる肉の量を減らします。たれは最後に。しょうがの香りが立ち、たれが肉と玉ねぎにからんだら<盛:も>りつけます。')+'</p>'+
  '<p>'+typeset('焼き色はおいしさの目安で、火が通ったかどうかは中心温度計で確かめます。色や焼いた時間だけでは決めません。')+'</p></section>';
}

export function representativeNext({r,typeset,pageLink}) {
 const links=r.slug==='loin'
  ? [[cutUrl('pig','loin'),'図鑑でロースの場所を見る','肩やおなかの部位と切りかえ、背中のどの辺りか見比べられます。'],['pork-cutlet','厚切りのロースで、とんかつ','肉の厚みをそろえ、脂身との境に切りこみを入れる手順がわかります。']]
  : r.slug==='ginger-pork'
  ? [['miso-soup','残った豚こまを、ふたり分の豚汁に','消費期限内の肉を、野菜とだしで別の一皿に。80gを使う手順です。'],['heat','肉の火の通りを温度計で確かめる','火が通ったか迷ったとき、どこをはかるか見直せます。']]
  : null;
 if(!links)return null;
 return '<aside class="representative-next" aria-labelledby="representative-next-title"><h2 id="representative-next-title">'+typeset('この続きが気になったら')+'</h2>'+
  links.map(([slug,label,reason])=>'<p>'+(slug.includes('#')?'<a href="'+slug+'">'+typeset(label)+'</a>':pageLink(slug,label))+'<br>'+typeset(reason)+'</p>').join('')+'</aside>';
}
