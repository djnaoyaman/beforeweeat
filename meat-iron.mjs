import fs from 'node:fs';

export const meatIronData = JSON.parse(fs.readFileSync(new URL('./meat-iron-data.json', import.meta.url), 'utf8'));

// A numeric zero is valid; an absent, trace or uncalculated value is not zero.
export function validateMeatIronData(data) {
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const url = value => typeof value === 'string' && /^https:\/\//.test(value);
  check(data.schemaVersion === 1, 'Unsupported iron data version');
  check(data.calculation?.scope === 'raw-meat-only', 'Iron must refer to raw meat only');
  check(data.calculation?.decimalPlaces === 1 && data.calculation?.rounding === 'half-up', 'Unsupported rounding');
  for (const key of ['title', 'checkedDate', 'errataDate', 'fooddbUpdatedDate']) {
    check(Boolean(data.dataset?.[key]), 'Missing dataset ' + key);
  }
  check(url(data.dataset?.publicationUrl) && url(data.dataset?.dataUrl) && url(data.dataset?.errataUrl), 'Missing official sources');
  for (const [code, food] of Object.entries(data.foods || {})) {
    check(code === food.foodCode && /^\d{5}$/.test(code), 'Invalid food code ' + code);
    check(food.state === 'raw' && food.basisGrams === 100, code + ': expected raw edible 100 g');
    check(food.ironValueStatus === 'numeric' && typeof food.ironMgPer100g === 'number' &&
      Number.isFinite(food.ironMgPer100g) && food.ironMgPer100g >= 0 &&
      /^\d+(?:\.\d+)?$/.test(food.ironSourceText) && Number(food.ironSourceText) === food.ironMgPer100g,
    code + ': missing, trace or invalid iron value');
    check(url(food.sourceUrl) && food.sourceCells?.iron && food.verifiedAgainstFooddb === true, code + ': missing provenance');
  }
  for (const [slug, recipe] of Object.entries(data.recipes || {})) {
    check(Boolean(data.foods?.[recipe.foodCode]), slug + ': unknown food code');
    check(Array.isArray(recipe.servings) && recipe.servings.length > 0 &&
      recipe.servings.every(value => Number.isSafeInteger(value) && value > 0) &&
      new Set(recipe.servings).size === recipe.servings.length, slug + ': invalid serving denominators');
    const weight = recipe.weight || {};
    check(typeof weight.grams === 'number' && Number.isFinite(weight.grams) && weight.grams > 0, slug + ': invalid meat weight');
    check(['edible', 'gross'].includes(weight.basis), slug + ': unknown weight basis');
    check(Number.isInteger(weight.refusePercent) && weight.refusePercent >= 0 && weight.refusePercent < 100,
      slug + ': invalid refuse rate');
    check(weight.basis !== 'edible' || weight.refusePercent === 0, slug + ': edible weight cannot be reduced twice');
    check(weight.basis !== 'gross' || (url(weight.sourceUrl) && weight.refuseSourceType), slug + ': gross weight needs a refuse source');
    check(weight.refuseSourceType !== 'mext-official-refuse-rate' ||
      weight.refusePercent === data.foods?.[recipe.foodCode]?.refusePercent,
    slug + ': official refuse rate differs from the selected food');
    check(['matching-cut', 'unspecified-cut-reference', 'proxy-cut'].includes(recipe.mapping?.kind) &&
      recipe.mapping?.label && recipe.mapping?.note, slug + ': missing food mapping conditions');
    check(Array.isArray(recipe.assumptions) &&
      recipe.assumptions.every(note => typeof note === 'string' && note.length > 0), slug + ': missing assumptions');
    check(Array.isArray(recipe.references) && recipe.references.every(ref => ref.label && ref.kind && url(ref.url)), slug + ': invalid reference');
  }
  return errors;
}

const validationErrors = validateMeatIronData(meatIronData);
if (validationErrors.length) throw new Error(validationErrors.join('\n'));

