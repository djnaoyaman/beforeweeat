const root=document.documentElement;
function settings(key,fallback){try{return localStorage.getItem(key)??fallback;}catch{return fallback;}}
for(const [attr,className,key,defaultOn] of [['ruby','no-ruby','bwe-ruby',true],['size','large-text','bwe-font',false]]){
 const button=document.querySelector('[data-'+attr+']');
 if(!button)continue;
 let on=settings(key,defaultOn?'on':'off')==='on';
 function apply(){button.setAttribute('aria-pressed',String(on));root.classList.toggle(className,attr==='ruby'?!on:on);}
 apply();
 button.addEventListener('click',()=>{on=!on;apply();try{localStorage.setItem(key,on?'on':'off');}catch{}});
}
const find=document.querySelector('#find');
if(find){
 const groups=[...document.querySelectorAll('.chapter')];
 find.addEventListener('input',()=>{
  const query=find.value.trim().normalize('NFKC').toLowerCase();
  let count=0;
  for(const group of groups){
   let visible=0;
   for(const entry of group.querySelectorAll('[data-entry]')){
    entry.hidden=!entry.dataset.key.normalize('NFKC').toLowerCase().includes(query);
    if(!entry.hidden)visible++;
   }
   group.hidden=visible===0;
   count+=visible;
  }
  document.querySelector('#count').textContent=query?count+'件の記事':'';
 });
}
document.querySelectorAll('[data-print]').forEach(button=>button.addEventListener('click',()=>window.print()));

function openLinkedFieldRecord(){
 const target=window.location.hash;
 if(!/^#record-[0-9]+$/.test(target))return;
 const entry=document.getElementById(target.slice(1));
 const record=entry?.querySelector('details.field-record');
 if(record)record.open=true;
}
if(document.getElementById('field-archive')){
 openLinkedFieldRecord();
 window.addEventListener('hashchange',openLinkedFieldRecord);
}
