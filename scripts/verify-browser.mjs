import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4175';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
await mkdir('.hallmark/reports', { recursive: true });
const results = [];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydrat|Minified React error|didn.t match/i.test(message.text())) errors.push(message.text()); });
  for (const theme of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const width of [320, 375, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewport({ width, height: width < 768 ? 844 : 900 });
      const response = await page.goto(url, { waitUntil: 'networkidle0' });
      assert([200, 304].includes(response.status()), `Unexpected HTTP status: ${response.status()}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
      // Below-fold images are intentionally lazy. Decode them before checking the complete page.
      await page.evaluate(async () => {
        await Promise.all([...document.images].map(async img => { img.loading = 'eager'; try { await img.decode(); } catch {} }));
      });
      const layout = await page.evaluate(() => {
        const visible = el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
        const images = [...document.images].filter(visible);
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          broken: images.filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
          navHeight: document.querySelector('.site-header').getBoundingClientRect().height,
          heroActionBottom: document.querySelector('.hero-actions').getBoundingClientRect().bottom,
          h1Lines: Math.round(document.querySelector('h1').getBoundingClientRect().height / parseFloat(getComputedStyle(document.querySelector('h1')).lineHeight)),
          background: getComputedStyle(document.body).backgroundColor,
          mode: matchMedia('(prefers-color-scheme: dark)').matches,
        };
      });
      assert.equal(layout.overflow, false, `${theme} ${width}: overflow`);
      assert.deepEqual(layout.broken, [], `${theme} ${width}: broken image`);
      assert(layout.navHeight <= 80);
      if (width >= 1024) { assert(layout.heroActionBottom < 800); assert(layout.h1Lines <= 2); }
      results.push({ theme, width, ...layout });
      if ([375, 1440].includes(width)) await page.screenshot({ path: `.hallmark/reports/${theme}-${width}.png`, fullPage: true });
    }
  }
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  assert(await page.$eval('.hero-product-text', el => el.textContent.includes('Interactive motion study.')), 'Hero must identify the personal motion study');
  assert.equal(await page.$$eval('img[src*="xview-studio"]', els=>els.length),0,'Unapproved employer image must not ship');
  assert.equal(await page.$$eval('.system-selector a', els => els.length), 3);
  assert.equal(await page.$$eval('.research-project-group .research-project', els => els.length), 6);
  await page.click('.system-selector a[href="#system-xview-check"]');
  assert.equal(await page.$eval('.system-detail h3', el => el.textContent), 'System Compatibility Checker');
  await page.click('.system-selector a[href="#system-xview"]');
  await page.click('.website-selector a[href="https://ifeyfilms.com/"]');
  await page.waitForFunction(() => document.querySelector('.website-preview h3').textContent === 'IFEY Films');
  assert.equal(await page.$$eval('.website-selector a', items => items.length), 7);
  assert.equal(await page.$$eval('.hardware-video', items => items.length), 4);
  await page.click('.recognition-details > summary');
  assert.equal(await page.$$eval('.recognition-groups article', items => items.length), 4);
  assert(await page.$eval('.recognition-groups', el => el.textContent.includes('6th of 139 teams') && el.textContent.includes('Finalist')));
  const summary = '.featured-project .project-story > summary';
  await page.click(summary);
  await page.waitForSelector('dialog[open]');
  assert.equal(await page.$eval('#project-dialog-title', el => el.textContent), 'Readmory');
  assert(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), 'Dialog did not receive focus');
  for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
  assert(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), 'Focus escaped modal');
  assert(await page.$eval('[aria-label="Close project"]', el => { const box = el.getBoundingClientRect(); return box.top >= 0 && box.bottom <= innerHeight; }), 'Close control scrolled out of view');
  await page.screenshot({ path: '.hallmark/reports/project-dialog.png' });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('dialog[open]'));
  assert(await page.$eval(summary, el => el === document.activeElement), 'Dialog did not restore focus');
  await page.click('.aegis-project .project-story > summary');
  await page.waitForFunction(() => document.querySelector('dialog').open && document.querySelector('#project-dialog-title').textContent === 'Aegis');
  assert.equal(await page.$eval('dialog', el => el.scrollTop), 0, 'Project did not open at the top');
  await page.click('[aria-label="Close project"]');
  await page.waitForFunction(() => !document.querySelector('dialog[open]'));

  await page.click('.theme-toggle');
  const mode = await page.evaluate(() => document.documentElement.dataset.mode);
  await page.reload({ waitUntil: 'networkidle0' });
  assert.equal(await page.evaluate(() => document.documentElement.dataset.mode), mode, 'Theme did not persist');
  await page.evaluate(() => localStorage.removeItem('ivan-theme'));

  await page.setViewport({ width: 375, height: 844 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.click('.mobile-menu summary');
  assert(await page.$eval('.mobile-menu', el => el.open));
  await page.click('.mobile-menu a[href="#about"]');
  assert.equal(await page.$eval('.mobile-menu', el => el.open), false);
  assert.equal(new URL(page.url()).hash, '#about');

  await page.click('.mobile-menu summary');
  await page.click('.mobile-menu .nav-group:nth-of-type(2) > summary');
  await page.click('.mobile-menu a[href="#publications"]');
  assert.equal(await page.$$eval('.publication', rows => rows.length), 5, 'Publication records missing');
  await page.click('.more-publications > summary');
  assert(await page.$eval('.more-publications', el => el.open), 'Publication disclosure failed');
  assert.equal(await page.$$eval('.patent', cards => cards.length), 2, 'Patent records missing');
  await page.click('.patent details > summary');
  await page.waitForSelector('dialog[open]');
  assert(await page.$eval('#project-dialog-title',el=>el.textContent.includes('Abnormal')), 'Patent case study did not open');
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('dialog[open]'));

  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('clipboard denied'); } }, configurable: true }); });
  await page.click('.copy-email');
  await page.waitForFunction(() => document.querySelector('.copy-status').textContent.includes('Could not copy'));
  assert.equal(await page.$eval('.copy-email', el => el.disabled), false);
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: async value => { window.__copiedEmail = value; } }, configurable: true }); });
  await page.click('.copy-email');
  await page.waitForFunction(() => document.querySelector('.copy-status').textContent.includes('Email address copied'));
  assert.equal(await page.evaluate(() => window.__copiedEmail), 'hutomoivan@gmail.com');

  const noScript = await browser.newPage();
  await noScript.setJavaScriptEnabled(false);
  await noScript.setViewport({ width: 375, height: 844 });
  await noScript.goto(url, { waitUntil: 'networkidle0' });
  assert(await noScript.$eval('h1', el => el.getBoundingClientRect().height > 0));
  await noScript.click(summary);
  assert(await noScript.$eval('.featured-project .project-story', el => el.open), 'Native detail fallback does not work');
  await noScript.click('.mobile-menu summary');
  assert(await noScript.$eval('.mobile-menu', el => el.open), 'No-script navigation failed');

  const early = await browser.newPage();
  await early.goto(url, { waitUntil: 'domcontentloaded' });
  await early.click(summary);
  await early.waitForSelector('dialog[open]');
  assert.equal(await early.$eval('#project-dialog-title', el => el.textContent), 'Readmory', 'First activation was lost during hydration');
  await early.close();

  const fallback = await browser.newPage();
  await fallback.setCacheEnabled(false);
  await fallback.setRequestInterception(true);
  fallback.on('request', request => request.url().includes('/assets/hydrate-') ? request.abort() : request.continue());
  await fallback.goto(url, { waitUntil: 'domcontentloaded' });
  await fallback.click(summary);
  await fallback.waitForFunction(() => document.querySelector('.featured-project .project-story').open);
  assert(await fallback.$eval('.featured-project .story-grid', el => el.getBoundingClientRect().height > 0), 'Static project fallback is unavailable after hydration download failure');
  await fallback.close();

  await page.setViewport({ width: 1100, height: 900 });
  await page.goto(`${url}/resume/`, { waitUntil: 'networkidle0' });
  await page.$eval('.resume-extended',el=>el.open=true);
  await page.pdf({ path: '.hallmark/reports/ivan-surya-hutomo-resume.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  for (const route of ['/legacy.html', '/line/', '/simplereact/', '/usandb/']) {
    const response = await fetch(url + route);
    assert.equal(response.status, 200, `Legacy URL failed: ${route}`);
  }
  assert.deepEqual(errors, [], 'Browser runtime error');
  await writeFile('.hallmark/reports/browser-checks.json', JSON.stringify({ passed: true, layouts: results, checks: ['14 responsive theme layouts', 'hero fold', 'real images', 'dialog focus trap and restore', 'Escape and close buttons', 'theme persistence', 'mobile navigation', 'clipboard failure recovery', 'no-JavaScript content and disclosures', 'first-click hydration', 'hydration download failure fallback', 'five publications and two patents', 'clipboard success and failure', 'resume print', 'legacy URLs'], errors }, null, 2));
  console.log('Browser verification passed: 14 layouts, both themes, modal keyboard behavior, persistence, mobile navigation, failure recovery, no-script fallback, resume, and legacy URLs.');
} finally { await browser.close(); }
