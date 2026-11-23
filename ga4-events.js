(() => {
  'use strict';

  const analytics = window.gtag;
  if (typeof analytics !== 'function') return;

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
    analytics('event', name, {
      content_group: contentGroup,
      bwe_animal: animal,
      bwe_page_path: location.pathname,
      ...parameters
    });
  }

  function observeOnce(element, seconds, callback, threshold = 0.5) {
    if (!element || !('IntersectionObserver' in window)) return;
    let timer;
    let done = false;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= threshold);
      if (visible && document.visibilityState === 'visible') {
        if (!timer && !done) timer = window.setTimeout(() => {
          done = true;
          callback();
          observer.disconnect();
        }, seconds * 1000);
      } else if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    }, { threshold: [threshold] });
    observer.observe(element);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' && timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    }, { once: true });
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
      send('bwe_novel_page_open', { bwe_work_id: 'ninzuubun', bwe_novel_page: 'cover' });
    } else {
      send('bwe_novel_page_open', { bwe_work_id: 'ninzuubun', bwe_novel_page: 'scene', bwe_scene_id: sceneId, bwe_chapter: chapter });
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
    const firstParagraph = main && [...main.querySelectorAll('p')].find(paragraph =>
      paragraph.textContent.trim().length > 40 && !paragraph.closest('nav, footer, aside, dialog')
    );
    observeOnce(firstParagraph, 5, () => send('bwe_core_view', { bwe_block: 'main' }), 0.5);
  }

  document.addEventListener('click', event => {
    const printButton = event.target.closest('[data-print]');
    if (printButton) send('bwe_print_request', { bwe_page_path: location.pathname });
    const link = event.target.closest('a[href]');
    if (link) {
      const target = new URL(link.href, location.href);
      if (target.origin === location.origin && target.pathname.startsWith('/beforeweeat/') && target.pathname !== location.pathname) {
        send('select_content', {
          content_type: 'article',
          content_id: target.pathname.replace('/beforeweeat/', '').replace(/\/$/, '') || 'home',
          bwe_placement: link.closest('nav') ? 'navigation' : link.closest('main') ? 'article' : 'site'
        });
      }
    }
    const reveal = event.target.closest('#observe button, #observe [role="button"]');
    if (reveal) send('bwe_animal_reveal', { bwe_interaction: event.detail === 0 ? 'keyboard' : 'pointer' });
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
        const bucket = /0件|見つかりません/.test(resultCount) ? 'zero'
          : /1件/.test(resultCount) ? 'one'
          : /[2-9]\d*件/.test(resultCount) ? 'two_to_ten'
          : resultCount ? 'eleven_plus' : 'zero';
        send('bwe_search_results', {
          bwe_search_location: input.id === 'field-query' ? 'field_cases' : 'catalog',
          bwe_result_count: bucket
        });
      }, 1000);
    });
  });
})();