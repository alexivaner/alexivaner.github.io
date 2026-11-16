import puppeteer from 'puppeteer-core';
import {mkdir} from 'node:fs/promises';
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try{
 await mkdir('public/assets/images/motion',{recursive:true});const page=await browser.newPage();await page.setViewport({width:1500,height:1100});await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.goto(process.env.PORTFOLIO_URL||'http://127.0.0.1:4175',{waitUntil:'networkidle0'});await page.waitForFunction(()=>document.querySelector('.motion-stage')?.dataset.renderer==='avatar');
 await page.addStyleTag({content:'.motion-stage{position:fixed!important;inset:0!important;width:1200px!important;height:750px!important;aspect-ratio:auto!important;border-radius:0!important;z-index:10000!important}.motion-hint{display:none!important}'});
 for(const theme of ['light','dark']){await page.evaluate(theme=>{document.documentElement.dataset.mode=theme;},theme);await page.waitForFunction(()=>document.querySelector('.avatar-canvas').width>=1200);await page.evaluate(()=>new Promise(requestAnimationFrame));await (await page.$('.motion-stage')).screenshot({path:`public/assets/images/motion/avatar-${theme}.webp`,type:'webp',quality:90});}
 console.log('Captured light and dark first-paint avatar posters from the real renderer.');
}finally{await browser.close()}
