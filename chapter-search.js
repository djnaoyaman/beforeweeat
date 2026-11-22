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
    ...item, key: normalizeChapterSearch([item.title, item.label, item.teaser, item.text].join(' '))
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
      if (item.art) {
        const image = document.createElement('img');
        image.src = item.art;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        link.append(image);
      }
      const copy = document.createElement('span');
      copy.className = 'journal-search-copy';
      const title = document.createElement('strong');
      title.textContent = item.title;
      const label = document.createElement('small');
      label.textContent = item.label;
      copy.append(label, title);
      if (item.teaser) {
        const teaser = document.createElement('span');
        teaser.className = 'journal-search-deck';
        teaser.textContent = item.teaser;
        copy.append(teaser);
      }
      link.append(copy);
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
