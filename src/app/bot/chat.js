import Base from '../base';

// https://discord.js.org/#/docs/
// https://discordapp.com/developers/applications/

const MESSAGE_LENGTH = 1800;
const DEFAULT_FORMAT = (text) => '```\n' + text + '\n```';

class Message {
  constructor(message) {
    this.$original = message;
    this.username = message.author.username;
    this.content = message.content;
  }

  toOriginal() {
    return this.$original;
  }

  startTyping() {
    this.$original.channel.startTyping();
  }

  stopTyping() {
    this.$original.channel.stopTyping();
  }

  pretendToType() {
    this.startTyping();
    this.stopTyping();
  }

  react(emoji) {
    return this.$original.react(emoji);
  }

  reply(text, format) {
    if (text.length === 0) return Promise.reject(new Error('no message'));
    if (!format) format = DEFAULT_FORMAT;
    if (text.length < MESSAGE_LENGTH) {
      return this.$original.reply(format(text));
    }
    const lines = text.split('\n');
    const chunk = [];
    let buffer = '';
    lines.forEach(l => {
      if (buffer.length + l.length > MESSAGE_LENGTH) {
        chunk.push(buffer);
        buffer = '';
      }
      buffer += l + '\n';
    });
    if (buffer.length) chunk.push(buffer);
    const replies = [];
    chunk.forEach(c => {
      if (!c.length || c === '\n') return;
      replies.push(c);
    });
    return replies.reduce((promise, r) => {
      return promise.then(() => this.$original.reply(format(r)));
    }, Promise.resolve());
  }
}

export default class Chat extends Base {
  constructor() {
    super();
    this.active = false;
    this.client = null;
  }

  start() {
    if (this.active || !this.$.chat.key) return Promise.resolve();
    this.client = new Discord.Client();
    this.client.on('ready', () => {
      this.client.user.setActivity('!help');
    });
    this.client.on('message', msg => {
      if (msg.channel.type !== 'dm' || msg.author === this.client.user || msg.author.bot) return;
      this.trigger('message', new Message(msg));
    });
    return this.client.login(this.$.chat.key).then(() => this.active = true);
  }

  stop() {
    if (!this.active || !this.client) return Promise.resolve();
    return this.client.destroy()
      .then(() => {
        this.client = null;
        this.active = false;
      });
  }
}
