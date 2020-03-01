export default {
  name: '@log',
  description: 'Logger',
  order: 18450,
  settings: {
    system: true,
    speak: true,
    chat: true,
    voice: true,
    command: true,
    debug: false,
  },
  data: {
    recog: null,
  },
  onglobalsettingschanged: function(e) {
    if (!this.$p.active) return;
    if (this.$p.debug) console.log('onglobalsettingschanged', e, this);
  },
  onsettingschanged: function(e) {
    if (!this.$p.active) return;
    if (this.$p.debug) console.log('onsettingschanged', e, this);
  },
  onlaunched: function(e) {
    if (!this.$p.active) return;
    if (this.$p.debug) console.log('onlaunched', e, this);
  },
  onerror: function(e) {
    if (!this.$p.active) return;
    if (this.$p.debug) console.log('onerror', e, this);
    if (!this.$p.system) return;
    if (e.error) this.$logger.error(`Error: ${e.error.message}`);
  },
  onstarted: function(e) {
    if (!this.$p.active) return;
    if (this.$p.debug) console.log('onstarted', e, this);
    if (!this.$p.system) return;
    this.$logger.info('System: bot started');
  },
  onstopped: function(e) {
    if (!this.$p.active) return;
    if (this.$p.debug) console.log('onstopped', e, this);
    if (!this.$p.system) return;
    this.$logger.info('System: bot stopped');
  },
  onspeak: function(e) {
    if (this.$p.debug) console.log('onspeak', e, this);
    if (!this.$p.speak) return;
    this.$logger.info(`Speak: ${e.synth.text}`);
  },
  onchat: function(e) {
    if (this.$p.debug) console.log('onchat', e, this);
    if (!this.$p.chat) return;
    this.$logger.info(`Chat: ${e.message.username}: ${e.message.content}`);
  },
  onvoice: function(e) {
    if (this.$p.debug) console.log('onvoice', e, this);
    if (!this.$p.voice) return;
    const message = `Voice: ${e.transcript}`;
    if (e.isFinal) {
      if (this.$d.recog) {
        this.$d.recog.message = message;
        this.$d.recog.classes = null;
        this.$d.recog = null;
      } else {
        this.$logger.info(message);
      }
    } else {
      if (this.$d.recog) {
        this.$d.recog.message = message;
      } else {
        this.$d.recog = this.$logger.info(message, 'grey--text');
      }
    }
  },
  onccmd: function(e) {
    if (this.$p.debug) console.log('onccmd', e, this);
    if (!this.$p.command) return;
    const msg = `"${e.message.content}" by ${e.message.username}`;
    const options = Object.keys(e.options).map(key => `${key}=${e.options[key]}`).join(', ');
    const cmd = e.plugin && e.command ? ` ${e.plugin.name}.${e.command.name}(${options})` : '';
    if (e.error) {
      this.$logger.warn(`Ccmd(NG):${cmd} ${e.error.message} ${msg}`);
    } else if (e.command) {
      this.$logger.notice(`Ccmd:${cmd} ${msg}`);
    }
  },
  onvcmd: function(e) {
    if (this.$p.debug) console.log('onvcmd', e, this);
    if (!this.$p.command) return;
    const msg = `"${e.original}"`;
    const cmd = e.plugin && e.command ? ` ${e.plugin.name}.${e.command.name}(${e.options.join(', ')})` : '';
    if (e.error) {
      this.$logger.warn(`Vcmd(NG):${cmd} ${e.error.message} ${msg}`);
    } else if (e.command) {
      this.$logger.notice(`Vcmd:${cmd} ${msg}`);
    }
  },
};
