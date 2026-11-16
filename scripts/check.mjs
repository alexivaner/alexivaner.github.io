import { readFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
const html = await readFile('index.html', 'utf8');
const data = JSON.parse(await readFile('content/portfolio.json', 'utf8'));
assert(!/[—–]/.test(html.replace(/<script[\s\S]*?<\/script>/g, '')), 'Page contains a banned dash');
assert(html.includes('lang="en"') && html.includes('name="description"'), 'Metadata missing');
const idList=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
const ids=new Set(idList);
assert.equal(ids.size,idList.length,'Duplicate document ID');
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.has(match[1]), `Missing anchor: ${match[1]}`);
for (const match of html.matchAll(/(?:src|href)="(\/?(?:assets|styles|src|resume)[^"?#]*)"/g)) await stat(match[1].replace(/^\/assets\//, 'public/assets/').replace(/^\//, ''));
for (const p of data.projects) await stat('public/' + p.image.replace(/^\//, ''));
assert.equal(data.patents.length, 2, 'Both supplied patents must be present');
assert(data.publications.some(p => p.href.includes('10002823')), 'Elevator paper missing');
assert(data.publications.some(p => p.href.includes('20308')), 'Smart-door paper missing');
assert(!data.publications.some(p => p.href.includes('linkedin.com/safety')), 'Use direct publisher URLs');
assert.equal(data.websites.length, 7, 'All supplied website projects must be present');
assert.equal(data.hardware.length, 4, 'All four supplied videos must be present');
assert(data.certifications.some(item => item.href.includes('VK669GW8XFVC')), 'Google credential missing');
assert.equal(data.recognition.length, 4, 'Competition distinctions missing');
assert(!html.includes('signal-structure'), 'Retired abstract cover still appears');
assert.equal(data.experience[0].area, 'IdeasLab / XView', 'Employer attribution missing');
for (const item of [...data.websites, ...data.hardware]) if (item.image) await stat('public/' + item.image);
for (const path of ['legacy.html', 'kobo-books-summary/index.html', 'line/index.html', 'simplereact/index.html', 'usandb/index.html']) await stat(path);
for (const path of ['styles/main.css', 'styles/viewer.css']) {
  const css = await readFile(path, 'utf8');
  assert(!/transition:\s*all/.test(css), `Unbounded transition: ${path}`);
  assert(css.includes('prefers-reduced-motion'), `Missing reduced motion: ${path}`);
}
console.log('Content, internal destinations, local assets, legacy paths, and motion checks passed.');

const work=JSON.parse(await readFile('content/work.json','utf8'));
assert.equal(work.engineering.length,3,'Studio and web must share one flagship case');
assert(!JSON.stringify(work).match(/venus3d|nobbytech/i),'Partner identity must be anonymized');
assert(!html.includes('xview-studio.webp'),'Unapproved employer image referenced');
const ghi=data.websites.find(item=>item.id==='ghi');
assert(ghi.image,'Authentic GHI capture missing');
for(const name of ['pose-2d','pose-converted','pose-3d','tsp-15','tsp-42','zero-demo','traffic-models','traffic-workflow','traffic-results','shopee-model']) await stat(`public/assets/images/research/${name}.webp`);
