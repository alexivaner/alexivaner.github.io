import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir,stat} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {localizeWalkthrough} from '../src/protected/localize.js';
import {encryptWalkthrough,decryptWalkthrough} from '../src/protected/crypto.js';
await mkdir('.hallmark/reports',{recursive:true});
const testPass=randomBytes(24).toString('base64url');
const example={chapters:[{id:'sample',title:'Test document',summary:'Synthetic verification content',sections:[{title:'Test section',text:'A private test fixture, not company material.'}]}]};
const one=await encryptWalkthrough(example,testPass),two=await encryptWalkthrough(example,testPass);
assert.notEqual(one.salt,two.salt);assert.notEqual(one.iv,two.iv);assert(!JSON.stringify(one).includes(example.chapters[0].summary));assert.deepEqual(await decryptWalkthrough(one,testPass),example);
await assert.rejects(()=>decryptWalkthrough(one,'this-is-an-incorrect-test-passphrase'));
const tampered={...one,ciphertext:(one.ciphertext[0]==='A'?'B':'A')+one.ciphertext.slice(1)};await assert.rejects(()=>decryptWalkthrough(tampered,testPass));
const passcode=(await readFile('.private-review/presenter-passphrase.txt','utf8')).trim(),content=JSON.parse(await readFile('.private-review/engineering-walkthrough.json','utf8'));
const packet=JSON.parse(await readFile('public/assets/protected/engineering.enc.json','utf8'));assert.deepEqual(await decryptWalkthrough(packet,passcode),content);
assert.equal((await stat('.private-review/presenter-passphrase.txt')).mode&0o777,0o600);
async function files(dir){const out=[];for(const name of await readdir(dir)){const p=dir+'/'+name;(await stat(p)).isDirectory()?out.push(...await files(p)):out.push(p);}return out;}
const protectedPhrase=content.chapters.find(c=>c.id==='architecture').sections[2].text;
for(const path of (await files('dist')).filter(p=>/\.(html|js|json|md)$/.test(p))){const text=await readFile(path,'utf8');assert(!text.includes(passcode),`Passcode leaked in ${path}`);assert(!text.includes(protectedPhrase),`Unencrypted private content in ${path}`);for(const messages of Object.values(content.translations||{}))for(const [source,translated] of Object.entries(messages))if(source!==content.owner&&translated.length>80)assert(!text.includes(translated),`Unencrypted protected translation in ${path}`);for(const chapter of content.chapters)for(const image of chapter.images||[])assert(!text.includes(image.src.slice(0,120)),`Unencrypted product screen in ${path}`);}
const base=process.env.PORTFOLIO_URL||'http://127.0.0.1:4175';const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-unsafe-swiftshader']});const errors=[];
try{
 const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width:1440,height:900});await page.goto(base,{waitUntil:'networkidle0'});await page.waitForFunction(()=>document.documentElement.dataset.hydrated==='true');
 assert(!(await page.$eval('body',el=>el.innerText)).includes(protectedPhrase));
 const trigger='.engineering-section .protected-case-link';await page.click(trigger);await page.waitForSelector('.protected-dialog[open]');assert(await page.$eval('#walkthrough-passcode',el=>el===document.activeElement));
 await page.type('#walkthrough-passcode','incorrect-test-passcode');await page.click('.private-unlock button[type="submit"]');await page.waitForSelector('#walkthrough-error');assert(!(await page.$eval('.protected-dialog',el=>el.innerText)).includes(content.chapters[0].title));
 await page.$eval('#walkthrough-passcode',el=>el.value='');await page.type('#walkthrough-passcode',passcode);await page.click('.private-unlock button[type="submit"]');await page.waitForSelector('.private-document');assert.equal(await page.$$eval('#walkthrough-passcode',els=>els.length),0);
 await page.waitForFunction(()=>document.querySelector('.private-screen-preview img')?.naturalWidth>0);await page.click('.private-screen-preview');await page.waitForSelector('.private-screen-dialog[open]');await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.private-screen-dialog'));assert(await page.$eval('.private-screen-preview',el=>el===document.activeElement));
 assert(await page.$eval('.protected-dialog',el=>el.getBoundingClientRect().width>innerWidth*.9),'Unlocked reader must use the available desktop width');
 assert.equal(await page.$$eval('.private-toolbar option',els=>els.length),content.chapters.length);
 await page.select('.private-toolbar select','1');await page.waitForSelector('.architecture-study');assert.equal(await page.$$eval('.architecture-choices button',els=>els.length),content.chapters[1].diagram.nodes.length);await page.click('.architecture-choices button:nth-of-type(6)');await page.waitForFunction(evidence=>document.querySelector('.architecture-explanation > code')?.textContent===evidence,{},content.chapters[1].diagram.nodes[5].evidence);
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const accessibility=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));assert.deepEqual(accessibility,[]);
 for(const width of [375,1440]){await page.setViewport({width,height:900});assert(await page.$eval('.protected-dialog',el=>el.scrollWidth<=innerWidth));}
 for(const locale of ['id','zh-TW','ko','ja','en']){
  await page.select('.protected-dialog .language-control select',locale);await page.waitForFunction(code=>document.querySelector('.private-document')?.lang===code,{},locale);
  const translated=localizeWalkthrough(content,locale);
  for(let chapterIndex=0;chapterIndex<content.chapters.length;chapterIndex++){
   await page.select('.private-toolbar select',String(chapterIndex));const expected=translated.chapters[chapterIndex];await page.waitForFunction(title=>document.querySelector('.private-document h3')?.textContent===title,{},expected.title);
   assert.equal(await page.$eval('.private-summary',el=>el.textContent),expected.summary);
   assert.deepEqual(await page.$$eval('.private-document .viewer-story section',els=>els.map(el=>({title:el.querySelector('h4').textContent,text:el.querySelector('p').textContent}))),expected.sections);
   assert.equal(await page.$eval('.private-owner',el=>el.textContent),translated.owner);
   if(expected.links)assert.deepEqual(await page.$$eval('.private-reference-links a',els=>els.map(el=>({label:el.textContent,href:el.href}))),expected.links);
   if(expected.images)assert.deepEqual(await page.$$eval('.private-screen-preview img',els=>els.map(el=>el.alt)),expected.images.map(image=>image.alt));
   if(expected.diagram){
    assert.deepEqual(await page.$$eval('.architecture-node-layer',els=>els.map(el=>el.textContent)),expected.diagram.nodes.map(node=>node.layer));
    for(let nodeIndex=0;nodeIndex<expected.diagram.nodes.length;nodeIndex++){
     const selected=expected.diagram.nodes[nodeIndex];await page.click(`.architecture-choices button:nth-of-type(${nodeIndex+1})`);await page.waitForFunction(text=>document.querySelector('.architecture-explanation > p')?.textContent===text,{},selected.text);
     assert.equal(await page.$eval('.architecture-example',el=>el.textContent),selected.example);
     const edges=expected.diagram.edges.filter(edge=>edge.from===selected.id||edge.to===selected.id);assert.equal(await page.$$eval('.architecture-edge.is-related',els=>els.length),edges.length);
     assert.deepEqual(await page.$$eval('.architecture-relations li > span:last-child',els=>els.map(el=>el.textContent)),edges.map(edge=>edge.label));
    }
    await page.focus('.architecture-choices button:first-of-type');await page.keyboard.press('End');await page.waitForFunction(()=>document.querySelector('.architecture-choices button:last-child').getAttribute('aria-pressed')==='true');await page.keyboard.press('Home');await page.waitForFunction(()=>document.querySelector('.architecture-choices button:first-of-type').getAttribute('aria-pressed')==='true');
   }
  }
  for(const width of [320,375,768,1440,1920])for(const mode of ['light','dark']){await page.setViewport({width,height:900});await page.evaluate(mode=>document.documentElement.dataset.mode=mode,mode);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert(await page.$eval('.protected-dialog',el=>el.scrollWidth<=el.clientWidth),'Reader must fit in all languages and themes');assert(await page.$eval('.private-workspace .viewer-body',el=>el.clientHeight>300),'Reader must leave usable vertical space');}
 }
 await page.setViewport({width:1440,height:900});await page.select('.private-toolbar select','1');
 await page.click('.private-lock');await page.waitForSelector('#walkthrough-passcode');assert.equal(await page.$$eval('.private-document',els=>els.length),0);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.protected-dialog'));assert(await page.$eval(trigger,el=>el===document.activeElement));
 // The protected presenter can be opened over the public case and closes cleanly.
 await page.click('.system-detail .project-story > summary');await page.waitForSelector('.project-dialog[open]');await page.click('.project-dialog .protected-case-link');await page.waitForSelector('.protected-dialog[open]');await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.protected-dialog'));assert.equal(await page.$$eval('dialog[open]',els=>els.length),1);await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
 for(const locale of ['id','zh-TW','ko','ja']){await page.select('.site-header select',locale);await page.waitForFunction(code=>document.documentElement.lang===code,{},locale);await page.click(trigger);await page.waitForSelector('#walkthrough-passcode');assert(!(await page.$eval('.private-unlock',el=>el.textContent)).includes('Explore the engineering in depth'));await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.protected-dialog'));}
 assert(await page.evaluate(secret=>![...Object.values(localStorage),...Object.values(sessionStorage)].some(value=>value.includes(secret)),passcode));assert.deepEqual(errors,[]);
 await writeFile('.hallmark/reports/protected-checks.json',JSON.stringify({passed:true,checks:['AES-GCM round trip, random salt/IV, wrong passcode and tamper rejection','public output excludes key and plaintext','private key file permissions','wrong and correct browser unlock','eight chapters and interactive hexagonal map','lock clears document','Escape and nested-dialog focus restore','mobile/desktop fit','five-language full document, images and diagram translation without relocking','wider reading workspace across themes and phone/desktop layouts','no secret in Web Storage'],accessibility,errors},null,2));console.log('Protected walkthrough passed: encryption, access UI, presentation navigation, architecture map, focus, accessibility, and secret exclusion.');
}finally{await browser.close()}
