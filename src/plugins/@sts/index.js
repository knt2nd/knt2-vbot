export default {
  name: '@sts',
  description: 'Speech to speech',
  order: 18442,
  settings: {
    active: false,
  },
  onvoice: function(e) {
    if (!e.isFinal) return;
    this.$bot.tts.speak(e.transcript);
  },
};
