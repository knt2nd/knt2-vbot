import Queue from 'js-queue';
import Base from '../base';

const QUIET_TIME = 500;

export default class TTS extends Base {
  constructor() {
    super();
    this.active = false;
    this.quiet = false;
    this.done = null;
    this.queue = new Queue();
  }

  start() {
    this.active = true;
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    this.cancel();
  }

  cancel(done) {
    speechSynthesis.cancel();
    if (this.done) {
      this.done(false);
      this.done = null;
    }
    if (this.queue.contents.length) {
      this.quiet = true;
      setTimeout(() => {
        this.quiet = false;
        if (done) done();
      }, QUIET_TIME);
      this.queue.next();
    } else {
      if (done) done();
    }
  }

  isSpeaking() {
    return !!this.done || !!this.queue.contents.length;
  }

  speak(text, _options, _done) {
    const done = (success) => {
      if (_done) {
        _done(success);
        _done = null;
      }
    };
    if (_options === true) {
      _options = null;
    } else if (!this.active) {
      done(false);
      return;
    }
    const options = Object.assign({}, this.$.tts);
    options.engine = this.$.engine[this.$.lang].tts;
    if (_options) Object.assign(options, _options);
    ['pitch', 'volume', 'rate'].forEach(key => {
      if (isNaN(options[key]) || options[key] < 0 || options[key] > 100) options[key] = 50;
    });
    if (!text || !options.volume || !options.engine || !options.engine.toOriginal) return done(false);
    const _this = this;
    this.queue.add(function() {
      if (_this.quiet) {
        done(false);
        this.next();
        return;
      }
      _this.done = done;
      // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
      const synth = new SpeechSynthesisUtterance();
      synth.text = text;
      synth.voice = options.engine.toOriginal();
      synth.volume = options.volume / 100; // default: 1, range: 0-1
      synth.pitch = options.pitch / 100 * 1.99 + 0.01; // default: 1, range: 0-2 (0.01-2)
      synth.rate = options.rate / 100 * 1.9 + 0.1; // default: 1, range: 0.1-10 (0.1-2)
      if (synth.pitch < 0.01) synth.pitch = 0.01;
      if (synth.rate < 0.1) synth.rate = 0.1;
      let timer;
      // https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
      synth.onstart = () => {
        timer = setInterval(() => {
          speechSynthesis.pause();
          speechSynthesis.resume();
        }, 8000);
      };
      synth.onend = () => {
        clearInterval(timer);
        _this.done = null;
        done(true);
        this.next();
      };
      synth.onerror = e => {
        clearInterval(timer);
        _this.cancel();
      };
      speechSynthesis.speak(synth);
      _this.trigger('speak', synth);
    });
  }
}