function fraction(value) {
  const [whole, decimals = ''] = String(value).split('.');
  return {n: BigInt(whole + decimals), d: 10n ** BigInt(decimals.length)};
}

// Integer fractions prevent binary floating-point rounding at values such as 0.65 mg.
function oneDecimal(n, d) {
  const tenths = (2n * n * 10n + d) / (2n * d);
  return (tenths / 10n).toString() + '.' + (tenths % 10n).toString();
}

export function calculateMeatIron(slug, data = meatIronData) {
  const recipe = data.recipes[slug];
  if (!recipe) return null;
  const food = data.foods[recipe.foodCode];
  const f = fraction(food.ironSourceText), w = fraction(recipe.weight.grams);
  const ediblePercent = recipe.weight.basis === 'gross' ? 100 - recipe.weight.refusePercent : 100;
  const numerator = f.n * w.n * BigInt(ediblePercent);
  const denominator = f.d * w.d * 10000n;
  return {
    slug,
    foodCode: recipe.foodCode,
    edibleGrams: recipe.weight.grams * ediblePercent / 100,
    totalIronMg: Number(numerator) / Number(denominator),
    portions: recipe.servings.map(servings => {
      const d = denominator * BigInt(servings);
      return {servings, ironMg: Number(numerator) / Number(d), displayMg: oneDecimal(numerator, d),
        numerator: numerator.toString(), denominator: d.toString()};
    })
  };
}

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const grams = value => String(Math.round(value * 100) / 100);

