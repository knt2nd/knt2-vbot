export default class Base {
  constructor() {
    this.handlers = {};
  }

  on(name, handler) {
    if (!this.handlers[name]) this.handlers[name] = [];
    this.handlers[name].push(handler);
  }

  trigger(name, ...args) {
    if (!this.handlers[name]) return;
    this.handlers[name].forEach(h => h(...args));
  }
}
