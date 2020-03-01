import plugins from '../../../temp/plugins';
import i18n from '../i18n';

const DISTRIBUTABLE_EVENTS = ['globalsettingschanged', 'launched', 'error', 'started', 'stopped', 'speak', 'chat', 'voice', 'ccmd', 'vcmd'];
// triggerOne events: settingschanged

const mergeObjects = (...events) => {
  if (!events.length || !events[0]) return;
  const event = events[0];
  events.slice(1).forEach(e => { if (e) Object.assign(event, e); });
};

export default class Plugin {
  constructor(client) {
    this.client = client;
    this.loadPlugins();
  }

  getPlugin(name) {
    return this.pluginMap[name];
  }

  getInvoker(name) {
    const plugin = this.pluginMap[name];
    return plugin ? plugin.$invoker : undefined;
  }

  isWaitWord(text) {
    if (text.length < 2) return true;
    return this.waitWords[this.$.lang].some(ww => {
      if (!ww.plugin.settings.active) return;
      return text.match(ww.word) ? true : false;
    });
  }

  _trigger(invoker, handler, event) {
    invoker.$exec = handler;
    try {
      const promise = invoker.$exec(event || {});
      invoker.$exec = null;
      if (promise instanceof Promise) promise.catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }

  trigger(_name, event, force) {
    const name = `on${_name}`;
    if (!this.eventHandlers[name]) return;
    this.eventHandlers[name].forEach(eh => {
      if (!eh.plugin.settings.active && !force) return;
      this._trigger(eh.plugin.$invoker, eh.handler, event);
    });
  }

  triggerOne(pluginName, eventName, event, force) {
    const plugin = this.pluginMap[pluginName];
    if (!plugin || !plugin.settings.active && !force) return;
    const handler = plugin[`on${eventName}`];
    if (!handler) return;
    this._trigger(plugin.$invoker, handler, event);
  }

  runCommand(event, command, plugin, result) {
    if (result) {
      mergeObjects(event, result);
      mergeObjects(event.result, result);
    }
    return new Promise((resolve, reject) => {
      if (!command) return reject(new Error('no command'));
      plugin.$invoker.$exec = command.handler;
      const promise = plugin.$invoker.$exec(event);
      plugin.$invoker.$exec = null;
      if (promise) {
        promise.then(resolve).catch(reject);
      } else {
        resolve();
      }
    });
  }

  runVoiceCommand(event) {
    let command, plugin, result;
    this.voiceCommands[this.$.lang].some(vc => {
      if (!vc.plugin.settings.active) return;
      if (vc.command.through) {
        vc.plugin.$invoker.$exec = vc.command.through;
        const through = vc.plugin.$invoker.$exec();
        vc.plugin.$invoker.$exec = null;
        if (through) return;
      }
      const m = event.transcript.match(vc.word);
      if (!m) return;
      const options = vc.indexes ? vc.indexes.map(i => m[i]) : m.slice(1);
      result = { lang: vc.lang, options };
      event.result.command = command = vc.command;
      event.result.plugin = plugin = vc.plugin;
      return true;
    });
    return this.runCommand(event, command, plugin, result);
  }

  runChatCommand(event) {
    let command, plugin;
    this.chatCommands.some(cc => {
      if (!cc.plugin.settings.active) return;
      if (cc.command.word.includes(event.command)) {
        event.result.command = command = cc.command;
        event.result.plugin = plugin = cc.plugin;
        return true;
      }
    });
    if (command) {
      try {
        Object.keys(event.options).forEach(key => {
          if (!command.options[key]) throw new Error(`invalid option: ${key}`);
          const option = command.options[key];
          let value = event.options[key];
          switch (option.type) {
            case Number:
              if (value === true || !value.match(/^-?\d+\.?\d*$/)) throw new Error(`invalid option: ${key} must be number`);
              value = value - 0;
              if ((option.min !== undefined && value < option.min) || (option.min !== undefined && value > option.max)) {
                throw new Error(`invalid option: ${key} must be between ${option.min} and ${option.max}`);
              }
              event.options[key] = value;
              break;
            case String:
              if (value === true) throw new Error(`invalid option: ${key} must be string`);
              if ((option.min !== undefined && value.length < option.min) || (option.min !== undefined && value.length > option.max)) {
                throw new Error(`invalid option: ${key} length must be between ${option.min} and ${option.max}`);
              }
              break;
            case Boolean:
              event.options[key] = value === true || value.match(/^(1|true|on)$/i) ? true : false;
              break;
          }
        });
        if (command.options) {
          Object.keys(command.options).forEach(key => {
            if (command.options[key].required && event.options[key] === undefined) {
              throw new Error(`invalid option: ${key} is required`);
            }
          });
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return this.runCommand(event, command, plugin);
  }

  prepareInvoke() {
    this.plugins.forEach(p => {
      if (!p.data) {
        p.data = {};
      } else if (p.data instanceof Function) {
        const temp = {
          $client: this.client,
          $bot: this.client.bot,
          $i18n: this.client.i18n,
          $utils: this.client.utils,
          $logger: this.client.logger,
          $ttss: this.client.ttss,
          $self: p,
          $p: p.settings,
          $u: p.userStore,
          $g: this.$,
          $data: p.data,
        };
        p.data = temp.$data();
      }
      if (!p.methods) p.methods = {};
      p.$invoker = {
        $client: this.client,
        $bot: this.client.bot,
        $i18n: this.client.i18n,
        $utils: this.client.utils,
        $logger: this.client.logger,
        $ttss: this.client.ttss,
        $self: p,
        $r: {},
        $p: p.settings,
        $u: p.userStore,
        $g: this.$,
        $d: p.data,
        $exec: null,
      };
      mergeObjects(p.$invoker, p.methods);
    });
    this.plugins.forEach(p => {
      if (!p.relatedTo) return;
      p.relatedTo.forEach(name => {
        const invoker = this.getInvoker(name);
        if (!invoker) this.trigger('error', { error: new Error(`failed to load ${name} from ${p.name}`) });
        name = name.replace(/^@/, '').replace(/([-_][a-z])/ig, $1 => $1.replace(/[-_]/, '').toUpperCase());
        p.$invoker.$r[name] = invoker;
      });
    });
  }

  loadPlugins() {
    plugins.sort((a, b) => (a.order ? a.order : 0) - (b.order ? b.order : 0));
    this.viewData = {};
    plugins.forEach(p => {
      if (!p.settings) p.settings = {};
      const settings = { active: p.settings.active === false ? false : true };
      delete p.settings.active;
      const forms = { active: { type: 'switch', label: 'Active' } };
      Object.keys(p.settings).forEach(key => {
        const form = { type: 'text', label: key.charAt(0).toUpperCase() + key.slice(1) };
        const org = p.settings[key];
        let value = org;
        if (org instanceof Object) {
          value = org.value;
          if (org.items) {
            if (Array.isArray(org.items)) {
              form.items = org.items;
            } else {
              form.items = Object.keys(org.items).map(key => ({ text: key, value: org.items[key] }));
            }
            form.type = Array.isArray(value) ? 'multi' : 'select';
          } else if (org.type) {
            form.type = org.type;
          }
          form.disable = !!org.disable;
          ['label', 'placeholder', 'icon', 'rules', 'rows', 'counter', 'counterValue'].forEach(key => {
            if (org[key]) form[key] = org[key];
          });
        }
        if (value === true || value === false) {
          form.type = 'switch';
        } else if (typeof value === 'number') {
          form.type = 'slider';
          form.step = org.step;
          if (org.min !== undefined && org.max !== undefined) {
            form.min = org.min;
            form.max = org.max;
          } else {
            form.min = 0;
            form.max = 100;
          }
        }
        forms[key] = form;
        settings[key] = value;
      });
      const langs = [];
      if (p.voiceCommands) {
        p.voiceCommands.forEach(vc => {
          Object.keys(vc.word).forEach(code => {
            if (!langs.includes(code)) langs.push(code);
          });
        });
        langs.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
      }
      p.originalSettings = p.settings;
      p.defaultSettings = Object.assign({}, settings);
      p.settings = settings;
      p.defaultUserStore = p.userStore;
      p.userStore = Object.assign({}, p.userStore);
      p.viewData = {
        name: p.name,
        description: p.description,
        langs: langs,
        forms,
      };
      this.viewData[p.name] = p.viewData;
    });
    this.waitWords = {};
    i18n.list.forEach(l => {
      this.waitWords[l] = [];
      [l, ...i18n.lang[l].fallbacks].forEach(lang => {
        plugins.forEach(p => {
          if (!p.waitWords || !p.waitWords[lang]) return;
          p.waitWords[lang].forEach(w => {
            this.waitWords[l].push({ word: w, plugin: p, lang });
          });
        });
      });
    });
    this.eventHandlers = {};
    const eventNames = DISTRIBUTABLE_EVENTS.map(name => `on${name}`);
    plugins.forEach(p => {
      Object.keys(p).forEach(name => {
        if (!name.startsWith('on')) return;
        if (!eventNames.includes(name)) return;
        if (!this.eventHandlers[name]) this.eventHandlers[name] = [];
        this.eventHandlers[name].push({
          handler: p[name],
          plugin: p,
        });
      });
    });
    this.chatCommands = [];
    plugins.forEach(p => {
      if (!p.chatCommands) return;
      p.chatCommands.forEach(c => {
        this.chatCommands.push({ command: c, plugin: p });
      });
    });
    this.voiceCommands = {};
    i18n.list.forEach(l => {
      this.voiceCommands[l] = [];
      [l, ...i18n.lang[l].fallbacks].forEach(lang => {
        const cmds = [];
        plugins.forEach(p => {
          if (!p.voiceCommands) return;
          p.voiceCommands.forEach(c => {
            let order = p.order || 0;
            if (!c.word[lang]) return;
            if (c.order !== undefined) {
              if (typeof c.order === 'number') {
                order = c.order;
              } else if (c.order[lang] !== undefined) {
                order = c.order[lang];
              }
            }
            c.word[lang].forEach(w => {
              const advanced = Array.isArray(w);
              cmds.push({
                word: advanced ? w[0] : w,
                indexes: advanced ? w.slice(1) : null,
                command: c,
                plugin: p,
                lang,
                order,
              });
            });
          });
        });
        cmds.sort((a, b) => a.order - b.order);
        this.voiceCommands[l].push(...cmds);
      });
    });
    this.pluginMap = {};
    plugins.forEach(p => this.pluginMap[p.name] = p);
    this.plugins = plugins;
  }

  getDuplicated() {
    const dups = [];
    const map = {};
    this.plugins.forEach(p => {
      if (map[p.name]) {
        dups.push(p);
        return;
      }
      map[p.name] = true;
    });
    return dups;
  }
}
