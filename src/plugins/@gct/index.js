import axios from 'axios';
import he from 'he';
import moment from 'moment';
import 'moment-timezone';

// https://cloud.google.com/translate/docs/reference/rest/v2/translate
const API_URI = 'https://translation.googleapis.com/language/translate/v2?key=';
const TIMEZONE = 'America/Los_Angeles'; // PST or PDT

export default {
  name: '@gct',
  description: 'Google Cloud Translation',
  order: 18480,
  settings: {
    key: { value: '', type: 'password', disable: true },
    limit: { value: 16000, min: 0, max: 100000, step: 1000 }, // monthly free usage: 500,000 characters
  },
  userStore: {
    counter: 0,
    date: '',
  },
  methods: {
    translate: async function(params) {
      if (!this.$p.active) throw new Error('@gct is not active');
      if (!params.target) throw new Error('target undefined');
      if (!params.q) throw new Error('query undefined');
      if (this.$p.limit) {
        const now = moment.tz(TIMEZONE);
        if (!this.$u.date || now.isAfter(this.$u.date, 'day')) {
          this.$u.counter = 0;
          this.$u.date = now;
        }
        if (this.$u.counter >= this.$p.limit) {
          throw new Error(`translation limit (${this.$p.limit} characters per day)`);
        }
        this.$u.counter += params.q.length;
      }
      const res = await axios.post(`${API_URI}${params.key || this.$p.key}`, params);
      const from = res.data.data.translations[0].detectedSourceLanguage;
      const text = he.decode(res.data.data.translations[0].translatedText);
      return {
        to: params.target,
        from,
        text,
      };
    },
  },
  onlaunched: function(e) {
    if (this.$u.date) this.$u.date = moment(this.$u.date).tz(TIMEZONE);
  },
};
