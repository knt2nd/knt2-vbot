export default {
  name: '@system',
  description: 'System configuration commands',
  order: 18431,
  methods: {
    getSettings: function() {
      const lang = this.$g.lang;
      const langs = [...this.$i18n.list].sort();
      const langsWithVcmd = langs.filter(l => this.$client.plugin.voiceCommands[l].length);
      const langsWithoutVcmd = langs.filter(l => !this.$client.plugin.voiceCommands[l].length);
      let langList = langsWithVcmd.join(', ');
      if (langsWithoutVcmd.length) langList += ` (${langsWithoutVcmd.join(', ')})`;
      const ttsEngines = { main: [], sub: []};
      this.$ttss.locales.forEach(l => ttsEngines[l.split('-')[0] === lang ? 'main' : 'sub'].push(l));
      let ttsList = ttsEngines.main.join(', ');
      if (ttsEngines.sub.length) ttsList += ` (${ttsEngines.sub.join(', ')})`;
      return `[Current Settings]
Lang: ${lang} ${this.$i18n.lang[lang].name}
STT:
  Engine: ${this.$g.engine[lang].stt} ${this.$i18n.lang[lang].stt.engines[this.$g.engine[lang].stt]}
TTS:
  Engine: ${this.$g.engine[lang].tts.locale} ${this.$g.engine[lang].tts.name}
  Rate:   ${this.$g.tts.rate}
  Pitch:  ${this.$g.tts.pitch}
  Volume: ${this.$g.tts.volume}
SE:
  Volume: ${this.$g.se.volume}

[Available Engines for ${lang}]
STT: ${Object.keys(this.$i18n.lang[lang].stt.engines).join(', ')}
TTS: ${ttsList}

[Available Languages]
${langList}`;
    },
  },
  chatCommands: [
    {
      name: 'get-settings',
      word: ['sys-get'],
      handler: function(e) {
        e.result.sound = false;
        e.result.speak = false;
        return e.message.reply(this.getSettings());
      },
    },
    {
      name: 'set-settings',
      word: ['sys-set'],
      options: {
        lang:   { type: String, min: 2, max: 2,  eg: 'en, zh' },
        stt:    { type: String, min: 5, max: 11, eg: 'en-US, zh-TW, yue-Hant-HK' },
        tts:    { type: String, min: 2, max: 5,  eg: 'en, zh-TW' },
        rate:   { type: Number, min: 0, max: 100 },
        pitch:  { type: Number, min: 0, max: 100 },
        volume: { type: Number, min: 0, max: 100 },
        se:     { type: Number, min: 0, max: 100 },
      },
      handler: async function(e) {
        if (!Object.keys(e.options).length) throw new Error('no option');
        e.result.speak = false;
        e.result.sound = false;
        let sttRestart = false;
        if (e.options.lang !== undefined) {
          const lang = this.$utils.correctLocale(e.options.lang);
          if (this.$i18n.lang[lang]) {
            this.$g.lang = lang;
            sttRestart = true;
          } else {
            throw new Error('no language');
          }
        }
        if (e.options.stt !== undefined) {
          const sttLocale = e.options.stt.length === 5 ? this.$utils.correctLocale(e.options.stt) : e.options.stt;
          let sttEngine;
          if (this.$i18n.lang[this.$g.lang].stt.engines[sttLocale]) {
            sttEngine = sttLocale;
          } else {
            sttEngine = this.$i18n.lang[this.$g.lang].stt.locales[sttLocale];
          }
          if (sttEngine) {
            this.$g.engine[this.$g.lang].stt = sttEngine;
            sttRestart = true;
          } else {
            throw new Error('no STT engine');
          }
        }
        if (e.options.tts !== undefined) {
          const ttsEngine = this.$ttss.getByLocale(this.$utils.toLocale(e.options.tts));
          if (ttsEngine) {
            this.$g.engine[this.$g.lang].tts = ttsEngine;
          } else {
            throw new Error('no TTS engine');
          }
        }
        if (e.options.rate !== undefined) this.$g.tts.rate = e.options.rate;
        if (e.options.pitch !== undefined) this.$g.tts.pitch = e.options.pitch;
        if (e.options.volume !== undefined) this.$g.tts.volume = e.options.volume;
        if (e.options.se !== undefined) this.$g.se.volume = e.options.se;
        if (!sttRestart) {
          this.$bot.se.play('notice');
          return e.message.reply(this.getSettings());
        }
        await this.$bot.stt.stop();
        await this.$bot.stt.start();
        this.$bot.se.play('notice');
        return e.message.reply(this.getSettings());
      },
    },
  ],
};
