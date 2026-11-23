(() => {
  'use strict';

  const analytics = window.gtag;
  if (typeof analytics !== 'function' || window.__bweEventsBound) return;
  window.__bweEventsBound = true;
  const measurementId = 'G-HBPDX2M5HR';

  const path = location.pathname.replace(/^\/beforeweeat\/?/, '');
  const slug = path.replace(/\/index\.html$/, '').replace(/\.html$/, '') || 'home';
  const novel = slug === 'ninzuubun' || slug.startsWith('ninzuubun/');
  const recipePattern = /^(stew|bbq-ribs|crispy-chicken|ginger-pork|pork-cutlet|miso-soup|plate-\d+)$/;
  const animalPattern = /^(animals|welfare|cow|pig|hen|hens|chicks|pig-rest|sows|calves|feet)$/;
  const fieldPattern = /^(field-cases|case-[a-z-]+)$/;
  const lessonPattern = /^(lessons|lesson-[a-z-]+)$/;
  const cutPattern = /^(cuts|loin|pork-round|ribs|beef-shank|beef-round|chicken-cuts|beef-cuts|pig-cuts|chicken-guide|nutrition|buy-bone)$/;
  const contentGroup = novel ? 'novel'
    : recipePattern.test(slug) ? 'recipe'
    : fieldPattern.test(slug) ? 'field_case'
    : lessonPattern.test(slug) ? 'lesson'
    : animalPattern.test(slug) ? 'animal_life'
    : cutPattern.test(slug) ? 'cut'
    : /^(start|cooking|sources|editorial|mina|shopping|people)$/.test(slug) ? 'index'
    : 'article';
  const animal = /pig|pork|loin|sows/.test(slug) ? 'pig'
    : /cow|beef|calves/.test(slug) ? 'cow'
    : /hen|chicken|chicks/.test(slug) ? 'hen'
    : 'none';

  analytics('set', {
    content_group: contentGroup,
    bwe_animal: animal,
    bwe_page_path: location.pathname
  });

  function send(name, parameters = {}) {
    if (location.hostname !== 'djnaoyaman.github.io' || window['ga-disable-' + measurementId]) return;
    try {
      analytics('event', name, {
        content_group: contentGroup,
        bwe_animal: animal,
        bwe_page_path: location.pathname,
        ...parameters,
        send_to: measurementId,
        page_location: location.origin + location.pathname,
        page_referrer: document.referrer.split(/[?#]/)[0],
        transport_type: 'beacon'
      });
    } catch (_) { /* Measurement must not interrupt reading or interaction. */ }
  }

  function observeOnce(element, seconds, callback, threshold = 0.5) {
    if (!element || !('IntersectionObserver' in window)) return;
    let timer;
    let done = false;
    let inView = false;
    function stopTimer() {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    }
    function sync() {
      if (done) return;
      if (!inView || document.visibilityState !== 'visible') {
        stopTimer();
      } else if (timer === undefined) {
        timer = window.setTimeout(() => {
          timer = undefined;
          if (done || !inView || document.visibilityState !== 'visible') return;
          done = true;
          observer.disconnect();
          document.removeEventListener('visibilitychange', sync);
          callback();
        }, seconds * 1000);
      }
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === element) inView = entry.isIntersecting && entry.intersectionRatio >= threshold;
      });
      sync();
    }, { threshold: [threshold] });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
  }

  if (novel) {
    const sceneId = document.body.dataset.scene || 'cover';
    let scene = null;
    try {
      const navigation = JSON.parse(document.getElementById('novel-navigation')?.textContent || '[]');
      scene = navigation.find(item => item.id === sceneId) || null;
    } catch (_) {}
    const chapter = scene ? 'ch' + String(navigationChapter(scene.chapter)).padStart(2, '0') : 'cover';
    function navigationChapter(label) {
      const match = String(label || '').match(/第([一二三四五六七八])章/);
      return match ? '一二三四五六七八'.indexOf(match[1]) + 1 : 0;
    }
    if (document.body.classList.contains('n-landing')) {
      // bwe_novel_view is derived from the matching page_view in GA4.
    } else {
      // bwe_novel_view is derived from the matching page_view in GA4.
      observeOnce(document.getElementById('prose'), 10, () => send('bwe_novel_read', {
        bwe_work_id: 'ninzuubun', bwe_scene_id: sceneId, bwe_chapter: chapter
      }), 0.1);
      observeOnce(document.getElementById('scene-end'), 5, () => send('bwe_novel_scene_end', {
        bwe_work_id: 'ninzuubun', bwe_scene_id: sceneId, bwe_chapter: chapter, is_final_scene: sceneId === 'one-bean'
      }), 0.1);
    }
    document.querySelectorAll('[data-resume-link]').forEach(link => link.addEventListener('click', () => {
      send('bwe_novel_resume', { bwe_work_id: 'ninzuubun' });
    }));
  }

  if (['recipe', 'cut', 'animal_life', 'field_case', 'lesson', 'article'].includes(contentGroup)) {
    const main = document.querySelector('main');
    const firstParagraph = main && (main.querySelector('[data-bwe-core]') || [...main.querySelectorAll('p')].find(paragraph =>
      paragraph.textContent.trim().length > 40 && !paragraph.closest('nav, footer, aside, dialog')
    ));
    observeOnce(firstParagraph, 5, () => send('bwe_core_view', { bwe_block: 'main' }), 0.5);
  }

  // Impressions are separate from the GA4-derived novel landing view.
  observeOnce(document.querySelector('#novel.novel-banner'), 1, () => send('bwe_novel_promo_view', {
    bwe_work_id: 'ninzuubun', bwe_placement: 'homepage'
  }), 0.5);

  document.addEventListener('bwe:detail-opened', event => {
    const detail = event.detail?.id;
    if (['welfare', 'space', 'rest', 'care', 'cooking'].includes(detail)) {
      send('bwe_detail_view', { bwe_detail_id: detail });
    }
  });
  document.addEventListener('bwe:animal-revealed', event => {
    const detail = event.detail || {};
    if (!['pig', 'cow', 'hen'].includes(detail.animal)) return;
    send('bwe_animal_reveal', {
      bwe_animal: detail.animal,
      bwe_interaction: ['keyboard', 'pointer'].includes(detail.interaction) ? detail.interaction : 'control'
    });
  });

  document.addEventListener('click', event => {
    if (event.defaultPrevented) return;
    const printButton = event.target.closest?.('[data-print]');
    if (printButton) send('bwe_print_request', { bwe_page_path: location.pathname });
    const link = event.target.closest?.('a[href]');
    if (link) {
      const target = new URL(link.href, location.href);
      if (!link.hasAttribute('download') && target.origin === location.origin && /^\/beforeweeat\/(?:[a-z0-9_-]+\/)*(?:[a-z0-9_-]+\.html)?$/.test(target.pathname) && target.pathname !== location.pathname) {
        send('select_content', {
          content_type: target.pathname.includes('/ninzuubun/') ? 'novel' : 'article',
          content_id: target.pathname.replace('/beforeweeat/', '').replace(/\/$/, '') || 'home',
          bwe_placement: link.closest('#novel') ? 'novel_promo' : link.closest('nav') ? 'navigation' : link.closest('main') ? 'article' : 'site'
        });
      }
    }
  });

  document.addEventListener('toggle', event => {
    if (event.target.matches('.field-record[open]')) {
      send('bwe_case_open', { bwe_case_id: event.target.closest('[id]')?.id || 'record' });
    }
  }, true);

  const searchInputs = document.querySelectorAll('#catalog-query, #field-query');
  searchInputs.forEach(input => {
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        const resultCount = document.querySelector('#count, #field-count')?.textContent.trim() || '';
        const countMatch = resultCount.match(/(\d[\d,]*)\s*件/);
        const count = countMatch ? Number(countMatch[1].replace(/,/g, '')) : 0;
        const bucket = count === 0 ? 'zero' : count === 1 ? 'one'
          : count <= 10 ? 'two_to_ten' : 'eleven_plus';
        send('bwe_search_results', {
          bwe_search_location: input.id === 'field-query' ? 'field_cases' : 'catalog',
          bwe_result_count: bucket
        });
      }, 1000);
    });
  });
})();