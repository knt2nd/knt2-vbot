import moment from 'moment';

const LOG_MAX = 100;

// https://vuetifyjs.com/en/customization/theme
const CLASS_MAP = {
  'info': null,
  'notice': 'accent',
  'warn': 'warning',
  'error': 'error',
};

class Log {
  constructor(type, message, classes, styles) {
    this._time = moment();
    this.time = this._time.format('HH:mm');
    this.id = this._time.valueOf() + Math.random();
    this.type = type;
    this.message = message;
    this.classes = classes || CLASS_MAP[type];
    this.styles = styles;
  }
}

export default class Logger {
  constructor() {
    this.data = [];
    this.archive = [];
  }

  add(...args) {
    const log = new Log(...args);
    this.data.unshift(log);
    if (this.data.length > LOG_MAX) this.archive.unshift(this.data.pop());
    return log;
  }

  info(...args) {
    return this.add('info', ...args);
  }

  notice(...args) {
    return this.add('notice', ...args);
  }

  warn(...args) {
    return this.add('warn', ...args);
  }

  error(...args) {
    return this.add('error', ...args);
  }

  clear() {
    this.data.splice(0);
    this.archive.splice(0);
  }

  getFile() {
    return {
      name: `knt2-vbot_${moment().format('YYYY-MM-DD')}.txt`,
      content: [...this.data, ...this.archive].reverse().map(log => {
        return [log._time.format('YYYY-MM-DD HH:mm:ss'), log.type, log.message].join('\t');
      }).join('\n') + '\n',
    };
  }
}
