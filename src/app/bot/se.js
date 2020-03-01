import { Howl } from 'howler';

const SOUNDS = ['activate', 'success', 'failure', 'message', 'notice'];

export default class SE {
  constructor() {
    this.sounds = {};
    SOUNDS.forEach(s => this.sounds[s] = new Howl({ src: `./sounds/${s}.mp3` }));
  }

  play(name, done) {
    if (!this.sounds[name] || !this.$.se.volume) return;
    if (done) this.sounds[name].once('end', done);
    this.sounds[name].volume(this.$.se.volume / 100);
    this.sounds[name].play();
  }
}
