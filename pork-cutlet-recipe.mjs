// The detailed article and the photo-led short recipe describe the same dish.
// Keep ingredient quantities and cooking conditions together so they cannot drift.
const conditions = Object.freeze({
  servings: 2,
  pieces: 2,
  gramsPerPiece: 100,
  thicknessCm: 1,
  oilTemperatureC: 170,
  centerTemperatureC: 75,
  centerHoldMinutes: 1,
  drainingMinutes: 2
});
const ingredients = Object.freeze([
  `豚ロースとんかつ用 ${conditions.pieces}枚（各${conditions.gramsPerPiece}g・厚さ約${conditions.thicknessCm}cm）`,
  '塩 2つまみ', 'こしょう 少々', '小麦粉 大さじ2', '卵 1個', 'パン粉 1カップ',
  '揚げ油 適量', 'キャベツ 100g', 'とんかつソース 好みの量'
]);
const temperatureCheck = `中心部${conditions.centerTemperatureC}℃で${conditions.centerHoldMinutes}分間以上の加熱`;

export const porkCutletRecipe = Object.freeze({
  conditions,
  servings: conditions.servings,
  meatGrams: conditions.pieces * conditions.gramsPerPiece,
  ingredients,
  time: '約30分。揚げ時間は肉の厚さや油の量で変わります。',
  tools: '揚げ物に使える鍋、油用温度計、食品用の中心温度計、バット3枚、網、包丁、まな板、生肉用と盛りつけ用の箸。油の量は鍋の取扱説明に従います。',
  detailedSteps: Object.freeze([
    `キャベツを細く切り、皿に用意する。肉の赤身と脂身の境に包丁の先で数か所切り込みを入れる。厚さ約${conditions.thicknessCm}cmにそろえ、両面に塩とこしょうを振る。`,
    '小麦粉、溶いた卵、パン粉をそれぞれバットに入れる。肉に小麦粉を薄くつけ、卵、パン粉の順にまとわせる。パン粉を手のひらで軽く押さえる。',
    `大人が鍋の油を${conditions.oilTemperatureC}℃に温める。肉を静かに入れ、途中で一度返して両面を揚げる。約5〜6分から様子を見て、衣が先に濃く色づくときは火を弱める。`,
    `一枚ずつ、厚い部分の中心を温度計で確かめる。${temperatureCheck}を確認してから、網に取り、${conditions.drainingMinutes}分ほど油を切る。生肉に使った器具と分けた包丁・まな板で切り、キャベツとソースを添える。`
  ]),
  conciseSteps: Object.freeze([
    `大人と一緒にキャベツを細く切る。肉の赤身と脂身の境に切り込みを入れ、厚さ約${conditions.thicknessCm}cmにそろえて塩とこしょうを振る。`,
    '肉に小麦粉、溶いた卵、パン粉の順で衣をつけ、手のひらで軽く押さえる。油の量は鍋の取扱説明に従い、油用と食品用の温度計を用意する。',
    `大人が${conditions.oilTemperatureC}℃の油で途中で返しながら揚げる。一枚ずつ厚い部分を温度計ではかり、${temperatureCheck}を確認する。網で${conditions.drainingMinutes}分ほど油を切り、生肉に使った器具と分けて切り分け、キャベツとソースを添える。`
  ])
});
