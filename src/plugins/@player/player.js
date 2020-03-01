import YTPlayer from 'yt-player';

const QUEUE_MAX = 100;
const VOLUME_MAX = 95;
const VOLUME_MIN = 5;
const VOLUME_STEP = 25;

class Video {
  constructor(video) {
    this.$original = video;
    this.id = video.id;
    this.title = video.title;
    this.key = Math.random();
  }

  toJSON() {
    return this.$original;
  }
}

export default class Player {
  constructor(settings, logger) {
    this.$ = settings;
    this.volume = this.$.volume;
    this.queue = [];
    this.logger = logger;
    this.running = false;
    this.pausing = false;
    this.playingVideo = null;
    this.current = {
      video: null,
      candidates: null,
      onsuccess: null,
      onfailure: null,
      counter: 0,
    };
    this.player = new YTPlayer('#yt-player', { width: 320, height: 180 });
    this.player.on('playing', () => {
      if (this.current.onsuccess) this.current.onsuccess();
      if (this.pausing) return this.player.pause();
      this.playingVideo = this.current.video;
    });
    this.player.on('unplayable', () => {
      const retry = this.current.candidates && this.current.counter < this.current.candidates.length;
      this.logger.warn(`Player: failed to play${retry ? ', try another': ''}`);
      if (!retry) {
        if (this.current.onfailure) this.current.onfailure();
        this.playingVideo = null;
        this._reset();
        return;
      }
      this._play(this.current.candidates[this.current.counter]);
      this.current.counter++;
    });
    this.player.on('paused', () => {
      this.playingVideo = null;
    });
    this.player.on('ended', () => {
      const video = this.queue.shift();
      if (video) {
        this._play(video);
        return;
      }
      this._reset();
      this.playingVideo = null;
    });
  }

  _clean() {
    this.current.onsuccess = null;
    this.current.onfailure = null;
    this.current.candidates = null;
  }

  _reset() {
    this.current.video = null;
    this.current.counter = 0;
    this._clean();
  }

  _play(video) {
    this.current.video = video;
    this.logger.info(`Player: play youtu.be/${video.id} - ${video.title}`);
    this.player.load(video.id);
    this.player.play();
    if (!this.running) {
      this.running = true;
      this.player.setVolume(this.volume);
    }
  }

  play(candidates) {
    this.pausing = false;
    return new Promise((resolve, reject) => {
      this.current.counter = 1;
      this.current.candidates = candidates;
      this.current.onsuccess = () => {
        this._clean();
        resolve(this.current.video);
      };
      this.current.onfailure = () => {
        this._clean();
        reject(new Error('failed to play'));
      };
      this._play(candidates[0]);
    });
  }

  start() {
    this.pausing = false;
    if (this.current.video) {
      this.player.play();
      return;
    }
    const video = this.queue.shift();
    if (!video) throw new Error('no item');
    this._play(video);
  }

  stop() {
    this.playingVideo = null;
    this.pausing = true;
    this.player.pause();
  }

  skip(index) {
    if (index !== undefined) {
      if (index > this.queue.length - 1 || index < 0) throw new Error('invalid index');
      this.queue.splice(0, index);
    }
    const video = this.queue.shift();
    if (!video) throw new Error('no more item');
    this.pausing = false;
    this._play(video);
  }

  add(videos) {
    if (this.queue.length + videos.length > QUEUE_MAX) throw new Error('too many queue');
    videos.forEach(v => this.queue.push(new Video(v)));
  }

  remove(index) {
    if (!this.queue.length) throw new Error('no item');
    if (index > this.queue.length - 1 || index < 0) throw new Error('invalid index');
    this.queue.splice(index, 1);
  }

  clear() {
    this.queue.splice(0);
  }

  isPlaying() {
    return !!this.playingVideo;
  }

  isPaused() {
    return !this.playingVideo && this.current.video;
  }

  volumeUp() {
    this.volume += VOLUME_STEP;
    if (this.volume > VOLUME_MAX) this.volume = VOLUME_MAX;
    this.setVolume(this.volume);
  }

  volumeDown() {
    this.volume -= VOLUME_STEP;
    if (this.volume < VOLUME_MIN) this.volume = VOLUME_MIN;
    this.setVolume(this.volume);
  }

  volumeMax() {
    this.volume = VOLUME_MAX;
    this.setVolume(this.volume);
  }

  volumeMin() {
    this.volume = VOLUME_MIN;
    this.setVolume(this.volume);
  }

  setVolume(volume) {
    this.volume = volume;
    this.player.setVolume(this.volume);
  }
}
