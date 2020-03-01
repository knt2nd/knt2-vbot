/*

[Dependencies]
Plugin can use npm packages the app has, such as axios, moment.
Moreover, plugin can have its own npm packages. See @player plugin.

[UI references]
Vue: https://vuejs.org/
Vuetify: https://vuetifyjs.com/
Icons: https://materialdesignicons.com/
And don't forget about light/dark themes!

[Shortcuts in event handlers and commands]
this.$client
this.$bot
this.$i18n
this.$utils
this.$logger
this.$ttss = TTS engines
this.$self = Plugin itself
this.$r    = Related plugins
this.$g    = Global settings
this.$p    = Plugin settings
this.$u    = Plugin user store
this.$d    = Plugin data

[Shortcuts in Vue templates]
g = Global settings
p = Plugin settings
u = Plugin user store
d = Plugin data

 */




import UI from './ui.vue';

export default {

  /*
   Metadata
   */

  // Plugin name should be kebab-case and start with alphabet, '@' is reserved by builtin plugins
  name: 'example',

  // Plugin description for settings UI
  description: 'Plugin example',

  // Plugin order for settings UI and commands, 18400-18499 are reserved by builtin plugins
  order: 1,

  // Related plugins, e.g. ['@cse', 'some-other-plugin'] -> this.$r.cse, this.$r.someOtherPlugin
  relatedTo: [],




  /*
   UI - Vue component (template and style only)
   */

  ui: UI,




  /*
   Data
   */

  // Plugin settings will be displayed at the drawer menu and saved to localStorage automatically
  settings: {
    // active: false, // 'active' is reserved but you can change the default value to false
    bool: true,
    boolOptions: {
      value: true,
      icon: 'mdi-flag',
    },
    number: 50, // Default: min 0, max 100
    numberOptions: {
      value: 500,
      min: 100,
      max: 1000,
      step: 100,
      icon: 'mdi-numeric',
    },
    text: 'some text',
    textOptions: {
      value: '',
      placeholder: 'Type something here',
      icon: 'mdi-text',
      counter: 100,
      counterValue: value => value.length - 10,
      rules: [value=> !!value || 'Required'],
    },
    password: {
      type: 'password',
      value: 'some password',
    },
    passwordOptions: {
      type: 'password',
      value: 'some password',
      placeholder: 'Type something here',
      icon: 'mdi-textbox-password',
      counter: 100,
      counterValue: value => value.length - 10,
      rules: [value=> !!value || 'Required'],
    },
    textarea: {
      type: 'textarea',
      value: 'some text',
    },
    textareaOptions: {
      type: 'textarea',
      value: 'some text',
      rows: 3,
      placeholder: 'Type something here',
      icon: 'mdi-text',
      counter: 100,
      counterValue: value => value.length - 10,
      rules: [value=> !!value || 'Required'],
    },
    select: {
      value: 'a',
      items: ['a', 'b', 'c'],
    },
    selectOptions: {
      value: 'a',
      items: {
        aaa: 'a',
        bbb: 'b',
        ccc: 'c',
      },
      icon: 'mdi-view-list',
    },
    multiSelect: {
      value: ['a', 'b'],
      items: ['a', 'b', 'c'],
    },
    multiSelectOptions: {
      value: ['a', 'b'],
      items: {
        aaa: 'a',
        bbb: 'b',
        ccc: 'c',
      },
      icon: 'mdi-format-list-checkbox',
      rules: [value=> !!value.length || 'Required'],
    },
    differentLabel: {
      value: 'some text',
      label: 'THIS IS NOT KEY NAME', // available for all types
    },
    disableWhileRunning: {
      value: 'some text',
      disable: true, // available for all types
    },
  },

  // Plugin user store will be saved to localStorage automatically
  userStore: {
    favs: ['apple'],
  },

  // Plugin data
  data: {
    counter: 0,
    ws: null,
  },
  // Function available
  // data: function() {
  //   return {
  //     status: this.$client.status,
  //   };
  // },




  /*
   Method - available in event handlers, commands, and Vue templates
   */

  methods: {
    clearFavs: function() {
      this.$u.favs.splice(0);
    },
    countUp: function() {
      this.$d.counter++;
    },
    send: function(message) {
      if (this.$d.ws.readyState !== WebSocket.OPEN) return;
      this.$d.ws.send(`Ping: ${message}`);
    },
  },




  /*
   Event handlers
   */

  // Fires when global settings changed
  // Conditions: always
  onglobalsettingschanged: function(e) {
    console.log('onglobalsettingschanged', e, this);
  },

  // Fires when plugin settings changed
  // Conditions: always, plugin itself only
  onsettingschanged: function(e) {
    console.log('onsettingschanged', e, this);
  },

  // Fires when client launched
  // Conditions: always, once
  onlaunched: function(e) {
    console.log('onlaunched', e, this);
    this.$d.ws = new WebSocket('ws://localhost:18400');
    this.$d.ws.onmessage = e => {
      this.$logger.info(`WS: ${e.data}`, 'success');
    };
  },

  // Fires when error occurred
  // Conditions: always
  onerror: function(e) {
    console.log('onerror', e, this);
  },

  // Fires when bot started
  // Conditions: always
  onstarted: function(e) {
    console.log('onstarted', e, this);
  },

  // Fires when bot stopped
  // Conditions: always
  onstopped: function(e) {
    console.log('onstopped', e, this);
  },

  // Fires when bot speaks
  // Conditions: active=true
  onspeak: function(e) {
    console.log('onspeak', e, this);
  },

  // Fires when chat message received
  // Conditions: active=true
  onchat: function(e) {
    console.log('onchat', e, this);
    this.send(`Chat: ${e.transcript}`);
  },

  // Fires when speech recognition reacts
  // Conditions: active=true
  onvoice: function(e) {
    if (!e.isFinal) return; // to ignore interim results
    console.log('onvoice', e, this);
    this.send(`Voice: ${e.transcript}`);
  },

  // Fires when chat command activated
  // Conditions: active=true
  onccmd: function(e) {
    console.log('onccmd', e, this);
  },

  // Fires when voice command activated
  // Conditions: active=true
  onvcmd: function(e) {
    console.log('onvcmd', e, this);
  },




  /*
   Commands
   */

  // Activation word matched but suspend, in order to catch long sentence
  waitWords: {
    en: [/^suspend$/i], // OK Google suspend
    ja: [/^保留$/], // OK Google 保留
  },

  // Discord commands
  chatCommands: [
    {
      name: 'sync-success', // should be kebab-case
      description: 'e.g. !sync;flag hello', // for help
      word: ['sync'],
      options: {
        str1:  { type: String, eg: 'some text' },  // eg for help
        str2:  { type: String, min: 1, max: 20 },  // length restricted
        num1:  { type: Number },
        num2:  { type: Number, min: 0, max: 100 }, // range restricted
        flag:  { type: Boolean, required: true },  // required
      },
      handler: function(e) {
        console.log('Sync chat command example', e, this);
        e.result.transcript += ' (sync)';
        e.result.format = (name, transcript) => `[example] ${transcript} - ${name}`;
      },
    },
    {
      name: 'sync-error',
      word: ['sync-e'],
      handler: function(e) {
        throw new Error('sync error');
      },
    },
    {
      name: 'async-success',
      word: ['async'],
      handler: function(e) {
        console.log('Async chat command example', e, this);
        return new Promise(resolve => {
          setTimeout(() => {
            e.result.transcript += ' (async)',
            resolve();
          }, 3000);
        });
      },
    },
    {
      name: 'async-error',
      word: ['async-e'],
      handler: function(e) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('async error'));
          }, 3000);
        });
      },
    },
    {
      name: 'no-speech',
      word: ['nospeech'],
      handler: function(e) {
        console.log('No speech example', e);
        e.result.speak = false;
      },
    },
    {
      name: 'no-sound',
      word: ['nosound'],
      handler: function(e) {
        console.log('No sound example', e);
        e.result.sound = false;
      },
    },

    // See the count number in the UI after "!c-up"
    {
      name: 'count-up',
      word: ['c-up'],
      handler: function(e) {
        this.countUp();
        e.result.speak = false;
      },
    },
    // See the fav list in the UI after "!fav-add grape"
    {
      name: 'add-fav',
      word: ['fav-add'],
      handler: function(e) {
        this.$u.favs.push(e.transcript);
        e.result.speak = false;
      },
    },
  ],

  // Voice commands
  voiceCommands: [
    // See the fav list in the UI after "OK Google, I love pineapple"
    {
      name: 'add-fav', // should be kebab-case
      description: 'e.g. "OK Google, I love pineapple"', // for help
      // order: 3000, // override plugin order
      // order: { en: 3000 }, // specific languages only
      word: {
        en: [[/I (like|love) (\w+)/i, 2]], // specify indexes [regExp, index1, index2, ...]
        ja: [/私は(.+?)が好き/],
      },
      through: function() { return this.$u.favs.length >= 3; }, // skip command when it returns true
      handler: function(e) {
        console.log('Sync voice command example', e, this);
        this.$u.favs.push(e.options[0]);
      },
    },
    // Say "OK Google, wait 3 seconds" or "OK Google, wait 6 seconds"
    {
      name: 'wait',
      word: {
        en: [/wait (\d+) seconds?/i],
        ja: [/(\d+)秒待って/],
      },
      handler: function(e) {
        console.log('Async voice command example', e, this);
        const sec = e.options[0];
        if (sec > 5) throw new Error('too long');
        e.ok(); // Success sound immediately (optional)
        return new Promise(resolve => {
          setTimeout(() => {
            this.$bot.tts.speak('OK');
            resolve();
          }, sec * 1000);
        });
      },
    },
  ],
};
