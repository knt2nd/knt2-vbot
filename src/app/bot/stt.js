import Base from '../base';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) throw new Error('no SpeechRecognition');

export default class STT extends Base {
  constructor() {
    super();
    this.active = false;
    this.engine = null;
    this.haltTimer = null;
  }

  start() {
    return new Promise((resolve, reject) => {
      if (this.active) return resolve();
      this.engine = new SpeechRecognition();
      this.engine.lang = this.$.engine[this.$.lang].stt;
      this.engine.interimResults = true;
      let counter = 0;
      let prevTime = new Date();
      this.engine.onend = () => {
        if (!this.active) return;
        const currentTime = new Date();
        if (currentTime.getTime() - prevTime.getTime() > 1000) counter = 0;
        prevTime = currentTime;
        if (++counter > 5000) {
          counter = 0;
          this.trigger('error', new Error('STT too many restart'));
          return;
        }
        try {
          this.engine.start();
        } catch (e) {
          this.trigger('error', e);
        }
      };
      this.engine.onresult = e => {
        // https://wicg.github.io/speech-api/#speechreco-result
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          transcript += e.results[i][0].transcript;
        }
        if (transcript.length === 0) return;
        const isFinal = e.results[e.results.length - 1].isFinal;
        this.trigger('result', { transcript, isFinal });
      };
      this.engine.onstart = () => {
        this.engine.onstart = undefined;
        this.active = true;
        resolve();
      };
      try {
        this.engine.start();
      } catch (e) {
        reject(e);
      }
    });
  }

  stop() {
    clearTimeout(this.haltTimer);
    return new Promise(resolve => {
      if (!this.active || !this.engine) return resolve();
      const halt = () => {
        clearTimeout(this.haltTimer);
        if (this.engine) this.engine.onend = undefined;
        this.engine = null;
        this.active = false;
        resolve();
      };
      this.engine.onend = halt;
      this.engine.stop();
      this.haltTimer = setTimeout(() => halt(), 500); // to handle too many restart error
    });
  }
}
