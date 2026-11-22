import {cutAtlas, cutUrl} from './cut-atlas.mjs';

const art={pig:'pig-art.webp',cow:'cow-art.webp'};
const descriptor={
 'pork-round':['pig','round','ぶたのもも。後ろ脚の上のほう、内側などを示します。'],
 ribs:['pig','spare-ribs','スペアリブはおなか寄りの、あばら骨のまわりです。'],
 'beef-shank':['cow','shank','牛のすね。前脚と後ろ脚の両方の下のほうです。'],
 'beef-round':['cow','round','牛のもも。後ろ脚の上のほう、内側などを示します。']
};
const source={
 'pork-round':{label:'大型種肉のぶた・もも・赤身・生',id:'11134',values:['22.1 g','3.6 g','0.9 mg']},
 'beef-round':{label:'輸入牛肉・もも・赤身・生',id:'11077',values:['21.2 g','4.3 g','2.6 mg']}
};
const svgStyle='style="display:block;max-width:100%;height:auto"';
const browse=[
 ['#fff7e7','#bd715e','#542c24'],['#faf0d6','#9b574b','#4d3126']
];
const diagram=(key,label,shapes,width=360,height=166)=>'<svg xmlns="http://www.w3.org/2000/svg" '+svgStyle+' width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" role="img" aria-labelledby="'+key+'-label"><title id="'+key+'-label">'+label+'</title>'+shapes+'</svg>';
function bodyAtlas(slug,t){
 const [animal,id,label]=descriptor[slug],atlas=cutAtlas[animal];
 const selected=atlas.parts.find(part=>part.id===id);
 const marks=selected.points.map(([x,y])=>{
  const cx=atlas.width*x/100,cy=atlas.height*y/100;
  return '<circle cx="'+cx+'" cy="'+cy+'" r="26" fill="#fff7e7" stroke="#173b2c" stroke-width="6"'+(selected.inner?' stroke-dasharray="8 4"':'')+'/><circle cx="'+cx+'" cy="'+cy+'" r="10" fill="#a64b31"/>';
 }).join('');
 return '<figure class="animal-plate representative-figure">'+diagram(slug+'-atlas',label,'<image href="'+art[animal]+'" width="'+atlas.width+'" height="'+atlas.height+'"/>'+marks,atlas.width,atlas.height)+
 '<figcaption>'+t(label+' 図の丸は場所の目安です。肉を切り分ける線ではありません。'+(selected.inner?' 点線は体の内側も含む目印です。':''))+'</figcaption></figure>';
}
function sectionDrawing(key,t,label,caption,shapes,width,height) {
 return '<figure class="representative-figure">'+diagram(key,label,shapes,width,height)+'<figcaption>'+t('説明図。'+caption)+'</figcaption></figure>';
}
function roundDrawing(slug,t) {
 const [fat,lean,edge]=browse[slug==='pork-round'?0:1];
 const panels=[18,196].map((x,i)=>'<g transform="translate('+x+' 20)">'+
 '<path d="M12 53C30 27 98 19 128 40c22 15 11 53-17 63-38 14-75 6-91-8-12-11-16-23-8-42Z" fill="'+lean+'" stroke="'+edge+'" stroke-width="3"/>'+
 (i===0?'<path d="M12 53C30 27 98 19 128 40c5 4 8 8 9 14-42-19-85-11-132 14 0-6 3-11 7-15Z" fill="'+fat+'" stroke="'+edge+'" stroke-width="3"/>':'')+
 (slug==='beef-round'?'<path d="M25 76l69-23m-52 37 74-24m-43 32 45-16" stroke="#fff7e7" opacity=".75" stroke-width="2"/>':'')+
 '<text x="74" y="126" text-anchor="middle" fill="#173b2c" font-family="sans-serif" font-size="15">'+(i===0?'脂身つき':'赤身だけ')+'</text></g>').join('');
 return sectionDrawing(slug+'-section',t,'外側の脂身が付いた切り口と、外側の脂身を除いた赤身の切り口。','白っぽい外側の脂身が付いたものと、外側の脂身を取りのぞいたもの。'+(slug==='beef-round'?' 細い線は肉の<繊維:せんい>の向きの目安です。':'')+' 脂のつき方は一切れずつちがいます。',panels);
}
function rawNut(slug,t) {
 const d=source[slug];
 return '<table class="nutrition"><caption>'+t('料理ではなく、'+d.label+'（食品番号 '+d.id+'）の食べられる部分100 gあたり')+'</caption><thead><tr><th scope="col">'+t('成分')+'</th><th scope="col">'+t('量')+'</th></tr></thead><tbody>'+
 ['たんぱく質','脂質','鉄'].map((n,i)=>'<tr><th scope="row">'+t(n)+'</th><td>'+d.values[i]+'</td></tr>').join('')+'</tbody></table>'+
 '<p>'+t('文部科学省「日本食品標準成分表（八訂）増補2023年」の分類。脂身つきの肉や焼いたあとの肉、料理1人分の値とはちがいます。')+'</p>';
}
const ribDrawing=t=>sectionDrawing('rib-cross',t,'色のついた肉が、白いあばら骨のまわりに付く断面の例。','赤い部分は肉、白い長い部分は骨の目安。切る場所で、どちらの厚みにも差があります。',
 '<path d="M43 106C56 54 110 34 200 32c56-1 92 14 112 43-16 37-52 52-105 58-65 7-129-6-164-27Z" fill="#c88971" stroke="#5e392e" stroke-width="3"/>'+
 '<path d="M49 93c63-21 141-29 216-19l23 10-26 9c-76-10-156-2-212 16Z" fill="#fff5d4" stroke="#5e392e" stroke-width="3"/>'+
 '<path d="M83 122c61 10 119 7 162-5" fill="none" stroke="#fbe4ad" stroke-width="7"/>');
