class TTSEngine {
  constructor(engine) {
    this.$original = engine;
    this.locale = engine.lang;
    this.name = engine.name;
    this.uri = engine.voiceURI;
  }

  toOriginal() {
    return this.$original;
  }

  toString() {
    return this.uri;
  }

  toJSON() {
    return this.uri;
  }
}

export default class TTSEngines {
  constructor(engines) {
    this.data = engines.map(v => new TTSEngine(v)).sort((a, b) => {
      const ag = a.uri.startsWith('Google');
      const bg = b.uri.startsWith('Google');
      if (ag && !bg) return -1;
      if (!ag && bg) return 1;
      return 0;
    });
    this.uriMap = {};
    this.localeMap = {};
    this.locales = [];
    this.data.forEach(v => {
      this.uriMap[v.uri] = v;
      if (!this.localeMap[v.locale]) {
        this.localeMap[v.locale] = v;
        this.locales.push(v.locale);
      }
      const langCode = v.locale.split('-')[0];
      if (!this.localeMap[langCode]) this.localeMap[langCode] = v;
    });
  }

  getByURI(uri) {
    return this.uriMap[uri];
  }

  getByLocale(locale) {
    if (this.localeMap[locale]) return this.localeMap[locale];
    return this.localeMap[locale.split('-')[0]];
  }
}
