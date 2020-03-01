import Player from './player';
import Youtube from './youtube';
import UI from './ui.vue';

export default {
  name: '@player',
  description: 'Youtube player and commands',
  order: 18411,
  relatedTo: ['@cse'],
  ui: UI,
  settings: {
    volume: { value: 50, icon: 'mdi-volume-high' },
  },
  userStore: {
    queue: [],
  },
  data: {
    youtube: null,
    player: null,
  },
  methods: {
    skip: function(index) {
      this.$d.player.skip(index);
    },
    remove: function(index) {
      this.$d.player.remove(index);
    },
  },
  onsettingschanged: function(e) {
    switch (e.key) {
      case 'active':
        if (e.value === false) this.$d.player.stop();
        break;
      case 'volume':
        this.$d.player.setVolume(e.value);
        break;
    }
  },
  onlaunched: function(e) {
    this.$d.youtube = new Youtube(this.$p, this.$r.cse);
    this.$d.player = new Player(this.$p, this.$logger);
    this.$d.player.add(this.$u.queue);
    this.$u.queue = this.$d.player.queue;
  },
  chatCommands: [
    {
      name: 'play',
      description: 'e.g. !p youtu.be/PqJNc9KVIZE Tell Your World',
      word: ['p', 'p-play'],
      handler: async function(e) {
        e.result.speak = false;
        const videos = Youtube.extract(e.transcript);
        if (!videos.length) throw new Error('Youtube URL required');
        const video = await this.$d.player.play(videos);
        return e.message.reply(`[Play]\nyoutu.be/${video.id} ${video.title}`);
      },
    },
    {
      name: 'add-queue',
      description: 'e.g. !p-add youtu.be/PqJNc9KVIZE Tell Your World',
      word: ['p-add'],
      handler: async function(e) {
        e.result.speak = false;
        const videos = Youtube.extract(e.transcript);
        if (!videos.length) throw new Error('Youtube URL required');
        const current = this.$d.player.queue.length;
        let text = '';
        text += '[Queued]\n';
        text += videos.map((v, i) => `${i + 1 + current}: youtu.be/${v.id} ${v.title}`).join('\n');
        this.$d.player.add(videos);
        return e.message.reply(text);
      },
    },
    {
      name: 'delete-queue',
      word: ['p-del'],
      options: {
        index: { type: Number, min: 1, max: 100 },
        all:   { type: Boolean },
      },
      handler: function(e) {
        e.result.speak = false;
        const optionCount = Object.keys(e.options).length;
        if (!optionCount) throw new Error('no option');
        if (optionCount > 1) throw new Error('option conflict');
        if (e.options.index !== undefined) {
          this.$d.player.remove(e.options.index - 1);
        } else if (e.options.all) {
          this.$d.player.clear();
        }
      },
    },
    {
      name: 'stop',
      word: ['p-stop'],
      handler: function(e) {
        e.result.speak = false;
        if (!this.$d.player.isPlaying()) throw new Error('not playing');
        this.$d.player.stop();
      },
    },
    {
      name: 'start',
      word: ['p-start'],
      handler: function(e) {
        e.result.speak = false;
        if (!this.$d.player.isPaused() && !this.$d.player.queue.length) throw new Error('no video');
        this.$d.player.start();
      },
    },
    {
      name: 'skip',
      word: ['p-skip'],
      options: {
        index: { type: Number, min: 1, max: 100 },
      },
      handler: function(e) {
        e.result.speak = false;
        if (!this.$d.player.queue.length) throw new Error('no queue');
        this.$d.player.skip(e.options.index - 1);
      },
    },
    {
      name: 'get-info',
      word: ['p-get'],
      handler: function(e) {
        e.result.sound = false;
        e.result.speak = false;
        const video = this.$d.player.playingVideo;
        const queue = this.$d.player.queue;
        let text = '';
        text += '[Playing]\n';
        text += video ? `youtu.be/${video.id} ${video.title}` : '-';
        text += '\n\n';
        text += '[Queue]\n';
        text += queue.length ? queue.map((v, i) => `${i + 1}: youtu.be/${v.id} ${v.title}`).join('\n') : '-';
        text += '\n\n';
        text += '[Settings]\n';
        text += `volume=${this.$d.player.volume}`;
        return e.message.reply(text);
      },
    },
    {
      name: 'set-settings',
      word: ['p-set'],
      options: {
        volume:  { type: Number, min: 0, max: 100 },
      },
      handler: function(e) {
        e.result.speak = false;
        if (!Object.keys(e.options).length) throw new Error('no option');
        if (e.options.volume !== undefined) this.$d.player.setVolume(e.options.volume);
      },
    },
  ],
  voiceCommands: [
    {
      name: 'play',
      word: {
        en: [[/(play|stream) (.+)/i, 2]],
        es: [/pon (.+)/i],
        de: [/spiele (.+)/i],
        nl: [/speel (.+)/i],
        fr: [/mets (.+)/i],
        it: [[/(fammi ascoltare|metti|riproduci|voglio sentire) (.+)/i, 2]],
        ru: [/играть (.+)/i],
        ko: [/(.+?)를?\s*재생/],
        zh: [/播放(.+)/],
        ja: [/(.+?)を?(再生|配信|流して|[か掛賭]けて|プレイ)/],
      },
      handler: async function(e) {
        const videos = await this.$d.youtube.search(e.options[0]);
        if (!videos.length) throw new Error('no video');
        return this.$d.player.play(videos);
      },
    },
    {
      name: 'stop',
      word: {
        en: [/(stop|pause)/i],
        es: [/(para|pausa)/i],
        de: [/(anhalten|pausieren)/i],
        nl: [/(stop|pauzeer)/i],
        fr: [/(arrête|pause)/i],
        it: [/(stop|pausa)/i],
        ru: [/(остановить|пауза)/i],
        ko: [/중지/],
        zh: [/(停止|[暂暫]停)/],
        ja: [/(停止|[止とや]めて|ストップ)/],
      },
      through: function() { return !this.$d.player.isPlaying(); },
      handler: function(e) { this.$d.player.stop(); },
    },
    {
      name: 'start',
      word: {
        en: [/(start|resume)/i],
        es: [/(empezar|continuar)/i],
        de: [/(starten|fortsetzen)/i],
        nl: [/(begin|hervat)/i],
        fr: [/(démarrer|reprends|continue)/i],
        it: [/(inizio|riprendi|continua)/i],
        ru: [/(начать|возобновить)/i],
        ko: [/시작/],
        zh: [/([开開]始|[继繼][续續])/],
        ja: [/(開始|スタート|再開)/],
      },
      through: function() { return !this.$d.player.isPaused() && !this.$d.player.queue.length; },
      handler: function(e) { this.$d.player.start(); },
    },
    {
      name: 'skip',
      word: {
        en: [/(skip|next)/i],
        es: [/(omitir|siguiente|próxima)/i],
        de: [/(überspringen|weiter)/i],
        nl: [/(volgende|sla over)/i],
        fr: [/(suivant|passe le titre)/i],
        it: [/(successivo|salta|brano successivo)/i],
        ru: [/(пропускать|следующая)/i],
        ko: [/(건너뛰기|다음)/],
        zh: [/(跳[过過]|下一)/],
        ja: [/(スキップ|次へ|次の曲)/],
      },
      through: function() { return !this.$d.player.queue.length; },
      handler: function(e) { this.$d.player.skip(); },
    },
    {
      name: 'vol-max',
      word: {
        en: [/volume.*?max/i],
        es: [/volumen.*?máx/i],
        de: [/volumen.*?max/i],
        nl: [/volume.*?max/i],
        fr: [/volume.*?max/i],
        it: [/volume.*?(max|massimo)/i],
        ru: [/(максима|наибольший).*?(громкост|объем)/i],
        ko: [/(음량|볼륨).*?최대/],
        zh: [/音量.*?最大/],
        ja: [/(音量|ボリューム).*?(最大|マックス)/],
      },
      through: function() { return !this.$d.player.isPlaying(); },
      handler: function(e) { this.$d.player.volumeMax(); },
    },
    {
      name: 'vol-min',
      word: {
        en: [/volume.*?min/i],
        es: [/volumen.*?mín/i],
        de: [/volumen.*?min/i],
        nl: [/volume.*?min/i],
        fr: [/volume.*?min/i],
        it: [/volume.*?min/i],
        ru: [/(минима|наименьший).*?(громкост|объем)/i],
        ko: [/(음량|볼륨).*?최저/],
        zh: [/音量.*?最小/],
        ja: [/(音量|ボリューム).*?最小/],
      },
      through: function() { return !this.$d.player.isPlaying(); },
      handler: function(e) { this.$d.player.volumeMin(); },
    },
    {
      name: 'vol-up',
      word: {
        en: [/(volume.*?up|turn.*?up)/i],
        es: [/sube.*?volumen/i],
        de: [/lauter/i],
        nl: [/geluid.*?hard/i],
        fr: [/monte.*?volume/i],
        it: [/alzare.*?volume/i],
        ru: [/погромче/i],
        ko: [/(음량|볼륨).*?높이/],
        zh: [/音量.*?[高大]/, /([调調提]高).*?音量/],
        ja: [/(音量|ボリューム).*?([上あ]げ|大|アップ)/],
      },
      through: function() { return !this.$d.player.isPlaying(); },
      handler: function(e) { this.$d.player.volumeUp(); },
    },
    {
      name: 'vol-down',
      word: {
        en: [/(volume.*?down|turn.*?down)/i],
        es: [/bajo.*?volumen/i],
        de: [/leiser/i],
        nl: [/(geluid|volume).*?zachter/i],
        fr: [/baisse.*?volume/i],
        it: [/abbassa.*?volume/i],
        ru: [/негромко/i],
        ko: [/(음량|볼륨).*?낮춰/],
        zh: [/音量.*?[低小]/, /([调調降]低).*?音量/],
        ja: [/(音量|ボリューム).*?([下さ]げ|小|ダウン)/],
      },
      through: function() { return !this.$d.player.isPlaying(); },
      handler: function(e) { this.$d.player.volumeDown(); },
    },
    {
      name: 'get-title',
      word: {
        en: [/what.*?(title|song|playing)/i],
        es: [/qué.*?sonando/i],
        de: [/(was|welcher).*?läuft/i],
        nl: [/(wat|welk).*?(nummer|afgespeeld)/i],
        fr: [/(qu'est|quel).*?(diffusé|chanson)/i],
        it: [/che.*?(titolo|brano|ascoltando)/i],
        ru: [/что.*?(играет|песня)/i],
        ko: [/곡의.*?(제목은|무엇)/],
        zh: [/(曲|首歌).*?([什甚][么麽麼])/],
        ja: [/(曲|タイトル).*?(は|何|教えて)/, /(何|なんて).*?(曲|タイトル)/],
      },
      through: function() { return !this.$d.player.isPlaying(); },
      handler: function(e) {
        const video = this.$d.player.playingVideo;
        if (!video || !video.title) throw new Error('no title');
        e.ok();
        this.$bot.tts.speak(video.title);
      },
    },
  ],
};
