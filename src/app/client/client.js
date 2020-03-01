import TTSEngines from './ttss';
import Logger from './logger';
import Settings from './settings';
import Plugin from './plugin';
import Help from './Help';
import Bot from '../bot';
import View from '../view';
import utils from './utils';
import env from './env';
import i18n from '../i18n';

const BOT_EVENTS = ['error', 'started', 'stopped', 'speak', 'chat', 'voice', 'ccmd', 'vcmd'];

export default class Client {
  constructor(browser) {
    this.utils = utils;
    this.env = env;
    this.i18n = i18n;
    this.status = { starting: false, running: false, resetting: false };
    this.locales = [];
    browser.locales.forEach(lc => {
      try {
        this.locales.push(this.utils.toLocale(lc));
      } catch (e) {
        console.error(e);
      }
    });
    this.locale = this.locales[0] || this.utils.toLocale(this.i18n.default);
    this.ttss = new TTSEngines(browser.voices);
    this.logger = new Logger();
    this.settings = new Settings(this.env.mode);
    this.plugin = new Plugin(this);
    this.help = new Help(this.i18n, this.plugin);
    this.bot = new Bot(this);
    this.settings.bind(this, this.plugin);
    this.loadSettings();
    this.plugin.prepareInvoke();
    this.view = View.create(this);
    BOT_EVENTS.forEach(name => this.bot.on(name, (...args) => this.plugin.trigger(name, ...args)));
    if (this.env.intro) this.env.intro.forEach(i => this.logger.info(i));
    this.plugin.trigger('launched', null, true);
    const dupPlugins = this.plugin.getDuplicated();
    if (dupPlugins.length) {
      const error = new Error(`duplicated plugin(s): ${dupPlugins.map(p => p.name).join(', ')}`);
      this.plugin.trigger('error', { error }, true);
    }
    if (this.env.autostart) this.startBot();
  }

  destroy() {
    if (!this.status.resetting) this.settings.save();
  }

  resetAll() {
    this.status.resetting = true;
    this.settings.clear();
    window.location.reload();
  }

  startBot() {
    if (this.status.starting || this.status.running) return;
    this.status.starting = true;
    this.status.running = true;
    this.bot.start(success => {
      this.status.starting = false;
      this.status.running = success;
    });
  }

  stopBot() {
    if (this.status.starting || !this.status.running) return;
    this.bot.stop(() => {
      this.status.starting = false;
      this.status.running = false;
    });
  }

  restartSTT() {
    if (this.status.starting || !this.status.running) return;
    this.bot.stt.stop()
      .then(() => this.bot.stt.start())
      .catch(() => this.stopBot());
  }

  cancelTTS() {
    this.bot.tts.cancel();
  }

  sampleTTS() {
    this.bot.tts.cancel(() => {
      let sample = this.i18n.lang[this.$.lang].sample;
      if (sample instanceof Function) sample = sample();
      this.bot.tts.speak(sample, true);
    });
  }

  sampleSE() {
    this.bot.se.play('success');
  }

  downloadLog() {
    const file = this.logger.getFile();
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file.content));
    el.setAttribute('download', file.name);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    this.logger.clear();
  }

  getHelp(lang) {
    return this.help.get(lang);
  }

  loadSettings() {
    const data = {
      version: 1,
      lang: this.locale.iso639,
      engine: {},
      tts: {
        volume: 50,
        pitch: 50,
        rate: 50,
      },
      se: {
        volume: 50,
      },
      command: {
        voice: true,
        chat: true,
      },
      chat: {
        speech: true,
        key: '',
      },
      ui: {
        dark: true,
        open: [0],
        favs: [],
      },
      plugin: {},
    };
    this.locales.forEach(lc => {
      if (this.i18n.list.includes(lc.iso639) && !data.ui.favs.includes(lc.iso639)) {
        data.ui.favs.push(lc.iso639);
      }
    });
    this.i18n.list.forEach(lang => {
      const locale = lang === this.locale.iso639 ? this.locale : this.i18n.lang[lang].locales[0];
      data.engine[lang] = { stt: this.i18n.lang[lang].stt.locales[locale], tts: '' };
    });
    this.plugin.plugins.forEach(p => {
      data.plugin[p.name] = {
        settings: p.settings,
        user: p.userStore,
      };
    });
    this.settings.set(data);
    this.settings.merge(this.env.settings.default);
    this.settings.load();
    this.settings.merge(this.env.settings.constant);
    if (!this.i18n.lang[this.settings.data.lang]) this.settings.data.lang = this.i18n.default;
    this.i18n.list.forEach(lang => {
      let engine;
      const uri = this.settings.data.engine[lang].tts;
      if (uri) engine = this.ttss.getByURI(uri);
      if (!engine) engine = this.ttss.getByLocale(lang === this.locale.iso639 ? this.locale : lang);
      if (!engine) engine = this.ttss.getByLocale(this.i18n.default);
      this.settings.data.engine[lang].tts = engine;
    });
  }
}