const shankDrawing=t=>sectionDrawing('shank-stages',t,'煮る前は白い筋が見え、煮込んだあとは串を通してやわらかさを確かめます。','左は生の切り口に見える筋、右は煮た肉の確かめ方の例。ここに示すのは実際に試作した写真ではありません。',
 '<path d="M23 90c0-36 28-62 62-62s62 26 62 62-26 54-62 54-62-17-62-54Z" fill="#be7562" stroke="#4e3227" stroke-width="3"/>'+
 '<path d="M38 63c24 2 65 28 94 44M93 39c-17 22-27 64-27 96" fill="none" stroke="#fff1cd" stroke-width="6"/>'+
 '<path d="M213 90c0-36 28-62 62-62s62 26 62 62-26 54-62 54-62-17-62-54Z" fill="#94705d" stroke="#4e3227" stroke-width="3"/>'+
 '<path d="M270 45l-31 48m63-37-32 58" stroke="#fff1cd" stroke-width="3" fill="none"/><path d="M347 38l-67 43" stroke="#173b2c" stroke-width="4"/>');
const grainDrawing=t=>sectionDrawing('grain-directions',t,'横に入った肉の繊維を、横に切る場合と縦にまたいで切る場合の比較。','細い横線は肉の線、緑の太線は包丁を入れる向き。線をまたぐように切ると、一本の線が短く分かれます。',
 [16,190].map((x,i)=>'<g transform="translate('+x+' 16)"><rect width="150" height="100" rx="20" fill="#bd715e" stroke="#542c24" stroke-width="3"/>'+
 '<path d="M20 24h110M20 36h110M20 50h110M20 64h110M20 77h110" stroke="#fff7e7" stroke-width="2" fill="none"/>'+
 '<path d="'+(i?'M75 6v86':'M14 51h122')+'" stroke="#173b2c" stroke-width="6" fill="none"/>'+
 '<text x="75" y="125" fill="#173b2c" text-anchor="middle" font-family="sans-serif" font-size="15">'+(i?'線をまたぐ':'線にそわせる')+'</text></g>').join(''));

