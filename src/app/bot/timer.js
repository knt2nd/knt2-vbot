export default class Timer {
  constructor() {
    this.items = {};
  }

  set(name, timeout, callback) {
    this.items[name] = {
      callback,
      timeout: timeout,
      timer: null,
    };
  }

  start(name, timeout) {
    if (!this.items[name]) return;
    if (this.items[name].timer) clearTimeout(this.items[name].timer);
    if (timeout === undefined) timeout = this.items[name].timeout;
    this.items[name].timer = setTimeout(() => {
      this.items[name].callback();
      this.items[name].timer = null;
    }, timeout);
  }

  stop(name) {
    if (this.items[name] && this.items[name].timer) {
      clearTimeout(this.items[name].timer);
      this.items[name].timer = null;
    }
  }

  stopAll() {
    Object.keys(this.items).forEach(key => this.stop(key));
  }

  isActive(name) {
    return this.items[name] && this.items[name].timer !== null;
  }
}
