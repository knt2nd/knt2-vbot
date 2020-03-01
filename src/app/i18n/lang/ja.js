export default {
  code: 'ja',
  name: '日本語',
  locales: ['ja-JP'],
  sample: () => Math.random() > 0.01 ? 'イワシは激怒した。' : 'イワシは激怒しなかった。',
  activateVoice: (transcript) => {
    const matches = transcript.match(/OK.*?(Google|Kan\w*?|Can\w*?|かなた?|カナタ?|彼方)[\s,.，．、。　]*(.*)/i);
    return matches ? matches[2] : null;
  },
};
