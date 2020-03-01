import langs from './langs';

const BUFFER_WAIT = 1000;
const BUFFER_LENGTH_DEFAULT = 300;
const BUFFER_LENGTH = {
  ja: 150,
  zh: 150,
  ko: 150,
};

export default {
  name: '@rtt',
  description: 'Realtime translator',
  order: 18440,
  relatedTo: ['@gct'],
  settings: {
    active: false,
    speech: false,
    language: { value: 'ja', items: langs, icon: 'mdi-translate' },
  },
  data: {
    buffer: [],
    bufTimer: null,
  },
  methods: {
    refreshLangs: function() {
      const favMap = {};
      this.$g.ui.favs.forEach((code, i) => favMap[code] = i);
      this.$self.viewData.forms.language.items.sort((a, b) => {
        const ac = a.value.split('-')[0];
        const bc = b.value.split('-')[0];
        if (favMap[ac] === undefined && favMap[bc] === undefined) {
          if (a.text < b.text) return -1;
          if (a.text > b.text) return 1;
          return 0;
        }
        if (favMap[ac] !== undefined && favMap[bc] !== undefined) return favMap[ac] - favMap[bc];
        if (favMap[ac] !== undefined) return -1;
        return 1;
      });
      this.$self.viewData.forms.language.items.forEach(item => {
        item.text = item.text.replace(/^★ /, '');
        if (favMap[item.value.split('-')[0]] !== undefined) item.text = `★ ${item.text}`;
      });
    },
    run: async function(transcript, format) {
      if (!this.$r.gct || !this.$p.language) return;
      if (this.$p.language.split('-')[0] === this.$g.lang) return;
      if (!transcript) return;
      let res;
      try {
        res = await this.$r.gct.translate({ target: this.$p.language, q: transcript });
      } catch (e) {
        this.$logger.warn(`RTT: ${e.message}`);
        return;
      }
      const text = format ? format(res.text) : res.text;
      this.$logger.info(`RTT: ${text}`, 'success');
      if (!this.$p.speech) return;
      let engine = this.$ttss.getByLocale(this.$p.language);
      if (!engine) engine = this.$ttss.getByLocale(this.$i18n.default);
      this.$bot.tts.speak(text, { engine });
    },
  },
  onglobalsettingschanged: function(e) {
    if (e.key !== 'ui.favs') return;
    this.refreshLangs();
  },
  onlaunched: function(e) {
    this.refreshLangs();
  },
  onvoice: function(e) {
    clearTimeout(this.$d.bufTimer);
    if (!e.isFinal) return;
    this.$d.buffer.push(e.transcript);
    const run = () => {
      this.run(this.$d.buffer.join(' ')).catch(console.error);
      this.$d.buffer = [];
    };
    const limit = BUFFER_LENGTH[this.$g.lang] || BUFFER_LENGTH_DEFAULT;
    const length = this.$d.buffer.map(t => t.length).reduce((sum, n) => sum + n);
    if (length > limit) {
      run();
    } else {
      this.$d.bufTimer = setTimeout(run, BUFFER_WAIT);
    }
  },
  onchat: function(e) {
    const format = (name, message) => `${name}: ${message}`;
    this.run(e.transcript, transcript => format(e.username, transcript)).catch(console.error);
  },
};
