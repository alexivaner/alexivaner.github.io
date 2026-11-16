import { detectLocale, languages, storageKey } from './i18n/locale.mjs';
// The entire UI is React-prerendered. Hydrate after its first paint, or immediately on intent.
let ready;
const start = () => ready ||= import('./hydrate.jsx').then(module => module.hydrate()).then(() => { document.documentElement.dataset.hydrated = 'true'; }).catch(error => { ready = undefined; throw error; });
let desiredLanguage = 'en';
try { const saved=localStorage.getItem(storageKey); desiredLanguage=Object.hasOwn(languages,saved)?saved:detectLocale(navigator.languages); } catch {}
const schedule = () => setTimeout(() => start().catch(() => {}), desiredLanguage === 'en' ? 1300 : 0);
if (document.readyState === 'complete') schedule();
else window.addEventListener('load', schedule, { once: true });
document.addEventListener('pointerdown', () => start().catch(() => {}), { once: true, passive: true });
document.addEventListener('keydown', () => start().catch(() => {}), { once: true });
document.addEventListener('click', async event => {
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const summary = event.target.closest('.project-story > summary, a[data-case-id], a.protected-case-link, .system-selector a');
  if (!summary || document.documentElement.dataset.hydrated) return;
  event.preventDefault();
  summary.setAttribute('aria-busy', 'true');
  try { await start(); summary.removeAttribute('aria-busy'); summary.click(); }
  catch { summary.removeAttribute('aria-busy'); if(summary.tagName === 'SUMMARY')summary.parentElement.open = !summary.parentElement.open;else location.hash=summary.getAttribute('href'); }
});
