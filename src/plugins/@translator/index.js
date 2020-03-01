import langs from './langs';

const DELIMITER = '[\\s,.，．、。　]';
const FIRST_WORD = {
  en: `translate(${DELIMITER}+\\S+){0,5} (${langs.en.list.join('|')})`,
  es: `traducir\\w*(${DELIMITER}+\\S+){0,5} (${langs.es.list.join('|')})`,
  de: `übersetzen(${DELIMITER}+\\S+){0,5} (${langs.de.list.join('|')})(e|en)?`,
  nl: `vertalen(${DELIMITER}+\\S+){0,5} (${langs.nl.list.join('|')})`,
  fr: `tradui\\w*(${DELIMITER}+\\S+){0,5} (${langs.fr.list.join('|')})e?`,
  it: `traduci(${DELIMITER}+\\S+){0,5} (${langs.it.list.join('|')})`,
  ru: `перевести(${DELIMITER}+\\S+){0,5} (${langs.ru.list.join('|')})`,
  ko: `(${langs.ko.list.join('|')})어.{0,10}번역\\s*(해라|주세요)?`,
  zh: `翻[译譯].{0,10}(${langs.zh.list.join('|')})[语語文]`,
  ja: `(${langs.ja.list.join('|')})語.{0,10}翻訳(して)?`,
};

export default {
  name: '@translator',
  description: 'Translation commands',
  order: 18410,
  relatedTo: ['@gct'],
  waitWords: {
    en: [new RegExp(`^${FIRST_WORD.en}$`, 'i')],
    es: [new RegExp(`^${FIRST_WORD.es}$`, 'i')],
    de: [new RegExp(`^${FIRST_WORD.de}$`, 'i')],
    nl: [new RegExp(`^${FIRST_WORD.nl}$`, 'i')],
    fr: [new RegExp(`^${FIRST_WORD.fr}$`, 'i')],
    it: [new RegExp(`^${FIRST_WORD.it}$`, 'i')],
    ru: [new RegExp(`^${FIRST_WORD.ru}$`, 'i')],
    ko: [new RegExp(`^${FIRST_WORD.ko}$`)],
    zh: [new RegExp(`^${FIRST_WORD.zh}$`)],
    ja: [new RegExp(`^${FIRST_WORD.ja}$`)],
  },
  chatCommands: [
    {
      name: 'translate',
      word: ['t', 'translate'],
      options: {
        to: { type: String, min: 2, max: 5, eg: 'en, zh-TW' },
      },
      handler: async function(e) {
        if (!this.$r.gct) throw new Error('no gct');
        if (!e.transcript) throw new Error('nothing to translate');
        let trLang = this.$g.lang;
        let toCode = trLang.split('-')[0];
        let ttsEngine;
        if (e.options.to) {
          const toLocale = this.$utils.correctLocale(e.options.to);
          toCode = toLocale.split('-')[0];
          if (toLocale.length === 2) {
            if (this.$g.engine[toCode]) ttsEngine = this.$g.engine[toCode].tts;
            trLang = toLocale;
          } else {
            trLang = (toLocale === 'zh-TW' || toLocale === 'zh-HK') ? 'zh-TW' : toCode;
            ttsEngine = this.$ttss.getByLocale(toLocale);
          }
          if (!ttsEngine) ttsEngine = this.$ttss.getByLocale(this.$i18n.default);
        }
        if (ttsEngine) {
          e.result.tts.engine = ttsEngine;
          if (this.$i18n.lang[toCode]) {
            e.result.format = this.$i18n.lang[toCode].formatChat;
          }
        }
        const res = await this.$r.gct.translate({ target: trLang, q: e.transcript });
        e.result.transcript = res.text;
        e.message.reply(res.text).catch(console.error);
      },
    },
  ],
  voiceCommands: [
    {
      name: 'translate',
      word: {
        en: [[new RegExp(`${FIRST_WORD.en}${DELIMITER}*(.*)`, 'i'), 2, 3]],
        es: [[new RegExp(`${FIRST_WORD.es}${DELIMITER}*(.*)`, 'i'), 2, 3]],
        de: [[new RegExp(`${FIRST_WORD.de}${DELIMITER}*(.*)`, 'i'), 2, 4]],
        nl: [[new RegExp(`${FIRST_WORD.nl}${DELIMITER}*(.*)`, 'i'), 2, 3]],
        fr: [[new RegExp(`${FIRST_WORD.fr}${DELIMITER}*(.*)`, 'i'), 2, 3]],
        it: [[new RegExp(`${FIRST_WORD.it}${DELIMITER}*(.*)`, 'i'), 2, 3]],
        ru: [[new RegExp(`${FIRST_WORD.ru}${DELIMITER}*(.*)`, 'i'), 2, 3]],
        ko: [[new RegExp(`${FIRST_WORD.ko}${DELIMITER}*(.*)`), 1, 3]],
        zh: [new RegExp(`${FIRST_WORD.zh}${DELIMITER}*(.*)`)],
        ja: [[new RegExp(`${FIRST_WORD.ja}${DELIMITER}*(.*)`), 1, 3]],
      },
      handler: async function(e) {
        if (!this.$r.gct) throw new Error('no gct');
        if (!e.options[1]) throw new Error('nothing to translate');
        if (!langs[e.lang]) throw new Error('no language map');
        const toLocale = langs[e.lang].map[[e.options[0].toLowerCase()]];
        if (!toLocale) throw new Error('no language');
        const trLang = (toLocale === 'zh-TW' || toLocale === 'zh-HK') ? 'zh-TW' : toLocale.split('-')[0];
        const engine = this.$g.engine[trLang] ? this.$g.engine[trLang].tts : this.$ttss.getByLocale(toLocale);
        const res = await this.$r.gct.translate({ target: trLang, q: e.options[1] });
        e.ok();
        this.$bot.tts.speak(res.text, { engine });
      },
    },
  ],
};
