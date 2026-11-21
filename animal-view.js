const views={
 pig:{title:'ぶた',art:'pig-art.webp',guide:'pig-cuts',points:['ロースは、背中のほうのお肉。','ばらは、おなかのほうのお肉。']},
 cow:{title:'牛',art:'cow-art.webp',guide:'beef-cuts',points:['サーロインは、腰に近い背中のお肉。','すねは、脚の下のほうのお肉。']},
 hen:{title:'にわとり',art:'hen-art.webp',guide:'chicken-guide',points:['むねは、体の前側のお肉。','ももは、脚のつけ根のほうのお肉。']}
};
const animalArt=document.querySelector('.hero .art');
const animalPic=animalArt?.querySelector('img');
const buttons=[...document.querySelectorAll('[data-animal]')];
for(const button of buttons){
 button.addEventListener('click',()=>{
  const key=button.dataset.animal;
  const view=views[key];
  if(art.getAttribute('aria-expanded')==='true')showNotes(false);
  animalArt.dataset.view=key;
  animalPic.src=view.art;
  animalPic.alt='横から見た'+view.title+'の全身の線画';
  animalArt.setAttribute('aria-label',view.title+'の絵から、お肉の場所を調べる');
  document.querySelector('#animal-name').textContent=view.title;
  const guide=document.querySelector('#animal-guide');
  const life=document.querySelector('#animal-life');
  guide.href=view.guide+'.html';
  guide.textContent=view.title+'の部位を見る';
  life.href=key+'.html';
  life.textContent=view.title+'のくらし';
  animalArt.querySelectorAll('.note strong').forEach((note,i)=>{note.textContent=view.points[i];});
  for(const item of buttons)item.setAttribute('aria-pressed',String(item===button));
 });
}
