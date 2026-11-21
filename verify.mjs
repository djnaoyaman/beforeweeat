import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.BWE_PLAYWRIGHT || 'playwright');
const folder=path.resolve('dist');
const all=fs.readdirSync(folder);
const base='https://djnaoyaman.github.io/beforeweeat/';
const pages=all.filter(n=>n.endsWith('.html')&&n!=='404.html');
assert.equal(pages.length,57);
const titles=new Set();
const metaNames=['description','robots','author','og:title','og:description','og:url','og:image','twitter:card','twitter:title','twitter:image'];
const siteMap=fs.readFileSync(path.join(folder,'sitemap.xml'),'utf8');
let checkedLinks=0;
for(const name of pages){
 const html=fs.readFileSync(path.join(folder,name),'utf8');
 const url=base+(name==='index.html'?'':name);
 assert.ok(siteMap.includes('<loc>'+url+'</loc>'),name);
 assert.ok(html.includes('rel="canonical" href="'+url+'"'),name);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,name);
 const title=html.match(/<title>(.+?)<\/title>/)?.[1];
 assert.ok(title&&!titles.has(title),name);titles.add(title);
 for(const k of metaNames)assert.ok(html.includes('"'+k+'"'),name+' '+k);
 JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)[1]);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const value=m[1];
  if(value.startsWith('https:')||value.startsWith('data:'))continue;
  assert.ok(!value.includes('javascript:'),name);
  const [target,anchor]=value.split('#');
  if(target)assert.ok(fs.existsSync(path.join(folder,target)),name+' '+target);
  if(anchor&&!target)assert.ok(html.includes('id="'+anchor+'"'),name+' #'+anchor);
  checkedLinks++;
 }
}
const browser=await chromium.launch({executablePath:process.env.BWE_CHROME,headless:true,args:['--disable-background-networking','--no-first-run']});
try{
 const errors=[];
 const page=await browser.newPage({viewport:{width:1365,height:900}});
 page.on('pageerror',err=>errors.push(err.message));
 const open=(name)=>page.goto(pathToFileURL(path.join(folder,name)).href);
 await open('index.html');
 for(const [selector,asset] of [['.hero-pig','pig-art.webp'],['.intro-image img','cow-art.webp'],['.story-animal','hen-art.webp']]){
  const image=page.locator(selector);
  await image.scrollIntoViewIfNeeded();
  assert.equal(await image.getAttribute('src'),asset);
  assert.ok(await image.evaluate(async node=>{await node.decode();return node.naturalWidth>0;}));
 }
 await page.getByRole('button',{name:'牛',exact:true}).click();
 assert.equal(await page.locator('.hero-pig').getAttribute('src'),'cow-art.webp');
 await page.getByRole('button',{name:'にわとり',exact:true}).click();
 assert.equal(await page.locator('.hero-pig').getAttribute('src'),'hen-art.webp');
 await page.locator('#reveal').click();
 assert.equal(await page.locator('#reveal').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');
 await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');
 await page.locator('#menu').click();
 await page.locator('#next').click();
 await page.locator('.school-entry a').first().click();
 await page.waitForURL('**/lessons.html');
 for(const [file,label,asset] of [
  ['lesson-beef.html','牛の教材','cow-art.webp'],
  ['lesson-chicken.html','にわとりの教材','hen-art.webp'],
  ['lesson-pork.html','ぶたの教材','pig-art.webp']
 ]){
  await open('lessons.html');
  await page.getByRole('link',{name:label,exact:true}).click();
  await page.waitForURL('**/'+file);
  assert.ok(await page.locator('.worksheet').isVisible());
  const figure=page.locator('figure img');
  assert.equal(await figure.getAttribute('src'),asset);
  assert.ok(await figure.evaluate(async node=>{await node.decode();return node.naturalWidth>0;}));
 }
 await page.locator('[data-ruby]').click();assert.ok(await page.locator('html.no-ruby').count());
 await page.locator('[data-size]').click();assert.ok(await page.locator('html.large-text').count());
 await open('start.html');
 await page.locator('#find').fill('スペアリブ');
 assert.ok((await page.locator('[data-entry]:visible').count())<56);
 await page.locator('#find').fill('zzzzzzzz');
 assert.equal(await page.locator('[data-entry]:visible').count(),0);
 await page.locator('#find').clear();
 assert.equal(await page.locator('[data-entry]:visible').count(),56);
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  for(const name of ['index.html','lessons.html','lesson-beef.html','lesson-pork.html','lesson-chicken.html','hens.html','start.html','beef-cuts.html','chicken-guide.html','case-footpad.html','nutrition.html','cooking.html']){
   await open(name);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert.ok(overflow<=2,name+' '+width+' overflow '+overflow);
  }
 }
 await open('hens.html');
 assert.equal(await page.locator('.survey i').count(),408);
 assert.equal(await page.locator('.survey .n1').count(),304);
 await open('field-cases.html');
 assert.equal(await page.locator('.case-list li').count(),8);
 await open('case-footpad.html');
 await page.locator('.evidence summary').click();
 assert.ok(await page.locator('.evidence img').evaluate(async el=>{await el.decode();return el.naturalWidth>0;}));
 for(const [name,total] of [['beef-cuts.html',12],['pig-cuts.html',8],['chicken-guide.html',10]]){
  await open(name);
  assert.equal(await page.locator('.cut-list dt').count(),total);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
const hash=(name)=>crypto.createHash('sha256').update(fs.readFileSync(path.join(folder,name))).digest('hex');
console.log(JSON.stringify({pages:pages.length,checkedLinks,viewportWidths:[1365,390,320],topSha256:hash('index.html'),sitemapSha256:hash('sitemap.xml')},null,2));