export function priorityFoodMarkup({r,typeset:t}) {
 const h=s=>'<h2>'+t(s)+'</h2>',p=s=>'<p>'+t(s)+'</p>';
 const list=(items,tag='ul')=>'<'+tag+'>'+items.map(s=>'<li>'+t(s)+'</li>').join('')+'</'+tag+'>';
 const slug=r.slug;
 if(slug==='grain')return h('肉の線と、包丁の向き')+p('肉の中の細い線は、肉をつくる細い<繊維:せんい>が集まったものです。線をまたいで切ると、一本ずつが短くなり、かみ切りやすさが変わることがあります。')+grainDrawing(t)+
 h('同じ一切れから、厚みをそろえて比べる')+list([
  '用意するもの：中心まで加熱した線が見える肉を、約60 g。大人が食べられる状態まで加熱し、少し冷ましてから、食べるもの用の清潔な包丁とまな板に置きます。',
  '大人が肉をとなり合う二つのかたまりに分けます。およそ5 mmの同じ厚みで、片方は線にそって1枚、もう片方は線をまたぐように1枚切ります。',
  'たれをつけるなら同じ量にし、二枚の温かさをそろえます。食べ比べるなら、むりなく食べられる大きさにしてから。見るだけでも比べられます。'
 ],'ol')+
 '<details><summary>'+t('気づいたことを残すなら')+'</summary>'+
 p('書き方の例（空欄）：線にそった方「＿＿＿」／線をまたいだ方「＿＿＿」。かみ切りやすさや口に残る長い線の有無を、自分のことばで。差がわからなくても、そのままでかまいません。')+'</details>';
 if(!descriptor[slug])return '';
 const start=bodyAtlas(slug,t);
 if(slug==='pork-round'||slug==='beef-round') {
  return start+h('赤身と、外側の白い部分を見る')+roundDrawing(slug,t)+h('うす切りとかたまり、どちらにする？')+
  list(slug==='pork-round'?[
   'うす切り：炒めものや、さっと火を通す料理に。広げやすい厚さのものをえらびます。',
   'かたまり：焼き豚などに。形と厚みがそろったものをえらび、厚いところの中心で加熱を確かめます。',
   '同じ「もも」でも、外側に脂身が残っているものと、赤身だけのものがあります。売り場の表示も確かめます。'
  ]:[
   'うす切り：すき煮や炒めものに。肉に細い線が見えたら、線が短く切られているかも確かめられます。',
   'かたまり：ローストビーフなどに。厚みがそろったものをえらび、切り分けるときは細い線をまたぐ向きが目安です。',
   '同じ「もも」でも脂身のつき方は同じではありません。表の数字は外側の脂身を除いた標準食品です。'
  ])+h('成分表の数字を読む')+rawNut(slug,t);
 }
 if(slug==='ribs')return start+h('骨はここ。肉はそのまわり')+ribDrawing(t)+
 list(['長く白いところはあばら骨。赤い肉は骨のまわりについています。','あばら骨にそって分けたものは、長い骨の形が見えます。骨ごと短く切ったものでは、切った面に骨の断面が見えます。','パックの表示が500 gなら、骨もふくめて500 gです。肉だけで500 g食べられるという意味ではありません。食べられる量は骨と肉のつき方で変わります。'])+
 h('切り方を見て、焼き方を考える')+p('同じパックでも肉の厚さがちがうと、火の通り方もちがいます。焼くときは様子を見ながら、いちばん厚い肉の中心をはかります。温度計の先を骨にあてず、中心75℃で1分間以上を家庭での目安にします。');
 return start+h('生の切り口と、煮たあとの目安')+shankDrawing(t)+
 list(['生のとき：赤い部分の間に白い<筋:すじ>が見えることがあります。牛が立ったり歩いたりするときに使う脚の部位です。','煮ているとき：煮汁が静かに泡立つくらいの火にします。肉が煮汁から出てしまうほど減ったら、少し湯を足します。','仕上げ：加熱を確かめたあと、厚いところに串を刺してみます。かたさが残っていれば、煮汁と火を見ながら煮続けます。時間だけでやわらかさを決めません。'])+
 p('焼き色をつけるのは香りのため、煮つづけるのは <筋:すじ>のある肉をやわらかくするため。シチューの二つの工程には、それぞれ役目があります。');
}

const next={
 'pork-round':[['cuts.html#pig/round','図鑑で、ぶたのももの場所を見る','ももと、となりのそとももの位置を見比べられます。'],['grain','肉の線を見て、包丁の向きを考える','うす切りの食べやすさを、肉の中の線から考えられます。']],
 ribs:[['buy-bone','骨付き肉を、何グラム買う？','骨もふくめた表示から、人数に合う買い方を考えます。'],['bbq-ribs','スペアリブは、たれを仕上げに','骨をよけて温度をはかり、たれをぬる順番がわかります。']],
 'beef-shank':[['cuts.html#cow/shank','図鑑で、前脚と後ろ脚のすねを見る','すねが一か所ではないことを丸印で確かめられます。'],['stew','牛すねでシチューを作る','串が通るか、煮汁が減りすぎていないかを確かめながら作れます。']],
 'beef-round':[['plate-19','牛もものステーキに、からしを添えて','もも肉を選んで、肉の厚みに合わせて加熱する手順が読めます。'],['grain','切る向きで、食感はどう変わる？','同じ肉・同じ厚みで、包丁の向きだけを変える比べ方です。']],
 grain:[['beef-round','牛ももの切り口で、線を見つける','赤身と脂身の区別を確認しながら、線の向きを見られます。'],['heat','先に、中心まで火を通す','食べ比べをするときも、先に安全な加熱を確かめます。']]
};
export function priorityFoodNext({r,typeset:t,pageLink}) {
 if(!Object.hasOwn(next,r.slug))return null;
 return '<aside class="representative-next" aria-labelledby="representative-next-title"><h2 id="representative-next-title">'+t('この続きが気になったら')+'</h2>'+
 next[r.slug].map(([url,label,reason])=>'<p>'+(url.startsWith('cuts.html#')?'<a href="'+cutUrl(...url.split('#')[1].split('/'))+'">'+t(label)+'</a>':pageLink(url,label))+'<br>'+t(reason)+'</p>').join('')+'</aside>';
}
