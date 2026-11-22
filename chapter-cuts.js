(() => {
  const switcher = document.querySelector('.species');
  if (!switcher) return;

  const buttons = [...switcher.querySelectorAll('[data-focus]')];
  const panels = [...document.querySelectorAll('.specimen[data-animal]')];

  function showAnimal(key) {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.focus === key));
    }
    for (const panel of panels) panel.hidden = panel.dataset.animal !== key;
  }

  for (const panel of panels) {
    const picker = panel.querySelector('[data-cut-picker]');
    const select = picker.querySelector('select');
    const cuts = panel.querySelectorAll('.cutcopy');
    function showCut() {
      cuts.forEach((cut, index) => { cut.hidden = index !== select.selectedIndex; });
    }
    select.addEventListener('change', showCut);
    showCut();
    picker.hidden = false;
  }
  for (const button of buttons) {
    button.addEventListener('click', () => showAnimal(button.dataset.focus));
  }
  const initial = panels.find(panel => '#' + panel.id === location.hash);
  showAnimal(initial ? initial.dataset.animal : buttons[0].dataset.focus);
  switcher.hidden = false;
})();
