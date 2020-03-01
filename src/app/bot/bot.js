import Base from '../base';
import STT from './stt';
import TTS from './tts';
import SE from './se';
import Chat from './chat';
import Timer from './timer';
import i18n from '../i18n';

const COMMAND_WAIT = 8000;

export default class Bot extends Base {
  constructor(client) {
    super();
    this.client = client;
    this.active = false;
    this.buffer = null;
    this.stt = new STT();
    this.tts = new TTS();
    this.se = new SE();
    this.chat = new Chat();
    this.timer = new Timer();
    this.client.settings.bind(this, this.stt, this.tts, this.se, this.chat);
    this.chat.on('message', (...args) => this.handleChat(...args));
    this.tts.on('speak', synth => this.trigger('speak', { synth }));
    this.stt.on('result', (...args) => this.handleVoice(...args));
    this.stt.on('error', error => {
      this.trigger('error', { error }, true);
      this.client.stopBot();
    });
    this.timer.set('command', COMMAND_WAIT, () => {
      this.se.play('failure');
      this.buffer = null;
    });
  }

  start(done) {
    if (this.active) return;
    this.chat.start()
      .then(() => this.stt.start())
      .then(() => {
        this.tts.start();
        this.active = true;
        this.trigger('started', null, true);
        if (done) done(true);
      })
      .catch(error => {
        this.chat.stop().catch(console.error);
        this.stt.stop().catch(console.error);
        this.trigger('error', { error }, true);
        if (done) done(false);
      });
  }

  stop(done) {
    if (!this.active) return;
    this.active = false;
    this.buffer = null;
    this.timer.stop('command');
    this.tts.stop();
    this.chat.stop()
      .then(() => this.stt.stop())
      .catch(error => this.trigger('error', { error }, true))
      .finally(() => {
        this.trigger('stopped', null, true);
        if (done) done();
      });
  }

  runVoiceCommand(transcript, original, done) {
    const lang = this.$.lang;
    const result = {
      lang,
      transcript,
      original,
      success: false,
      okayed: false,
    };
    const ok = () => {
      if (result.okayed) return;
      this.se.play('success');
      result.okayed = true;
    };
    this.client.plugin.runVoiceCommand({ lang, transcript, original, ok, result })
      .then(() => {
        ok();
        result.success = true;
        this.trigger('vcmd', result);
        if (done) done(true);
      })
      .catch(error => {
        this.se.play('failure');
        result.error = error;
        this.trigger('vcmd', result);
        if (done) done(false);
      });
  }

  handleVoice(result) {
    this.trigger('voice', result);
    if (!this.$.command.voice) return;
    if (!result.isFinal) {
      if (this.timer.isActive('command')) this.timer.start('command');
      return;
    }
    const transcript = i18n.lang[this.$.lang].activateVoice(result.transcript);
    const buffered = this.buffer ? true : false;
    if (!buffered && transcript === null) return;
    if (buffered) {
      this.timer.stop('command');
      this.buffer.original.push(result.transcript);
      if (transcript) {
        this.buffer.transcript = [transcript];
      } else {
        this.buffer.transcript.push(result.transcript);
      }
    } else {
      this.buffer = {
        original: [result.transcript],
        transcript: [transcript],
      };
    }
    if (transcript !== null && this.client.plugin.isWaitWord(transcript)) {
      this.se.play('activate');
      this.timer.start('command');
      return;
    }
    this.runVoiceCommand(this.buffer.transcript.filter(t => t.length).join(' '), this.buffer.original.join(' '));
    this.buffer = null;
  }

  handleChat(message) {
    const result = {
      message,
      username: message.username,
      transcript: message.content,
      format: i18n.lang[this.$.lang].formatChat,
      tts: {},
      speak: true,
      sound: true,
      success: true,
    };
    const commandParse = new Promise((resolve, reject) => {
      const matches = message.content.match(/^!([\w-]+);?([\w;:=\-!#$%&*-?@^`~<>(){}[\]]*)[\s　]*([\s\S]*)/);
      if (!matches) {
        this.trigger('chat', result);
        return resolve();
      }
      const transcript = matches[3];
      const command = matches[1];
      const options = {};
      matches[2].split(';').forEach(o => {
        const pair = o.split('=');
        if (!pair[0]) return;
        options[pair[0]] = pair.length < 2 ? true : pair[1];
      });
      result.transcript = transcript;
      result.command = command;
      result.options = options;
      this.trigger('chat', result);
      if (!this.$.command.chat) return resolve();
      this.client.plugin.runChatCommand({ transcript, command, options, message, result })
        .then(() => {
          this.trigger('ccmd', result);
          resolve();
        })
        .catch(error => {
          result.success = false;
          result.error = error;
          this.trigger('ccmd', result);
          reject(error);
        });
    });
    commandParse
      .then(() => {
        if (result.sound && (result.command || this.$.chat.speech)) this.se.play('message');
        if (!result.speak) {
          message.react(result.success ? '☑️' : '🤔').catch(console.error);
          return;
        }
        if (!result.transcript || !this.$.chat.speech) return;
        let speech = result.format(result.username, result.transcript);
        if (i18n.lang[this.$.lang].replaceChat) speech = i18n.lang[this.$.lang].replaceChat(speech);
        message.startTyping();
        this.tts.speak(speech, result.tts, (success) => {
          message.stopTyping();
          if (!success) return;
          const transcript = i18n.lang[this.$.lang].activateChat(result.transcript);
          if (transcript && this.$.command.voice) {
            this.runVoiceCommand(transcript, message.content, success => {
              message.react(success ? '☑️' : '🤔').catch(console.error);
            });
          } else {
            message.react('✅').catch(console.error);
          }
        });
      })
      .catch(error => {
        message.react('🤔').catch(console.error);
        if (error) message.reply(error.toString()).catch(console.error);
        this.se.play('failure');
      });
  }
}
