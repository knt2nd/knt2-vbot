import UI from './ui.vue';

export default {
  name: '@tts',
  description: 'Text to speech',
  order: 18441,
  ui: UI,
  settings: {
    active: false,
    shift: { value: false, label: 'Shift + Enter' },
  },
  data: {
    text: '',
    disabled: true,
  },
  methods: {
    onkeyup: function(e) {
      if (e.keyCode !== 13 || this.$p.shift && !e.shiftKey) return;
      this.speak();
    },
    speak: function() {
      const text = this.$d.text.replace(/\n/g, ' ');
      if (text.match(/\S+/)) this.$bot.tts.speak(text);
      this.$d.text = '';
    },
  },
  onsettingschanged: function(e) {
    if (e.key === 'active') this.$d.disabled = !e.value || !this.$client.status.running;
  },
  onstarted: function(e) {
    if (this.$p.active) this.$d.disabled = false;
  },
  onstopped: function(e) {
    if (this.$p.active) this.$d.disabled = true;
  },
};
