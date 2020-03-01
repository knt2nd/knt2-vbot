import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

export default {
  name: '@wikipedia',
  description: 'Wikipedia search command',
  order: 18420,
  voiceCommands: [
    {
      name: 'search',
      word: {
        en: [[/(tell|lecture).*?about (.+)/i, 2]],
        es: [/cuéntame sobre (.+)/i],
        de: [/erzähl mir von (.+)/i],
        nl: [/vertel.*?over (.+)/i],
        fr: [/parle.?moi de (.+)/i],
        it: [/parlami (.+)/i],
        ru: [[/расскажи мне( об)? (.+)/i, 2]],
        ko: [/(.+)대해?\s*가르쳐/],
        zh: [[/告[诉訴](我[们們]?)?(.+)/, 2]],
        ja: [/(.+)について(教えて|おしえて)/],
      },
      handler: async function(e) {
        // https://www.mediawiki.org/wiki/API:Opensearch
        // https://www.mediawiki.org/wiki/API:Cross-site_requests
        const searchRes = await axios({
          url: `https://${e.lang}.wikipedia.org/w/api.php`,
          adapter: jsonpAdapter,
          params: {
            action: 'opensearch',
            limit: '1',
            redirects: 'resolve',
            search: e.options[0],
          },
        });
        if (!searchRes.data.length || !searchRes.data[3] || !searchRes.data[3].length) throw new Error('no result');
        const link = searchRes.data[3][0].replace('wikipedia.org/wiki/', 'wikipedia.org/api/rest_v1/page/summary/');
        const pageRes = await axios.get(link);
        if (!pageRes.data.extract) throw new Error('no summary');
        e.ok();
        this.$bot.tts.speak(pageRes.data.extract.replace(/(\(.*?\)|\[.*?\]|（.*?）)/g, ''));
      },
    },
  ],
};
