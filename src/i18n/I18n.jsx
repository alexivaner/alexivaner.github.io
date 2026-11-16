import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { detectLocale, languages, storageKey, translate } from './locale.mjs';
const loaders = {
  id: () => import('./locales/id.json'),
  'zh-TW': () => import('./locales/zh-TW.json'),
  ko: () => import('./locales/ko.json'),
  ja: () => import('./locales/ja.json'),
};
const Context = createContext({ locale: 'en', t: text => text, changeLanguage: () => {}, busy: false, error: false });
export function LocaleProvider({ children }) {
  const [state, setState] = useState({ locale: 'en', messages: {} });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const request = useRef(0);
  async function changeLanguage(locale, explicit = true) {
    if (!Object.hasOwn(languages, locale)) return;
    const id = ++request.current; setBusy(true); setError(false);
    try {
      const messages = locale === 'en' ? {} : (await loaders[locale]()).default.messages;
      if (request.current !== id) return;
      setState({ locale, messages });
      if (explicit) try { localStorage.setItem(storageKey, locale); } catch {}
    } catch { if (request.current === id) setError(true); }
    finally { if (request.current === id) setBusy(false); }
  }
  useEffect(() => {
    let saved; try { saved = localStorage.getItem(storageKey); } catch {}
    let preferences = []; try { preferences = Array.isArray(navigator.languages) && navigator.languages.length ? navigator.languages : [navigator.language]; } catch {}
    changeLanguage(Object.hasOwn(languages, saved) ? saved : detectLocale(preferences), false);
    return () => { request.current++; };
  }, []);
  const t = text => translate(text, state.messages);
  useEffect(() => {
    document.documentElement.lang = state.locale;
    document.title = location.pathname.includes('/resume') ? `${t('Resume')} | Ivan Surya Hutomo` : `Ivan Surya Hutomo | ${t('Applied AI & Product Engineering')}`;
    const description = t('End-to-end AI product engineering by Ivan Surya Hutomo. Computer vision, software, research, and independent products.');
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) document.querySelector(selector)?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    let meta = document.querySelector('meta[property="og:locale"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('property', 'og:locale'); document.head.append(meta); }
    meta.content = ({ en: 'en_US', id: 'id_ID', 'zh-TW': 'zh_TW', ko: 'ko_KR', ja: 'ja_JP' })[state.locale];
  }, [state]);
  return <Context.Provider value={{ locale: state.locale, t, changeLanguage, busy, error }}>{children}</Context.Provider>;
}
export const useI18n = () => useContext(Context);
// Translate React text and accessible attributes before rendering, never by mutating the DOM.
// Source English phrases are the catalog keys; technical identifiers and URLs remain intact.
function translateTree(node, t) {
  if (typeof node === 'string') return t(node);
  if (Array.isArray(node)) return node.map(child => translateTree(child, t));
  if (!React.isValidElement(node)) return node;
  const props = {};
  for (const key of ['alt', 'title', 'aria-label', 'placeholder', 'aria-valuetext']) if (typeof node.props[key] === 'string') props[key] = t(node.props[key]);
  if (node.props.children !== undefined) props.children = translateTree(node.props.children, t);
  return React.cloneElement(node, props);
}
export function Localized({ children }) { const { t } = useI18n(); return translateTree(children, t); }
export function LanguageSelector() {
  const { locale, t, changeLanguage, busy, error } = useI18n();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <label className="language-control" hidden={!ready}><span className="visually-hidden">{t('Language')}</span><select aria-label={t('Language')} value={locale} aria-busy={busy || undefined} onChange={event => changeLanguage(event.target.value)}>{Object.entries(languages).map(([code, label]) => <option value={code} key={code} lang={code}>{label}</option>)}</select>{error && <span className="language-error" role="status">{t('Could not load this language. Your current language is still available.')}</span>}</label>;
}
