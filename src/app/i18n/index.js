import af from './lang/af';
import am from './lang/am';
import az from './lang/az';
import bg from './lang/bg';
import bn from './lang/bn';
import ca from './lang/ca';
import cs from './lang/cs';
import da from './lang/da';
import de from './lang/de';
import el from './lang/el';
import en from './lang/en';
import es from './lang/es';
import eu from './lang/eu';
import fi from './lang/fi';
import fil from './lang/fil';
import fr from './lang/fr';
import gl from './lang/gl';
import gu from './lang/gu';
import hi from './lang/hi';
import hr from './lang/hr';
import hu from './lang/hu';
import hy from './lang/hy';
import id from './lang/id';
import is from './lang/is';
import it from './lang/it';
import ja from './lang/ja';
import jv from './lang/jv';
import ka from './lang/ka';
import km from './lang/km';
import kn from './lang/kn';
import ko from './lang/ko';
import lo from './lang/lo';
import lt from './lang/lt';
import lv from './lang/lv';
import ml from './lang/ml';
import mr from './lang/mr';
import ms from './lang/ms';
import nb from './lang/nb';
import ne from './lang/ne';
import nl from './lang/nl';
import pl from './lang/pl';
import pt from './lang/pt';
import ro from './lang/ro';
import ru from './lang/ru';
import si from './lang/si';
import sk from './lang/sk';
import sl from './lang/sl';
import sr from './lang/sr';
import su from './lang/su';
import sv from './lang/sv';
import sw from './lang/sw';
import ta from './lang/ta';
import te from './lang/te';
import th from './lang/th';
import tr from './lang/tr';
import uk from './lang/uk';
import ur from './lang/ur';
import vi from './lang/vi';
import zh from './lang/zh';
import zu from './lang/zu';

const langSettings = [
  af, am, az, bg, bn, ca, cs, da, de, el, en, es, eu, fi, fil, fr, gl, gu, hi, hr,
  hu, hy, id, is, it, ja, jv, ka, km, kn, ko, lo, lt, lv, ml, mr, ms, nb, ne, nl,
  pl, pt, ro, ru, si, sk, sl, sr, su, sv, sw, ta, te, th, tr, uk, ur, vi, zh, zu,
];

const langs = [];

langSettings.forEach(ls => {
  const settings = {
    code: null,    // required
    name: null,    // required
    locales: null, // required
    stt: { engines: null },
    fallbacks: [],
    sample: 'OK, Google.',
    replaceChat: (transcript) => transcript.replace(/(https?:\/\/)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi, ', [URL], '),
    formatChat: (name, message) => `${name}, ${message}`,
    activateChat:  (transcript) => {
      const matches = transcript.match(/^(O|お|オ).*?(Google|Kanata|ぐ[ー～]ぐる|グ[ー～]グル|かなた|カナタ|彼方)[\s,.、，．。　]*(.*)/i);
      return matches ? matches[3] : null;
    },
    activateVoice: (transcript) => {
      const matches = transcript.match(/OK.*?Google[\s,.，．、。　]*(.*)/i);
      return matches ? matches[1] : null;
    },
  };
  Object.assign(settings, ls);
  if (!settings.stt.engines) {
    settings.stt.engines = {};
    settings.stt.engines[ls.locales[0]] = ls.name;
  }
  langs.push({ code: ls.code, settings: settings });
});

langs.sort((a, b) => {
  if (a.settings.name < b.settings.name) return -1;
  if (a.settings.name > b.settings.name) return 1;
  return 0;
});

const i18n = {
  default: 'en',
  list: langs.map(l => l.code),
  lang: {},
};

langs.forEach(l => i18n.lang[l.code] = l.settings);

Object.values(i18n.lang).forEach(l => {
  if (l.stt.locales) return;
  l.stt.locales = {};
  Object.keys(l.stt.engines).forEach(e => l.stt.locales[e] = e);
});

export default i18n;
