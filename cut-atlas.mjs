// Reference points are percentages of the existing, unmodified animal artwork.
// They locate an area, not a butcher's cutting boundary. Inner cuts are marked
// with a dashed ring so the outer silhouette is not mistaken for a dissection.
// Anatomy references, checked 2026-11-23:
// https://www.maff.go.jp/j/pr/aff/2009/spe1_02.html
// https://www.maff.go.jp/j/pr/aff/2009/pdf/aff2009_02_poster06.pdf
// A recipeNote marks a cooking reference whose ingredients do not name this
// exact cut. Keep it visible beside the link instead of promising a cut match.
export const cutAtlas = {
  cow: {
    width: 844, height: 760, first: 'shank',
    names: ['ネック', 'かた', 'かたロース', 'リブロース', 'サーロイン', 'ヒレ', 'ばら', 'もも', 'そともも', 'らんぷ', 'すね', 'タン'],
    parts: [
      { id: 'neck', points: [[25, 34]], note: '頭と肩をつなぐ、首のあたり。' },
      { id: 'shoulder', points: [[35, 43]], note: '前脚の上、肩のあたり。', recipes: ['plate-29'], recipeNote: 'レシピの材料は「牛薄切り肉」です。部位は指定されていません。' },
      { id: 'chuck', points: [[35, 29]], note: '首に近い、背中のあたり。', recipes: ['plate-27'], recipeNote: 'レシピの材料は「牛薄切り肉」です。部位は指定されていません。' },
      { id: 'rib-loin', points: [[51, 28]], note: '肩のうしろから続く、背中のあたり。', recipes: ['plate-26'], recipeNote: 'レシピの材料は「牛ステーキ肉」です。部位は指定されていません。' },
      { id: 'sirloin', points: [[66, 28]], note: 'リブロースより、お尻に近い背中。', recipes: ['plate-28'], recipeNote: 'レシピの材料は「牛ステーキ肉」です。部位は指定されていません。' },
      { id: 'tenderloin', points: [[67, 36]], inner: true, note: '背骨の内側にある肉。外からは見えません。', recipes: ['plate-26'], recipeNote: 'レシピの材料は「牛ステーキ肉」です。部位は指定されていません。' },
      { id: 'belly', points: [[53, 54]], note: '胸からおなかにかけての、下のほう。', recipes: ['plate-21'], recipeNote: 'レシピの材料は「牛切り落とし」です。部位は指定されていません。' },
      { id: 'round', points: [[79, 53]], inner: true, note: '後ろ脚の上のほう。内側などを含みます。', recipes: ['plate-18', 'plate-19'] },
      { id: 'outside-round', points: [[86, 43]], note: '後ろ脚の上のほう、その外側。', recipes: ['plate-20'], recipeNote: 'レシピの材料は「牛もも焼き肉用」です。そとももを指定したレシピではありません。' },
      { id: 'rump', points: [[79, 29]], note: '腰からお尻へ続くあたり。', recipes: ['plate-28'], recipeNote: 'レシピの材料は「牛ステーキ肉」です。部位は指定されていません。' },
      { id: 'shank', points: [[36, 73], [84, 73]], note: '前脚にも後ろ脚にもある、脚の下のほう。', recipes: ['stew', 'plate-30'] },
      { id: 'tongue', points: [[8, 38]], inner: true, note: '口の中にある舌。外から見えるほおの肉とは別です。' }
    ]
  },
  pig: {
    width: 1150, height: 575, first: 'loin',
    names: ['かた', 'かたロース', 'ロース', 'ヒレ', 'ばら', 'もも', 'そともも', 'スペアリブ'],
    parts: [
      { id: 'shoulder', points: [[35, 39]], note: '肩から前脚の上のあたり。', recipes: ['plate-23'], recipeNote: 'レシピの材料は「豚こま肉」です。部位は指定されていません。' },
      { id: 'chuck', points: [[35, 19]], note: '首に近い、肩から背中へ続くあたり。', recipes: ['plate-15'] },
      { id: 'loin', points: [[58, 18]], note: '肩よりうしろに続く、背中の肉。', recipes: ['pork-cutlet', 'plate-13'] },
      { id: 'tenderloin', points: [[64, 34]], inner: true, note: '腰のあたり、背骨の内側。外からは見えません。', recipes: ['plate-24'] },
      { id: 'belly', points: [[57, 57]], note: 'おなか側の肉。脂と赤身が重なっています。', recipes: ['plate-11', 'plate-12'] },
      { id: 'round', points: [[79, 49]], inner: true, note: '後ろ脚の上のほう、その内側など。', recipes: ['plate-23'], recipeNote: 'レシピの材料は「豚こま肉」です。部位は指定されていません。' },
      { id: 'outside-round', points: [[84, 30]], note: '後ろ脚の上のほう、その外側。', recipes: ['plate-23'], recipeNote: 'レシピの材料は「豚こま肉」です。部位は指定されていません。' },
      { id: 'spare-ribs', points: [[48, 44]], note: 'あばら骨のまわり。ばらのうち、骨が付いた部分。', recipes: ['bbq-ribs'] }
    ]
  },
  hen: {
    width: 684, height: 760, first: 'thigh',
    names: ['むね', 'もも', 'ささみ', '手羽元', '手羽中', '手羽先', 'せせり', 'ぼんじり', '砂肝', 'レバー'],
    parts: [
      { id: 'breast', points: [[29, 48]], note: '体の前のほうにある、胸の肉。', recipes: ['plate-08'] },
      { id: 'thigh', points: [[58, 70]], note: '脚のつけ根から上のほう。羽毛の下にあります。', recipes: ['crispy-chicken', 'plate-10'] },
      { id: 'tenderloin', points: [[34, 55]], inner: true, note: '胸の肉のさらに内側。胸の骨に沿う肉です。', recipes: ['plate-09'] },
      { id: 'wing-root', points: [[43, 43]], note: '体につながる、つばさの根元。この絵ではつばさをたたんでいます。', recipes: ['plate-06'] },
      { id: 'wing-middle', points: [[57, 49]], note: '手羽元と手羽先の間。この絵ではつばさをたたんでいます。' },
      { id: 'wing-tip', points: [[72, 57]], note: 'つばさの先のほう。この絵ではつばさをたたんでいます。', recipes: ['plate-02', 'plate-07'] },
      { id: 'neck', points: [[26, 31]], note: '頭と体をつなぐ、首の肉。' },
      { id: 'tail', points: [[79, 43]], note: '尾の羽が生える、そのつけ根のあたり。' },
      { id: 'gizzard', points: [[57, 61]], inner: true, note: '体の中にある胃の一部。食べたものをすりつぶします。', recipes: ['plate-01', 'plate-05'] },
      { id: 'liver', points: [[41, 55]], inner: true, note: '体の中にある肝臓。胸の肉より内側にあります。', recipes: ['plate-04'] }
    ]
  }
};

export const cutUrl = (animal, part) => 'cuts.html#' + animal + '/' + part;
export const cutReadings = { 手羽元: 'てばもと', 手羽中: 'てばなか', 手羽先: 'てばさき', 砂肝: 'すなぎも' };
export const cutLabel = name => cutReadings[name] ? '<' + name + ':' + cutReadings[name] + '>' : name;

export function atlasForAnimal(key, animal) {
  const atlas = cutAtlas[key];
  if (!atlas || atlas.parts.length !== animal.cuts.length || atlas.names.some((name, index) => name !== animal.cuts[index][0])) {
    throw new Error('Cut atlas does not match the published cuts: ' + key);
  }
  return atlas;
}
