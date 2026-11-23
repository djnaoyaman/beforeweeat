(() => {
  'use strict';
  const data = document.getElementById('novel-navigation');
  if (!data) return;
  let scenes;
  try { scenes = JSON.parse(data.textContent); } catch (_) { return; }
  const byId = new Map(scenes.map(scene => [scene.id, scene]));
  const storageKey = 'bwe-ninzuubun-reading-v1';
  const fontKey = 'bwe-ninzuubun-font-v1';
  const currentId = document.body.dataset.scene;
  const prose = document.getElementById('prose');
  const end = document.getElementById('scene-end');
  const progressBar = document.getElementById('reading-progress');
  const dialog = document.getElementById('contents-dialog');
  const typeButton = document.getElementById('type-toggle');
  let record = {last:null, positions:{}};
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey));
    if (existing && typeof existing.positions === 'object' && existing.positions) record = existing;
    if (localStorage.getItem(fontKey) === 'large') document.body.classList.add('large-type');
  } catch (_) {}
  const saved = currentId ? record.positions[currentId] : null;
  let frame = null;
  let ready = false;
  function validPosition(position) {
    return position && Number.isFinite(position.paragraph) && Number.isFinite(position.offset) && Number.isFinite(position.progress);
  }
  function readingRatio() {
    if (!prose || !end) return 0;
    const start = prose.getBoundingClientRect().top + window.scrollY - 90;
    const finish = end.getBoundingClientRect().top + window.scrollY - window.innerHeight + 120;
    return Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(finish - start, 1)));
  }
  function updateProgress() {
    if (prose) progressBar.style.width = Math.round(readingRatio() * 100) + '%';
  }
  function refreshRecord() {
    try {
      const latest = JSON.parse(localStorage.getItem(storageKey));
      if (latest && latest.positions && typeof latest.positions === 'object' && !Array.isArray(latest.positions)) record = latest;
    } catch (_) {}
  }
  function remember() {
    if (!ready || !prose || !byId.has(currentId)) return;
    refreshRecord();
    const paragraphs = [...prose.querySelectorAll('[data-paragraph]')];
    const targetY = 100;
    let selected = paragraphs[0];
    for (const paragraph of paragraphs) {
      if (paragraph.getBoundingClientRect().top <= targetY) selected = paragraph;
      else break;
    }
    if (!selected) return;
    record.last = currentId;
    record.positions[currentId] = {
      paragraph:Number(selected.dataset.paragraph),
      offset:Math.round(targetY - selected.getBoundingClientRect().top),
      progress:readingRatio()
    };
    try { localStorage.setItem(storageKey, JSON.stringify(record)); } catch (_) {}
  }
  function syncType() {
    if (!typeButton) return;
    const large = document.body.classList.contains('large-type');
    typeButton.setAttribute('aria-pressed', String(large));
    document.getElementById('type-label').textContent = large ? '標準に戻す' : '文字を大きく';
  }
  if (typeButton) {
    typeButton.hidden = false;
    syncType();
    typeButton.addEventListener('click', () => {
      document.body.classList.toggle('large-type');
      syncType();
      try { localStorage.setItem(fontKey, document.body.classList.contains('large-type') ? 'large' : 'normal'); } catch (_) {}
      updateProgress();
      remember();
    });
  }
  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('.n-toc-fallback').forEach(link => { link.hidden = true; });
    document.querySelectorAll('[data-open-contents]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => dialog.showModal());
    });
    document.querySelector('[data-close-contents]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  }
  function refreshResumeLink() {
    refreshRecord();
    const link = document.querySelector('[data-resume-link]');
    if (!link) return;
    const detail = document.querySelector('[data-resume-detail]');
    const valid = byId.has(record.last) && validPosition(record.positions[record.last]);
    link.hidden = !valid;
    detail.hidden = !valid;
    if (!valid) return;
    const scene = byId.get(record.last);
    link.href = scene.id + '.html#continue';
    detail.textContent = scene.chapter + '　' + scene.title + '「' + scene.label + '」';
  }
  refreshResumeLink();
  window.addEventListener('pageshow', refreshResumeLink);
  if (!prose) return;
  let navigationType = '';
  try { navigationType = performance.getEntriesByType('navigation')[0]?.type || ''; } catch (_) {}
  const shouldRestore = validPosition(saved) && (location.hash === '#continue' || navigationType === 'back_forward' || navigationType === 'reload');
  if (shouldRestore && 'scrollRestoration' in history) history.scrollRestoration = 'manual';
  const fontsReady = document.fonts?.ready || Promise.resolve();
  fontsReady.then(() => {
    requestAnimationFrame(() => {
      if (shouldRestore) {
        const target = prose.querySelector('[data-paragraph="' + Math.max(0,Math.floor(saved.paragraph)) + '"]');
        if (target) {
          const offset = Math.max(-window.innerHeight, Math.min(saved.offset, target.getBoundingClientRect().height));
          window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top + window.scrollY + offset - 100),behavior:'instant'});
        }
        if (location.hash === '#continue') history.replaceState(null,'',location.pathname + location.search);
      }
      ready = true;
      updateProgress();
      remember();
    });
  });
  window.addEventListener('scroll', () => {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      updateProgress();
      remember();
      frame = null;
    });
  }, {passive:true});
  window.addEventListener('resize', updateProgress, {passive:true});
  window.addEventListener('pagehide', remember);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') remember(); });
  document.querySelectorAll('a[href="#main"]').forEach(link => link.addEventListener('click', () => {
    const heading = document.getElementById('chapter-heading');
    if (heading) requestAnimationFrame(() => heading.focus({preventScroll:true}));
  }));
})();
