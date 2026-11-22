function normalizeChapterSearch(value) {
  return value.normalize('NFKC').toLowerCase()
    .replace(/[ァ-ヶ]/g, character => String.fromCharCode(character.charCodeAt(0) - 96))
    .replace(/にわとり/g, '鶏').replace(/ぶた/g, '豚').replace(/うし/g, '牛');
}

const catalogQuery = document.getElementById('catalog-query');
if (catalogQuery) {
  const directory = document.getElementById('directory');
  const results = document.querySelector('.search-results');
  const list = results.querySelector('ul');
  const count = document.getElementById('count');
  const items = JSON.parse(document.getElementById('catalog-data').textContent).map(item => ({
    ...item, key: normalizeChapterSearch([item.title, item.label, item.text].join(' '))
  }));

  function updateCatalog() {
    const query = normalizeChapterSearch(catalogQuery.value.trim());
    list.replaceChildren();
    directory.hidden = Boolean(query);
    results.hidden = !query;
    if (!query) {
      count.textContent = '';
      return;
    }
    const words = query.split(/\s+/);
    const found = items.filter(item => words.every(word => item.key.includes(word)));
    count.textContent = found.length ? found.length + '件見つかりました' : '見つかりませんでした。別のことばで探せます。';
    for (const item of found) {
      const link = document.createElement('a');
      link.href = item.url;
      link.textContent = item.title;
      const label = document.createElement('small');
      label.textContent = item.label;
      link.append(label);
      const row = document.createElement('li');
      row.append(link);
      list.append(row);
    }
  }
  catalogQuery.hidden = false;
  catalogQuery.addEventListener('input', updateCatalog);
  window.addEventListener('pageshow', updateCatalog);
  updateCatalog();
}
