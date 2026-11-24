import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { detectLocale, matchLocale, translate } from '../src/i18n/locale.mjs';
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4175';
for (const [input, expected] of [['en-GB','en'],['id-ID','id'],['zh-TW','zh-TW'],['zh-HK','zh-TW'],['zh-Hant-HK','zh-TW'],['ko-KR','ko'],['ja-JP','ja'],['zh-CN',null],['x-invalid',null],[null,null]]) assert.equal(matchLocale(input), expected);
assert.equal(detectLocale(['fr-FR','ja-JP']), 'ja');
for (const input of [null, [], [undefined,123], ['fr']]) assert.equal(detectLocale(input), 'en');
assert.equal(translate('Missing phrase', {}), 'Missing phrase');
assert.equal(translate(' Home ', { Home: '首頁' }), ' 首頁 ');
const english = JSON.parse(await readFile('src/i18n/locales/en.json')).messages;
for (const locale of ['id','zh-TW','ko','ja']) {
  const catalog=JSON.parse(await readFile(`src/i18n/locales/${locale}.json`));assert.deepEqual(Object.keys(catalog),['messages'],'Translation keys must live inside messages');const messages=catalog.messages;
  assert.deepEqual(Object.keys(messages).sort(), Object.keys(english).sort(), `${locale}: incomplete catalog`);
  for(const key of ['3D motion analysis','System compatibility','From video to motion.','One movement. Multiple perspectives.'])assert(messages[key]&&messages[key]!==key,`${locale}: new evidence copy is untranslated`);
  assert(Object.values(messages).every(value => typeof value === 'string' && value.trim()), `${locale}: empty translation`);
}
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const results = [], errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if(message.type()==='error' && /hydrat|Minified React error|didn.t match/i.test(message.text())) errors.push(message.text()); });
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.goto(url, {waitUntil:'networkidle0'});
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  assert.equal(await page.$$eval('iframe', els=>els.length), 0, 'No player should load before interaction');
  async function select(locale, selector='.site-header select') {
    await page.select(selector, locale);
    await page.waitForFunction(code => document.documentElement.lang === code, {}, locale);
  }
  const groups = ['xview','xview-check','xview-platform'];
  for (const id of groups) {
    await page.click(`.system-selector a[href="#system-${id}"]`);
    await page.click('.system-detail .project-story > summary');
    await page.waitForSelector('dialog[open]');
    assert((await page.$eval('.viewer-story',el=>el.textContent)).length > 100);
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
  }
  for (const locale of ['en','id','zh-TW','ko','ja']) {
    await select(locale);
    for (const theme of ['light','dark']) {
      await page.evaluate(mode=>document.documentElement.dataset.mode=mode,theme);
      for (const width of [320,1440]) {
        await page.setViewport({width,height:900});
        await page.evaluate(()=>scrollTo(0,0));
        const layout = await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,nav:document.querySelector('.site-header').getBoundingClientRect().height,hero:document.querySelector('.hero-actions').getBoundingClientRect().bottom}));
        assert.equal(layout.overflow,false,`${locale} ${theme} ${width}: overflow`);
        assert(layout.nav<=80);
        if(width===1440) assert(layout.hero<800);
        results.push({locale,theme,width,...layout});
      }
    }
    assert((await page.title()).includes('Ivan Surya Hutomo'));
    if(locale!=='en') assert(!(await page.$eval('h1',el=>el.textContent)).includes('Engineering AI'));
    await page.click('.research-project-group .project-story > summary');
    await page.waitForSelector('dialog[open]');
    assert(await page.$('.image-comparison'), 'Zero-DCE authentic comparison missing');
    await page.$eval('.comparison-control input', el=>{el.value=80;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));});
    assert(await page.$eval('.viewer-top button', el=>el.getBoundingClientRect().top>=0));
    if(locale!=='en') assert(!(await page.$eval('.viewer-story',el=>el.textContent)).includes('The problem'));
    await select(locale==='ja'?'zh-TW':'ja', 'dialog select');
    assert(await page.$('dialog[open] .image-comparison'), 'Changing locale lost project state');
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
    await select(locale);
    await page.click('.website-selector a[href="https://kitataiwan.com/"]');
    await page.waitForFunction(()=>document.querySelector('.website-preview h3').textContent==='Kita Taiwan');
    await page.click('.website-preview .project-story > summary');
    await page.waitForSelector('dialog[open] .viewer-image img');
    await page.waitForFunction(()=>document.querySelector('dialog[open] .viewer-image img')?.naturalWidth>0);
    assert.equal(await page.$$eval('dialog .availability-note',els=>els.length),0);
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
  }
  await select('en');
  await page.setRequestInterception(true);
  let embeds = 0;
  page.on('request', request => { if(request.url().startsWith('https://www.youtube-nocookie.com/embed/')) {embeds++;request.respond({status:200,contentType:'text/html',body:'<!doctype html><title>Embed transport fixture</title>'});} else request.continue(); });
  for(let index=0;index<4;index++) {
    const link = (await page.$$('.hardware-video'))[index];
    const requested=page.waitForRequest(r=>r.url().startsWith('https://www.youtube-nocookie.com/embed/'));
    await link.click(); await page.waitForSelector('.project-dialog[open] iframe');await requested;
    const src = await page.$eval('iframe',el=>el.src);
    assert(src.startsWith('https://www.youtube-nocookie.com/embed/'));
    assert(!src.includes('autoplay=1'));
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('iframe'));
    assert(await link.evaluate(el=>document.activeElement===el),'Video focus was not restored');
  }
  assert.equal(embeds,4);
  await select('ko'); await page.reload({waitUntil:'networkidle0'});
  await page.waitForFunction(()=>document.documentElement.lang==='ko');
  await page.goto(url+'/resume/',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>document.documentElement.lang==='ko');
  assert(!(await page.$eval('.resume-nav',el=>el.textContent)).includes('Back to portfolio'));
  const scenarios = [
    {preferences:['zh-HK','en'], saved:null,expected:'zh-TW'},
    {preferences:['ja-JP'],saved:'id',expected:'id'},
    {preferences:['fr-FR'],saved:'invalid',expected:'en'},
    {preferences:[null,123],saved:null,expected:'en'},
    {preferences:['ko-KR'],saved:null,expected:'ko'},
    {preferences:['id-ID'],saved:null,expected:'id'},
  ];
  for(const scenario of scenarios) {
    const sample=await browser.newPage();
    await sample.evaluateOnNewDocument(s=>{
      Object.defineProperty(navigator,'languages',{get:()=>s.preferences});
      Object.defineProperty(navigator,'language',{get:()=>s.preferences[0]});
      if(s.saved===null)localStorage.removeItem('ivan-language');else localStorage.setItem('ivan-language',s.saved);
    },scenario);
    await sample.goto(url,{waitUntil:'networkidle0'});
    await sample.waitForFunction(code=>document.documentElement.dataset.hydrated==='true'&&document.documentElement.lang===code,{},scenario.expected);
    await sample.close();
  }
  const failed=await browser.newPage();
  await failed.evaluateOnNewDocument(()=>localStorage.setItem('ivan-language','en'));
  await failed.setRequestInterception(true);
  failed.on('request',r=>/\/assets\/id-/.test(r.url())?r.abort():r.continue());
  await failed.goto(url,{waitUntil:'networkidle0'});
  await failed.waitForFunction(()=>document.documentElement.dataset.hydrated==='true');
  await failed.select('.site-header select','id');
  await failed.waitForSelector('.language-error');
  assert.equal(await failed.evaluate(()=>document.documentElement.lang),'en');
  await failed.close();
  assert.deepEqual(errors,[]);
  await writeFile('.hallmark/reports/locale-checks.json',JSON.stringify({passed:true,layouts:results,checks:['catalog parity and English fallback','locale regional mapping and invalid input','manual persistence and browser detection','20 language/theme layouts','all four employment cases','case study language state','Kita case with real website capture','four lazy privacy-enhanced embeds, unload and focus restore','localized resume','locale download failure recovery'],errors},null,2));
  console.log('Locale and case-study verification passed: five languages, 20 layouts, all cases, video lifecycle, persistence, detection, and failure recovery.');
} finally { await browser.close(); }