export function meatIronMarkup({slug, typeset: baseTypeset}) {
  const readings = {鉄:'てつ',材料:'ざいりょう',計算:'けいさん',目安:'めやす',調理:'ちょうり',調味料:'ちょうみりょう',推計:'すいけい',参考:'さんこう',人数:'にんずう',均等:'きんとう',種類:'しゅるい',確認:'かくにん',小数:'しょうすう',四捨五入:'ししゃごにゅう',吸収:'きゅうしゅう',成分表:'せいぶんひょう',成分値:'せいぶんち',文部科学省:'もんぶかがくしょう',標準:'ひょうじゅん',反映:'はんえい'};
  const known = new RegExp(Object.keys(readings).sort((a,b) => b.length-a.length).join('|'), 'g');
  const typeset = value => baseTypeset(value.split(/(<[^:]+:[^>]+>)/g).map(part =>
    /^<[^:]+:[^>]+>$/.test(part) ? part : part.replace(known, word => '<' + word + ':' + readings[word] + '>')).join(''));
  const recipe = meatIronData.recipes[slug];
  if (!recipe) return '';
  const result = calculateMeatIron(slug);
  const food = meatIronData.foods[recipe.foodCode], source = meatIronData.dataset;
  const p = value => '<p>' + typeset(value) + '</p>';
  const weight = recipe.weight;
  const rawWeight = weight.basis === 'gross'
    ? '骨などを含む' + grams(weight.grams) + 'gから、食べない部分' + weight.refusePercent + '％を除いた' + grams(result.edibleGrams) + 'g'
    : '食べる部分' + grams(result.edibleGrams) + 'g';
  const portions = result.portions.map(portion => {
    const below = portion.ironMg > 0 && portion.displayMg === '0.0';
    const amount = below ? '0.1<span class="meat-iron-unit">mg未満</span>'
      : '<span class="meat-iron-approx">約</span> ' + portion.displayMg + ' <span class="meat-iron-unit">mg</span>';
    return '<div class="meat-iron-serving" data-servings="' + portion.servings + '"><p class="meat-iron-serving-label">'
      + typeset(portion.servings + '人で分けたときの1人分') + '</p><strong class="meat-iron-value" data-iron-mg="'
      + (below ? 'less-than-0.1' : portion.displayMg) + '">' + amount + '</strong><p class="meat-iron-weight">'
      + typeset('加熱前のお肉、約' + Math.round(result.edibleGrams / portion.servings) + 'g分') + '</p></div>';
  }).join('');
  const assumptions = [...new Set([weight.note, recipe.mapping.note, ...recipe.assumptions].filter(Boolean))];
  const referenceLinks = recipe.references.filter(ref => ref.url !== food.sourceUrl).map(ref => '<li><a href="' + escape(ref.url) + '">' + typeset(ref.label) + '</a></li>').join('');
  const formula = '肉の鉄（100gあたり）' + food.ironSourceText + 'mg × 食べる部分' + grams(result.edibleGrams) + 'g ÷ 100 ÷ 分ける人数';
  return '<section class="meat-iron" id="meat-iron" aria-labelledby="meat-iron-title" data-meat-iron="' + escape(slug)
    + '" data-iron-scope="raw-meat-only" data-food-code="' + food.foodCode + '" data-edible-grams="' + grams(result.edibleGrams) + '">'
    + '<p class="meat-iron-kicker">' + typeset('材料のお肉から') + '</p><h2 id="meat-iron-title">' + typeset('1人分の<鉄:てつ>の<目安:めやす>') + '</h2>'
    + '<p class="meat-iron-intro">' + typeset('材料のお肉を、同じ量ずつ分けたときの目安です。') + '</p>'
    + '<div class="meat-iron-values">' + portions + '</div>'
    + '<p class="meat-iron-assumption">' + typeset('計算に使ったお肉　' + recipe.mapping.label + (recipe.mapping.kind === 'unspecified-cut-reference' ? 'を使った場合の目安' : recipe.mapping.kind === 'proxy-cut' ? 'を参考にした値' : '')) + '</p>'
    + (recipe.mapping.kind === 'proxy-cut' ? '<p class="meat-iron-proxy">' + typeset(recipe.mapping.note) + '</p>' : '')
    + '<p class="meat-iron-scope">' + typeset('加熱前のお肉だけを基にした<推計:すいけい>です。野菜や衣、調味料などは含みません。調理による変化も計算していません。') + '</p>'
    + '<details class="meat-iron-details"><summary>' + typeset('肉の量と計算のもとを見る') + '</summary><div class="meat-iron-detail-body">'
    + '<dl><div><dt>' + typeset('材料の肉') + '</dt><dd>' + typeset(recipe.meatLabel + '／加熱前の' + rawWeight) + '</dd></div>'
    + '<div><dt>' + typeset('分ける人数') + '</dt><dd>' + typeset(recipe.servings.join('人、または') + '人。均等に分けて計算します。') + '</dd></div>'
    + '<div><dt>' + typeset('成分表の食品') + '</dt><dd>' + typeset(food.fooddbFullName) + '<br>' + typeset('食品番号 ' + food.foodCode + '／食べる部分100gあたりの鉄 ' + food.ironSourceText + 'mg') + '</dd></div></dl>'
    + '<h3>' + typeset('計算の条件') + '</h3><ul>' + assumptions.map(note => '<li>' + typeset(note) + '</li>').join('') + '</ul>'
    + '<p class="meat-iron-formula">' + typeset(formula) + '</p>'
    + p('表示は小数第2位を四捨五入しています。肉の種類や切り方、大きさによって変わる、おおよその値です。完成した料理や、体に吸収される鉄の量を測った値ではありません。')
    + '<h3>' + typeset('出典') + '</h3>' + p(source.title + 'から引用。' + source.errataDate + 'の訂正を反映した成分値を使っています。食品成分データベースの更新日 ' + source.fooddbUpdatedDate + '。確認日 ' + source.checkedDate + '。')
    + '<ul><li><a href="' + escape(food.sourceUrl) + '">' + typeset('文部科学省の食品番号 ' + food.foodCode + ' を見る') + '</a></li>'
    + '<li><a href="' + escape(source.publicationUrl) + '">' + typeset('日本食品標準成分表と訂正資料') + '</a></li>' + referenceLinks + '</ul>'
    + '</div></details></section>';
}
