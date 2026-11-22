(() => {
 const archive = document.querySelector('.field-index');
 if (!archive) return;
 const input = archive.querySelector('#field-query');
 const status = archive.querySelector('#field-count');

 function textWithoutRuby(node) {
  const copy = node.cloneNode(true);
  copy.querySelectorAll('rt, rp').forEach(reading => reading.remove());
  return copy.textContent;
 }

 const groups = Array.from(archive.querySelectorAll('.field-group'), element => {
  const title = textWithoutRuby(element.querySelector('h3'));
  const records = Array.from(element.querySelectorAll('.case-records > li'), row => {
   const heading = textWithoutRuby(row.querySelector('.field-record > summary'));
   const account = textWithoutRuby(row.querySelector('.field-account'));
   const number = row.id.slice('record-'.length);
   return { row, key: normalizeChapterSearch([title, '第'+number+'項', heading, account].join(' ')) };
  });
  return { element, records };
 });

 let priorOpen;
 function filter() {
  const words = normalizeChapterSearch(input.value).trim().split(/\s+/).filter(Boolean);
  if (words.length && !priorOpen) priorOpen = groups.map(group => group.element.open);
  let count = 0;
  for (const [index, { element, records }] of groups.entries()) {
   let matches = 0;
   for (const { row, key } of records) {
    row.hidden = !words.every(word => key.includes(word));
    if (!row.hidden) matches++;
   }
   element.hidden = matches === 0;
   if (words.length) element.open = matches > 0;
   else if (priorOpen) element.open = priorOpen[index];
   count += matches;
  }
  status.textContent = words.length ? (count ? count+'件の記録' : '見つかりませんでした。別のことばで探せます。') : '';
  if (!words.length) priorOpen = null;
 }

 function showLinkedRecord() {
  const id = location.hash.slice(1);
  if (!/^record-(?:group-)?\d+$/.test(id)) return;
  const target = document.getElementById(id);
  if (!target) return;
  if (input.value) {
   input.value = '';
   filter();
  }
  const group = target.closest('.field-group');
  if (!group) return;
  group.open = true;
  const record = target.querySelector(':scope > .field-record');
  if (record) record.open = true;
  target.scrollIntoView({ block:'start', behavior:'instant' });
 }

 archive.querySelector('.field-search').hidden = false;
 input.addEventListener('input', filter);
 window.addEventListener('hashchange', showLinkedRecord);
 window.addEventListener('pageshow', () => {
  filter();
  showLinkedRecord();
 });
 filter();
 showLinkedRecord();
})();

(() => {
 const control = document.getElementById('show-field-photos');
 if (!control) return;
 let visible = false;
 function update() {
  for (const slot of document.querySelectorAll('[data-field-media]')) {
   if (visible && !slot.firstElementChild) {
    slot.append(slot.nextElementSibling.content.cloneNode(true));
   } else if (!visible) {
    slot.replaceChildren();
   }
  }
  control.setAttribute('aria-pressed', String(visible));
  control.textContent = visible ? '写真を隠す' : '内容を理解して写真を表示する';
 }
 
 document.querySelector('.field-cover a').addEventListener('click', () => {visible = false; update();});
 control.hidden = false;
 control.addEventListener('click', () => {visible = !visible; update();});
 update();
})();
