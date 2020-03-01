export default {
  name: '@help',
  description: 'Help command',
  order: 18430,
  chatCommands: [
    {
      name: 'get',
      word: ['h', 'help'],
      options: {
        lang: { type: String, min: 2, max: 2, eg: 'en, zh' },
      },
      handler: function(e) {
        e.result.speak = false;
        e.result.sound = false;
        let lang = this.$g.lang;
        let header = '';
        if (e.options.lang !== undefined) {
          const targetLang = e.options.lang.toLowerCase();
          if (!this.$i18n.list.includes(targetLang)) throw new Error('no language');
          lang = targetLang;
          header = `${this.$i18n.lang[lang].name} Help\n\n`;
        }
        const help = this.$client.getHelp(lang);
        return e.message.reply(header + help);
      },
    },
  ],
};
