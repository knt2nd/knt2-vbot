export default {
  name: '@speech',
  description: 'TTS control commands',
  order: 18421,
  chatCommands: [
    {
      name: 'change-options',
      word: ['s', 'speech'],
      options: {
        tts:    { type: String, min: 2, max: 5, eg: 'en, zh-TW' },
        rate:   { type: Number, min: 0, max: 100 },
        pitch:  { type: Number, min: 0, max: 100 },
        volume: { type: Number, min: 1, max: 100 },
      },
      handler: function(e) {
        if (!Object.keys(e.options).length) throw new Error('no option');
        if (!e.transcript) throw new Error('no message');
        if (e.options.rate !== undefined) e.result.tts.rate = e.options.rate;
        if (e.options.pitch !== undefined) e.result.tts.pitch = e.options.pitch;
        if (e.options.volume !== undefined) e.result.tts.volume = e.options.volume;
        if (e.options.tts !== undefined) {
          const locale = this.$utils.toLocale(e.options.tts);
          const engine = this.$ttss.getByLocale(locale);
          if (!engine) throw new Error('no TTS engine');
          const lang = locale.iso639;
          if (lang !== this.$g.lang && this.$i18n.lang[lang]) e.result.format = this.$i18n.lang[lang].formatChat;
          e.result.tts.engine = engine;
        }
      },
    },
    {
      name: 'cancel',
      word: ['q', 'quiet'],
      handler: function(e) {
        e.result.speak = false;
        this.$bot.tts.cancel();
      },
    },
    {
      name: 'get-info',
      word: ['s-get'],
      handler: function(e) {
        e.result.sound = false;
        e.result.speak = false;
        const engine = this.$g.engine[this.$g.lang].tts;
        let text = '';
        text += '[Current TTS Engine]\n';
        text += `${engine.locale} ${engine.name}\n\n`;
        text += '[Current TTS Settings]\n';
        text += `Rate:   ${this.$g.tts.rate}\n`;
        text += `Pitch:  ${this.$g.tts.pitch}\n`;
        text += `Volume: ${this.$g.tts.volume}\n\n`;
        text += '[Available Engines]\n';
        text += `${this.$ttss.locales.join(', ')}\n`;
        return e.message.reply(text);
      },
    },
  ],
  voiceCommands: [
    {
      name: 'cancel',
      word: {
        en: [/(quiet|shut.*up)/i],
        es: [/(cállate|silencio)/i],
        de: [/(ruhig|halt)/i],
        nl: [/(wees stil|hou je mond)/i],
        fr: [/(soyez silencieux|tais.?toi)/i],
        it: [/(silenzio|sta.*zitto)/i],
        ru: [/(не шуми|заткнись)/i],
        ko: [/(조용히|닥쳐)/],
        zh: [/(安[静靜]|[闭閉]嘴)/],
        ja: [/(静かに|だまって|黙って|だま[れり]|黙[れり])/],
      },
      through: function() { return !this.$bot.tts.isSpeaking(); },
      handler: function(e) {
        this.$bot.tts.cancel();
      },
    },
  ],
};
