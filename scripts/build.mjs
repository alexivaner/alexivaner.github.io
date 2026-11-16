import { prerender } from './prerender.mjs';
import { build } from 'vite';
import { cp, writeFile } from 'node:fs/promises';
await prerender();
await build();
// Keep old public demo URLs and redirect paths. Never bundle any neighbouring repository.
for (const path of ['legacy.html', 'bundle.js', '0.bundle.js', '2.bundle.js', '3.bundle.js', 'bc97afdbe28c4c3da789ce9d3e358a4c.gif', 'kobo-books-summary', 'line', 'simplereact', 'usandb']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
await writeFile('dist/.nojekyll', '');
await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://alexivaner.github.io/sitemap.xml\n');
await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://alexivaner.github.io/</loc></url><url><loc>https://alexivaner.github.io/resume/</loc></url></urlset>');
console.log('Static site built. Existing demos and redirects preserved.');
