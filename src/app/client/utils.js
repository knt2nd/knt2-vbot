import Locale from './locale';

export default {
  toLocale: target => new Locale(target),
  correctLocale: target => {
    const parts = target.split('-');
    parts[0] = parts[0].toLowerCase();
    if (parts.length > 1) parts[1] = parts[1].toUpperCase();
    return parts.join('-');
  },
};
