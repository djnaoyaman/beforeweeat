(() => {
  const switcher = document.querySelector('.species');
  const data = document.getElementById('cut-atlas-data');
  if (!switcher || !data) return;
  const atlas = JSON.parse(data.textContent);
  const buttons = [...switcher.querySelectorAll('[data-focus]')];
  const panels = [...document.querySelectorAll('.specimen[data-animal]')];
  const status = document.getElementById('atlas-status');
  const state = new Map(panels.map(panel => {
    const key = panel.dataset.animal;
    return [key, {
      panel,
      select: panel.querySelector('[data-cut-select]'),
      parts: atlas[key],
      current: panel.dataset.firstCut
    }];
  }));
  let activeAnimal = 'cow';

  function permalink(key, id) {
    const url = new URL(window.location.href);
    url.hash = key + '/' + id;
    return url.href;
  }

  function showSelection(key, id, { history = false, announce = false } = {}) {
    const selected = state.get(key);
    if (!selected) return;
    const part = selected.parts.find(part => part.id === id) || selected.parts.find(part => part.id === selected.current);
    if (!part) return;
    const { panel, select } = selected;
    selected.current = part.id;
    activeAnimal = key;
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.focus === key));
    }
    for (const panel of panels) panel.hidden = panel.dataset.animal !== key;
    select.value = part.id;
    for (const copy of panel.querySelectorAll('[data-cut]')) copy.hidden = copy.dataset.cut !== part.id;
    for (const marker of panel.querySelectorAll('[data-cut-marker]')) {
      marker.toggleAttribute('hidden', marker.dataset.cutMarker !== part.id);
    }
    const title = panel.dataset.animalName + 'の' + part.name;
    const mapName = panel.querySelector('[data-map-name]');
    mapName.textContent = panel.dataset.animalName + 'の';
    if (part.reading) {
      const ruby = document.createElement('ruby');
      const reading = document.createElement('rt');
      ruby.textContent = part.name;
      reading.textContent = part.reading;
      ruby.append(reading);
      mapName.append(ruby);
    } else mapName.append(part.name);
    panel.querySelector('[data-map-depth]').textContent = part.inner ? '体の奥・内側の目安' : '場所の目安';
    panel.querySelector('[data-map-note]').textContent = part.note;
    panel.querySelector('svg title').textContent = title + '。' + part.note;
    const url = permalink(key, part.id);
    panel.querySelector('[data-cut-permalink]').href = url;
    const shareUrl = panel.querySelector('[data-cut-share-url]');
    shareUrl.value = url;
    shareUrl.hidden = true;
    panel.querySelector('[data-cut-share-status]').textContent = '';
    if (history && window.location.hash !== '#' + key + '/' + part.id) {
      window.history.pushState(null, '', url);
    }
    if (announce) status.textContent = title + '。' + part.note;
  }

  function selectionFromUrl() {
    let hash;
    try { hash = decodeURIComponent(window.location.hash.slice(1)); }
    catch { hash = ''; }
    // Keep the published #cow/#pig/#hen and #plate-cow/#plate-pig/#plate-hen
    // entrances. Full links add a stable cut id, for example #cow/shank.
    const [animal, id] = hash.replace(/^plate-/, '').split('/');
    const key = state.has(animal) ? animal : 'cow';
    const selection = state.get(key);
    return { key, id: selection.parts.some(part => part.id === id) ? id : selection.panel.dataset.firstCut };
  }

  function restoreFromUrl() {
    const { key, id } = selectionFromUrl();
    showSelection(key, id);
  }

  for (const [key, { panel, select }] of state) {
    select.addEventListener('change', () => showSelection(key, select.value, { history: true, announce: true }));
    panel.querySelector('[data-cut-picker]').hidden = false;
    select.hidden = false;
    panel.querySelector('.cut-share').hidden = false;
    panel.querySelector('[data-copy-cut]').addEventListener('click', async () => {
      const shareUrl = panel.querySelector('[data-cut-share-url]');
      const message = panel.querySelector('[data-cut-share-status]');
      const url = permalink(key, state.get(key).current);
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(url);
        message.textContent = 'この部位のリンクをコピーしました。';
      } catch {
        shareUrl.value = url;
        shareUrl.hidden = false;
        shareUrl.focus();
        shareUrl.select();
        message.textContent = 'このURLを選んでコピーできます。';
      }
    });
    // Each panel has a useful initial selection before another animal is shown.
    for (const copy of panel.querySelectorAll('[data-cut]')) {
      copy.hidden = copy.dataset.cut !== panel.dataset.firstCut;
    }
  }
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const key = button.dataset.focus;
      if (key === activeAnimal) return;
      showSelection(key, state.get(key).current, { history: true, announce: true });
    });
  }
  window.addEventListener('hashchange', restoreFromUrl);
  window.addEventListener('popstate', restoreFromUrl);
  window.addEventListener('pageshow', restoreFromUrl);
  restoreFromUrl();
  switcher.hidden = false;
})();
