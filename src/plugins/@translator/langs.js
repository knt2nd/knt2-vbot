const map = {
  en: {
    'japanese': 'ja-JP',
    'chinese': 'zh-CN',
    'cantonese': 'zh-HK',
    'taiwanese': 'zh-TW',
    'korean': 'ko-KR',
    'indonesian': 'id-ID',
    'russian': 'ru-RU',
    'spanish': 'es-ES',
    'portuguese': 'pt-BR',
    'german': 'de-DE',
    'dutch': 'nl-NL',
    'polish': 'pl-PL',
    'french': 'fr-FR',
    'italian': 'it-IT',
    'hindi': 'hi-IN',
  },
  es: {
    'inglés': 'en-US',
    'japonés': 'ja-JP',
    'mandarín': 'zh-CN',
    'cantones': 'zh-HK',
    'taiwanés': 'zh-TW',
    'coreano': 'ko-KR',
    'indonesio': 'id-ID',
    'ruso': 'ru-RU',
    'portugués': 'pt-BR',
    'alemán': 'de-DE',
    'holandés': 'nl-NL',
    'polaco': 'pl-PL',
    'francés': 'fr-FR',
    'italiano': 'it-IT',
    'hindi': 'hi-IN',
  },
  de: {
    'englisch': 'en-US',
    'japanisch': 'ja-JP',
    'chinesisch': 'zh-CN',
    'kantonesisch': 'zh-HK',
    'taiwanisch': 'zh-TW',
    'koreanisch': 'ko-KR',
    'indonesisch': 'id-ID',
    'russisch': 'ru-RU',
    'spanisch': 'es-ES',
    'portugiesisch': 'pt-BR',
    'niederländisch': 'nl-NL',
    'holländisch': 'nl-NL',
    'polnisch': 'pl-PL',
    'französisch': 'fr-FR',
    'italienisch': 'it-IT',
    'hindi': 'hi-IN',
  },
  nl: {
    'engels': 'en-US',
    'japans': 'ja-JP',
    'chinees': 'zh-CN',
    'kantonees': 'zh-HK',
    'taiwanees': 'zh-TW',
    'koreaans': 'ko-KR',
    'indonesisch': 'id-ID',
    'russisch': 'ru-RU',
    'spaans': 'es-ES',
    'portugees': 'pt-BR',
    'duits': 'de-DE',
    'pools': 'pl-PL',
    'frans': 'fr-FR',
    'italiaans': 'it-IT',
    'hindi': 'hi-IN',
  },
  fr: {
    'anglais': 'en-US',
    'japonais': 'ja-JP',
    'chinois': 'zh-CN',
    'cantonais': 'zh-HK',
    'taïwanais': 'zh-TW',
    'coréen': 'ko-KR',
    'indonésien': 'id-ID',
    'russe': 'ru-RU',
    'espagnol': 'es-ES',
    'portugais': 'pt-BR',
    'allemand': 'de-DE',
    'néerlandais': 'nl-NL',
    'polonais': 'pl-PL',
    'italien': 'it-IT',
    'hindi': 'hi-IN',
  },
  it: {
    'inglese': 'en-US',
    'giapponese': 'ja-JP',
    'cinese': 'zh-CN',
    'cantonese': 'zh-HK',
    'taiwanese': 'zh-TW',
    'coreano': 'ko-KR',
    'indonesiano': 'id-ID',
    'russo': 'ru-RU',
    'spagnolo': 'es-ES',
    'portoghese': 'pt-BR',
    'tedesco': 'de-DE',
    'olandese': 'nl-NL',
    'polacco': 'pl-PL',
    'francese': 'fr-FR',
    'hindi': 'hi-IN',
  },
  ru: {
    'английский': 'en-US',
    'японский': 'ja-JP',
    'китайский': 'zh-CN',
    'кантонский': 'zh-HK',
    'тайваньский': 'zh-TW',
    'корейский': 'ko-KR',
    'индонезийский': 'id-ID',
    'испанский': 'es-ES',
    'португальский': 'pt-BR',
    'немецкий': 'de-DE',
    'нидерландский': 'nl-NL',
    'польский': 'pl-PL',
    'французский': 'fr-FR',
    'итальянский': 'it-IT',
    'хинди': 'hi-IN',
  },
  ko: {
    '영': 'en-US',
    '일본': 'ja-JP',
    '중국': 'zh-CN',
    '광동': 'zh-HK',
    '대만': 'zh-TW',
    '인도네시아': 'id-ID',
    '러시아': 'ru-RU',
    '스페인': 'es-ES',
    '포르투갈': 'pt-BR',
    '독일': 'de-DE',
    '네덜란드': 'nl-NL',
    '폴란드': 'pl-PL',
    '프랑스': 'fr-FR',
    '이탈리아': 'it-IT',
    '힌디': 'hi-IN',
  },
  zh: {
    '英': 'en-US',
    '日': 'ja-JP',
    '韩': 'ko-KR',
    '韓': 'ko-KR',
    '印尼': 'id-ID',
    '俄': 'ru-RU',
    '西班牙': 'es-ES',
    '葡萄': 'pt-BR',
    '德': 'de-DE',
    '荷兰': 'nl-NL',
    '荷蘭': 'nl-NL',
    '波兰': 'pl-PL',
    '波蘭': 'pl-PL',
    '法': 'fr-FR',
    '意大利': 'it-IT',
    '義大利': 'it-IT',
    '印地': 'hi-IN',
  },
  ja: {
    '英': 'en-US',
    '中国': 'zh-CN',
    '広東': 'zh-HK',
    '台湾': 'zh-TW',
    '韓国': 'ko-KR',
    'インドネシア': 'id-ID',
    'ロシア': 'ru-RU',
    'スペイン': 'es-ES',
    'ポルトガル': 'pt-BR',
    'ドイツ': 'de-DE',
    'オランダ': 'nl-NL',
    'ポーランド': 'pl-PL',
    'フランス': 'fr-FR',
    'イタリア': 'it-IT',
    'ヒンディー': 'hi-IN',
  },
};

const langs = {};
Object.keys(map).forEach(code => {
  langs[code] = {
    map: map[code],
    list: [],
  };
  Object.keys(map[code]).forEach(name => langs[code].list.push(name));
});

export default langs;
