import i18n from '../i18n';

export default class Locale extends String {
  constructor(target) {
    const parts = target.split('-');
    parts[0] = parts[0].toLowerCase();
    if (parts.length > 1) parts[1] = parts[1].toUpperCase();
    let lang = parts[0];
    if (!i18n.lang[lang]) throw new Error(`no locale (${target})`);
    target = parts.join('-');
    const locale = i18n.lang[lang].locales.includes(target) ? target : i18n.lang[lang].locales[0];
    super(locale);
    this.iso639 = lang;
    this.iso3166 = this.split('-')[1];
  }
}
