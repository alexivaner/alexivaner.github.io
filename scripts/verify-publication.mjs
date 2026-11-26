import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {writeFile,readFile} from 'node:fs/promises';
const base=process.env.PORTFOLIO_URL||'http://127.0.0.1:4175';
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const errors=[];
 async function sample({motion='no-preference',saveData=false,blocked=false}={}){
  const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.setViewport({width:1440,height:900});await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:motion}]);
  await p.evaluateOnNewDocument(({saveData,blocked})=>{localStorage.setItem('ivan-language','en');if(saveData)Object.defineProperty(navigator,'connection',{get:()=>({saveData:true})});if(blocked)HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Playback blocked','NotAllowedError'));},{saveData,blocked});
  await p.goto(base,{waitUntil:'networkidle0'});await p.waitForFunction(()=>document.documentElement.dataset.hydrated==='true');
  await p.click('#project-tsp .project-story > summary');await p.waitForSelector('dialog[open] video');
  return p;
 }
 const p=await sample();
 await p.waitForFunction(()=>{const v=document.querySelector('dialog video');return !v.paused&&v.currentTime>0;},{timeout:15000});
 assert(await p.$eval('dialog video',v=>v.muted&&v.loop&&v.playsInline&&v.autoplay));
 // Scroll the actual dialog body, keeping its header independent and visible.
 await p.$eval('.viewer-body',el=>el.scrollTop=el.scrollHeight);
 await p.waitForFunction(()=>document.querySelector('dialog video').paused);
 assert(await p.$eval('.viewer-top',el=>el.getBoundingClientRect().top>=0));
 await p.$eval('dialog video',el=>el.scrollIntoView({block:'center'}));
 await p.waitForFunction(()=>!document.querySelector('dialog video').paused);
 await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
 await p.waitForFunction(()=>document.querySelector('dialog video').paused);
 await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});
 await p.waitForFunction(()=>!document.querySelector('dialog video').paused);
 await p.screenshot({path:'.hallmark/reports/publication-tsp-desktop.png'});
 await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('dialog video'));
 await p.close();
 for(const settings of [{motion:'reduce'},{saveData:true},{blocked:true}]){
  const q=await sample(settings);await q.waitForSelector('dialog .preview-manual');
  assert(await q.$eval('dialog video',v=>v.paused));
  if(!settings.blocked)assert.equal(await q.$eval('dialog video',v=>v.getAttribute('src')),null,'Motion/data preference must avoid fetching animation');
  if(settings.motion){await q.click('dialog .preview-manual');await q.waitForFunction(()=>!document.querySelector('dialog video').paused);}
  await q.close();
 }
 const r=await browser.newPage();await r.setRequestInterception(true);r.on('request',q=>q.url().startsWith('https://www.youtube-nocookie.com/embed/')?q.respond({status:200,contentType:'text/html',body:'<!doctype html><title>Native embedded video test</title>'}):q.continue());
 for(const width of [375,1440]){
  await r.setViewport({width,height:900});await r.goto(base,{waitUntil:'networkidle0'});await r.waitForFunction(()=>document.documentElement.dataset.hydrated==='true');await r.click('#robot-fJvOMFCaZIk .hardware-video');await r.waitForSelector('dialog[open] iframe');
  assert.equal(await r.$$eval('dialog .viewer-image',e=>e.length),0);
  assert(await r.$eval('.video-frame',el=>{const b=el.getBoundingClientRect(),h=document.querySelector('.viewer-top').getBoundingClientRect();return b.top>=h.bottom&&b.right<=innerWidth&&b.width>200;}));
  await r.screenshot({path:`.hallmark/reports/publication-robot-${width}.png`});
  await r.keyboard.press('Escape');await r.waitForFunction(()=>!document.querySelector('iframe'));
  await r.goto(base+'/resume/',{waitUntil:'networkidle0'});
  assert(await r.$eval('body',el=>el.scrollWidth<=innerWidth));
  assert.equal(await r.$eval('.resume-download',el=>el.download),'');
  const pdf=await r.$eval('.resume-download',el=>el.href);
  const probe=await fetch(pdf);assert.equal(probe.status,200);assert((await probe.text()).startsWith('%PDF-'));
  assert(await r.$eval('.resume-nav a[target="_blank"]',el=>el.href.endsWith('.pdf')));
  await r.screenshot({path:`.hallmark/reports/publication-resume-${width}.png`,fullPage:true});
 }
 const gallery=await browser.newPage();await gallery.goto(process.env.PORTFOLIO_URL||'http://127.0.0.1:4175',{waitUntil:'networkidle0'});await gallery.waitForFunction(()=>document.documentElement.dataset.hydrated==='true');
 async function thumbnail(selector,name){await gallery.click(selector);await gallery.waitForSelector('dialog[open]');assert.equal(await gallery.$eval('#project-dialog-title',el=>el.textContent),name);await gallery.keyboard.press('Escape');await gallery.waitForFunction(()=>!document.querySelector('dialog[open]'));assert(await gallery.$eval(selector,el=>el===document.activeElement),'Thumbnail focus was not restored');}
 await thumbnail('.featured-project .project-thumbnail','Readmory');await thumbnail('.aegis-project .project-thumbnail','Aegis');await thumbnail('.ourtrip-project .project-thumbnail','OurTrip');
 await gallery.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
 await gallery.click('.ourtrip-project .project-thumbnail');
 await gallery.waitForSelector('dialog[open] .conversation-play');
 await gallery.evaluate(()=>[...document.querySelectorAll('dialog .conversation-scenarios button')].at(-1).click());
 assert(await gallery.$('dialog .conversation-attachment'));
 await gallery.click('dialog .conversation-play');
 await gallery.waitForSelector('dialog .conversation-typing');
 assert.equal(await gallery.$$eval('dialog .conversation-thread > li:not(.conversation-typing)',messages=>messages.length),1);
 await gallery.click('dialog .conversation-play');
 assert.equal(await gallery.$eval('dialog .conversation-play',button=>button.textContent.trim()),'Resume playback');
 await gallery.click('dialog .conversation-play');
 await gallery.waitForFunction(()=>document.querySelector('dialog .conversation-play')?.textContent.trim()==='Replay chat');
 assert.equal(await gallery.$$eval('dialog .conversation-thread > li',messages=>messages.length),4);
 await gallery.keyboard.press('Escape');
 await gallery.waitForFunction(()=>!document.querySelector('dialog[open]'));
 const websites=JSON.parse(await readFile('content/portfolio.json')).websites;
 for(const site of websites.filter(item=>item.image)){
  await gallery.$eval(`.website-selector a[href="${site.href}"]`,el=>el.click());await thumbnail('.website-preview .project-thumbnail',site.name);
 }
 await gallery.close();
 assert.deepEqual(errors,[]);await writeFile('.hallmark/reports/publication-checks.json',JSON.stringify({passed:true,checks:['viewport autoplay, muted inline loop','offscreen and hidden-tab pause','resume after visibility restoration','reduced-motion poster and manual play','save-data poster','blocked autoplay fallback','robotics video first, no duplicate still, unload','mobile and desktop resume, PDF delivery'],errors},null,2));
 console.log('Publication checks passed: playback policies, dialog geometry, robotics players, and resume PDF on desktop/mobile.');
}finally{await browser.close();}
