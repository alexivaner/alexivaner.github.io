export const languages = { en: 'English', id: 'Bahasa Indonesia', 'zh-TW': '繁體中文', ko: '한국어', ja: '日本語' };
export const storageKey = 'ivan-language';
export function matchLocale(value) {
  if (typeof value !== 'string') return null;
  const code = value.trim().replaceAll('_', '-').toLowerCase();
  if (/^en(?:-|$)/.test(code)) return 'en';
  if (/^id(?:-|$)/.test(code)) return 'id';
  if (/^ja(?:-|$)/.test(code)) return 'ja';
  if (/^ko(?:-|$)/.test(code)) return 'ko';
  if (/^zh-(?:tw|hk|mo|hant)(?:-|$)/.test(code)) return 'zh-TW';
  return null;
}
export function detectLocale(preferences) {
  if (!Array.isArray(preferences)) return 'en';
  for (const preference of preferences) { const locale = matchLocale(preference); if (locale) return locale; }
  return 'en';
}
export function translate(message, messages = {}) {
  if (typeof message !== 'string' || !message.trim()) return message;
  const key = message.trim();
  return Object.hasOwn(messages, key) && typeof messages[key] === 'string' ? message.replace(key, messages[key]) : message;
}
