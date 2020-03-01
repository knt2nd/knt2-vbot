const isObject = target => {
  return target instanceof Object && !(target instanceof Array);
};

const getType = target => {
  if (target === undefined) return 'undefined';
  if (target === null) return 'null';
  if (!target.constructor || !target.constructor.name) return 'unknown';
  return target.constructor.name;
};

const mergeObject = (to, from) => {
  if (!to || !from) return;
  Object.keys(to).forEach(key => {
    // eslint-disable-next-line no-prototype-builtins
    if (!from.hasOwnProperty(key)) return;
    if (isObject(to[key]) && isObject(from[key])) {
      mergeObject(to[key], from[key]);
    } else {
      const toType = getType(to[key]);
      const fromType = getType(from[key]);
      if (toType === fromType) {
        to[key] = from[key];
      } else if (toType === 'Number' && fromType === 'String' && from[key].match(/^-?\d+\.?\d*$/)) {
        to[key] = from[key] - 0;
      }
    }
  });
};

export default class Settings {
  constructor(mode) {
    this.data = {};
    this.storageKey = 'knt2-vbot';
    if (mode !== 'production') this.storageKey += '_' + mode;
  }

  set(data) {
    Object.assign(this.data, data);
  }

  bind(...instances) {
    instances.forEach(i => i.$ = this.data);
  }

  merge(data) {
    if (!data) return;
    mergeObject(this.data, data);
  }

  load() {
    try {
      const savedData = JSON.parse(localStorage.getItem(this.storageKey));
      mergeObject(this.data, savedData);
    } catch (e) {
      console.error(e);
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error(e);
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.error(e);
    }
  }
}
