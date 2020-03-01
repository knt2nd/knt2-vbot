export default {
  code: 'zh',
  name: '中文',
  locales: ['zh-CN', 'zh-HK', 'zh-TW'],
  stt: {
    engines: {
      'cmn-Hans-CN': '普通话 (中国大陆)',
      'cmn-Hans-HK': '普通话 (香港)',
      'cmn-Hant-TW': '中文 (台灣)',
      'yue-Hant-HK': '粵語 (香港)',
    },
    locales: {
      'zh-CN': 'cmn-Hans-CN',
      'zh-HK': 'cmn-Hans-HK',
      'zh-TW': 'cmn-Hant-TW',
    },
  },
  fallbacks: ['en'],
};
