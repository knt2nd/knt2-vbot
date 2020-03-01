export default class Youtube {
  constructor(settings, cse) {
    this.$ = settings;
    this.cse = cse;
  }

  async search(query) {
    if (!this.cse) throw new Error('no search engine');
    const params = {
      q: query,
      siteSearch: 'www.youtube.com/watch?v=*',
      siteSearchFilter: 'i',
    };
    const res = await this.cse.search(params);
    if (!res.data.items || !res.data.items.length) return [];
    const videos  = [];
    const idMap = {};
    res.data.items.forEach(item => {
      const matched = item.link.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i);
      if (!matched || idMap[matched[1]]) return;
      videos.push({
        id: matched[1],
        title: item.title.replace(/ - YouTube$/, ''),
      });
      idMap[matched[1]] = true;
    });
    return videos;
  }

  static extract(text) {
    const videos = [];
    text.split('\n').forEach(line => {
      const matched = line.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})\s*[- ]*(.*)/i);
      if (!matched) return;
      videos.push({
        id: matched[1],
        title: matched[2],
      });
    });
    return videos;
  }
}
