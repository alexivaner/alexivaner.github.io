import { build } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export async function prerender() {
  await build({ build: { ssr: 'src/entry-server.jsx', outDir: '.prerender', emptyOutDir: true, rollupOptions: { input: 'src/entry-server.jsx', output: { entryFileNames: 'entry-server.mjs' } } }, logLevel: 'warn' });
  const { render } = await import(`${pathToFileURL(resolve('.prerender/entry-server.mjs')).href}?v=${Date.now()}`);
  await mkdir('resume', { recursive: true });
  for (const [page, template, output] of [['portfolio', 'src/templates/index.html', 'index.html'], ['resume', 'src/templates/resume.html', 'resume/index.html']]) {
    const html = await readFile(template, 'utf8');
    await writeFile(output, html.replace('<!-- react-html -->', render(page)));
  }
  console.log('Prerendered the complete React portfolio and resume.');
}
