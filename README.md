# Kanata 2nd Voice Bot

Kanata 2nd Voice Bot is a smart speaker over the Internet, supports lots of languages.

[Live Demo](https://knt2-vbot.web.app/)

![Demo animation](manuals/images/ja/app-music.gif)

## Manuals

- [English](manuals/en.md#kanata-2nd-voice-bot-manual)
- [日本語](manuals/ja.md#kanata-2nd-voice-bot-マニュアル)

## Requirements

- [Latest Google Chrome](https://www.google.com/chrome/)
- Two pairs of virtual playback/recording devices ([Voicemeeter Banana](https://www.vb-audio.com/Voicemeeter/banana.htm) recommended)
- [Node.js](https://nodejs.org/) v12 or higher

## Install

```sh
npm run init  # Be aware it's not "npm init"
npm run build # Generate bundle files
npm start     # Start local server
```

## Development

```sh
npm run dev     # Live reloading
npm run lint    # Lint Javascript and Vue codes
npm run beatify # Beatify Javascript and Vue codes
```

## Environment

Copy `env.example.yml` as `env.yml` and set your own ENV.

## Get API key

1. [Create GCP project](https://console.cloud.google.com/cloud-resource-manager) if you don't have
1. Go to [API Library](https://console.cloud.google.com/apis/library)
1. Enable [Custom Search API](https://console.cloud.google.com/apis/library/customsearch.googleapis.com) ([pricing](https://developers.google.com/custom-search/v1/overview#pricing))
1. Enable [Cloud Translation API](https://console.cloud.google.com/apis/library/translate.googleapis.com) ([pricing](https://cloud.google.com/translate/pricing))
1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
1. Create credential as API key
1. Go to the API key detail and set restrictions
    - API restrictions: Custom Search API, Cloud Translation API
    - Application restrictions: HTTP referrers, your site (optional but safer)

## Plugin install

```shell
cd src/plugins
git clone __PLUGIN_REPO__
cd ../..
npm run init
```

## Plugin development

Copy `plugin-example` as `src/plugins/example` and run `npm run init` and see the [example codes](plugin-example/).

## References

- [Language Tag](https://tools.ietf.org/html/bcp47)
- [Web Speech API](https://wicg.github.io/speech-api/)

<details>
<summary>Google Chrome TTS engines</summary>

From the following code.

```js
speechSynthesis.getVoices();
console.log(speechSynthesis.getVoices());
```

- de-DE: Google Deutsch
- en-US: Google US English
- en-GB: Google UK English Female
- en-GB: Google UK English Male
- es-ES: Google español
- es-US: Google español de Estados Unidos
- fr-FR: Google français
- hi-IN: Google हिन्दी
- id-ID: Google Bahasa Indonesia
- it-IT: Google italiano
- ja-JP: Google 日本語
- ko-KR: Google 한국의
- nl-NL: Google Nederlands
- pl-PL: Google polski
- pt-BR: Google português do Brasil
- ru-RU: Google русский
- zh-CN: Google 普通话（中国大陆）
- zh-HK: Google 粤語（香港）
- zh-TW: Google 國語（臺灣）

</details>

<details>
<summary>Google Chrome STT engines</summary>

From [Web Speech API Demonstration](https://www.google.com/intl/en/chrome/demos/speech.html)

- af: af-ZA: Afrikaans
- az: az-AZ: Azərbaycanca
- id: id-ID: Bahasa Indonesia
- ms: ms-MY: Bahasa Melayu
- jv: jv-ID: Basa Jawa
- su: su-ID: Basa Sunda
- ca: ca-ES: Català
- da: da-DK: Dansk
- de: de-DE: Deutsch
- en: English
  - en-AU: Australia
  - en-CA: Canada
  - en-IN: India
  - en-KE: Kenya
  - en-TZ: Tanzania
  - en-GH: Ghana
  - en-NZ: New Zealand
  - en-NG: Nigeria
  - en-ZA: South Africa
  - en-PH: Philippines
  - en-GB: United Kingdom
  - en-US: United States
- es: Español
  - es-AR: Argentina
  - es-BO: Bolivia
  - es-CL: Chile
  - es-CO: Colombia
  - es-CR: Costa Rica
  - es-EC: Ecuador
  - es-SV: El Salvador
  - es-ES: España
  - es-US: Estados Unidos
  - es-GT: Guatemala
  - es-HN: Honduras
  - es-MX: México
  - es-NI: Nicaragua
  - es-PA: Panamá
  - es-PY: Paraguay
  - es-PE: Perú
  - es-PR: Puerto Rico
  - es-DO: República Dominicana
  - es-UY: Uruguay
  - es-VE: Venezuela
- eu: eu-ES: Euskara
- fil: fil-PH: Filipino
- fr: fr-FR: Français
- gl: gl-ES: Galego
- hr: hr-HR: Hrvatski
- zu: zu-ZA: IsiZulu
- it: Italiano
  - it-IT: Italia
  - it-CH: Svizzera
- sw: Kiswahili
  - sw-TZ: Tanzania
  - sw-KE: Kenya
- lv: lv-LV: Latviešu
- lt: lt-LT: Lietuvių
- hu: hu-HU: Magyar
- nl: nl-NL: Nederlands
- nb: nb-NO: Norsk bokmål
- pl: pl-PL: Polski
- pt: Português
  - pt-BR: Brasil
  - pt-PT: Portugal
- ru: ru-RU: Pусский
- ro: ro-RO: Română
- sk: sk-SK: Slovenčina
- sl: sl-SI: Slovenščina
- fi: fi-FI: Suomi
- sv: sv-SE: Svenska
- vi: vi-VN: Tiếng Việt
- tr: tr-TR: Türkçe
- is: is-IS: Íslenska
- cs: cs-CZ: Čeština
- el: el-GR: Ελληνικά
- sr: sr-RS: Српски
- uk: uk-UA: Українська
- bg: bg-BG: български
- hy: hy-AM: Հայերեն
- ur: اُردُو
  - ur-PK: پاکستان
  - ur-IN: بھارت
- ne: ne-NP: नेपाली भाषा
- mr: mr-IN: मराठी
- hi: hi-IN: हिन्दी
- bn: বাংলা
  - bn-BD: বাংলাদেশ
  - bn-IN: ভারত
- gu: gu-IN: ગુજરાતી
- ta: தமிழ்
  - ta-IN: இந்தியா
  - ta-SG: சிங்கப்பூர்
  - ta-LK: இலங்கை
  - ta-MY: மலேசியா
- te: te-IN: తెలుగు
- kn: kn-IN: ಕನ್ನಡ
- ml: ml-IN: മലയാളം
- si: si-LK: සිංහල
- th: th-TH: ภาษาไทย
- lo: lo-LA: ລາວ
- ka: ka-GE: ქართული
- am: am-ET: አማርኛ
- km: km-KH: ភាសាខ្មែរ
- zh: 中文
  - cmn-Hans-CN: 普通话 (中国大陆)
  - cmn-Hans-HK: 普通话 (香港)
  - cmn-Hant-TW: 中文 (台灣)
  - yue-Hant-HK: 粵語 (香港)
- ja: ja-JP: 日本語
- ko: ko-KR: 한국어

</details>

<details>
<summary>Google Cloud Translation languages</summary>

From [Google Cloud Translation Language Support](https://cloud.google.com/translate/docs/languages)

- af: Afrikaans
- am: Amharic
- ar: Arabic
- az: Azerbaijani
- be: Belarusian
- bg: Bulgarian
- bn: Bengali
- bs: Bosnian
- ca: Catalan
- ceb: Cebuano
- co: Corsican
- cs: Czech
- cy: Welsh
- da: Danish
- de: German
- el: Greek
- en: English
- eo: Esperanto
- es: Spanish
- et: Estonian
- eu: Basque
- fa: Persian
- fi: Finnish
- fr: French
- fy: Frisian
- ga: Irish
- gd: Scots Gaelic
- gl: Galician
- gu: Gujarati
- ha: Hausa
- haw: Hawaiian
- he: Hebrew
- hi: Hindi
- hmn: Hmong
- hr: Croatian
- ht: Haitian Creole
- hu: Hungarian
- hy: Armenian
- id: Indonesian
- ig: Igbo
- is: Icelandic
- it: Italian
- ja: Japanese
- jv: Javanese
- ka: Georgian
- kk: Kazakh
- km: Khmer
- kn: Kannada
- ko: Korean
- ku: Kurdish
- ky: Kyrgyz
- la: Latin
- lb: Luxembourgish
- lo: Lao
- lt: Lithuanian
- lv: Latvian
- mg: Malagasy
- mi: Maori
- mk: Macedonian
- ml: Malayalam
- mn: Mongolian
- mr: Marathi
- ms: Malay
- mt: Maltese
- my: Myanmar (Burmese)
- ne: Nepali
- nl: Dutch
- no: Norwegian
- ny: Nyanja (Chichewa)
- pa: Punjabi
- pl: Polish
- ps: Pashto
- pt: Portuguese (Portugal, Brazil)
- ro: Romanian
- ru: Russian
- sd: Sindhi
- si: Sinhala (Sinhalese)
- sk: Slovak
- sl: Slovenian
- sm: Samoan
- sn: Shona
- so: Somali
- sq: Albanian
- sr: Serbian
- st: Sesotho
- su: Sundanese
- sv: Swedish
- sw: Swahili
- ta: Tamil
- te: Telugu
- tg: Tajik
- th: Thai
- tl: Tagalog (Filipino)
- tr: Turkish
- uk: Ukrainian
- ur: Urdu
- uz: Uzbek
- vi: Vietnamese
- xh: Xhosa
- yi: Yiddish
- yo: Yoruba
- zh-CN: Chinese (Simplified)
- zh-TW: Chinese (Traditional)
- zu: Zulu

</details>

<details>
<summary>How to add TTS engine (Windows only)</summary>

```powershell
# Get engines
foreach($voice in Get-ChildItem 'HKLM:\software\Microsoft\Speech_OneCore\Voices\Tokens') { $voice.PSPath }

# Copy engine
copy -Recurse -Destination 'HKLM:\SOFTWARE\Microsoft\Speech\Voices\Tokens' -Path 'Microsoft.PowerShell.Core\Registry::HKEY_LOCAL_MACHINE\software\Microsoft\Speech_OneCore\Voices\Tokens\__TTS_ENGINE_NAME__'
```

</details>

## License

[MIT](./LICENSE)

## About author

Name: Kanata  
Language: Japanese(native) English(intermediate) Chinese(basic)  
Discord: Kanata#3360  
Twitter: https://twitter.com/knt2nd  
GitHub: https://github.com/knt2nd  
