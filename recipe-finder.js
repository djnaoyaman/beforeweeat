/* The photographs and links are the fallback. Controls appear after setup. */
(() => {
  document.querySelectorAll('[data-recipe-finder]').forEach(finder => {
    const controls = finder.querySelector('[data-recipe-controls]');
    const status = finder.querySelector('[data-recipe-status]');
    const empty = finder.querySelector('[data-recipe-empty]');
    const cards = Array.from(finder.querySelectorAll('[data-recipe-card]'));
    const buttons = Array.from(finder.querySelectorAll('[data-recipe-filter]'));
    const clear = finder.querySelector('[data-recipe-clear]');
    if (!controls || !status || !empty || !cards.length || !buttons.length || !clear) return;

    const selection = { animal: 'all', method: 'all' };
    function update() {
      let count = 0;
      cards.forEach(card => {
        const animalMatches = selection.animal === 'all' || card.dataset.recipeAnimal === selection.animal;
        const methodMatches = selection.method === 'all' || card.dataset.recipeMethods.split(' ').includes(selection.method);
        card.hidden = !(animalMatches && methodMatches);
        if (!card.hidden) count += 1;
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(selection[button.dataset.recipeFilter] === button.dataset.filterValue)));
      const chosen = buttons.filter(button => button.getAttribute('aria-pressed') === 'true' && button.dataset.filterValue !== 'all')
        .map(button => button.dataset.filterLabel);
      status.textContent = (chosen.length ? chosen.join('・') + 'の料理　' : 'すべての料理　') + count + '品 / 全' + cards.length + '品';
      empty.hidden = count > 0;
    }

    buttons.forEach(button => button.addEventListener('click', () => {
      selection[button.dataset.recipeFilter] = button.dataset.filterValue;
      update();
    }));
    clear.addEventListener('click', () => {
      selection.animal = 'all';
      selection.method = 'all';
      update();
    });
    update();
    controls.hidden = false;
  });
})();
