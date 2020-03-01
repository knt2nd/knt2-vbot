import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';

// https://cse.google.com/cse
// https://developers.google.com/custom-search/v1/cse/list
const API_URI = 'https://www.googleapis.com/customsearch/v1';
const TIMEZONE = 'America/Los_Angeles'; // PST or PDT

export default {
  name: '@cse',
  description: 'Custom Search Engine',
  order: 18481,
  settings: {
    key: { value: '', type: 'password', disable: true },
    cx:  { value: '', disable: true },
    limit: { value: 100, min: 0, max: 1000, step: 1 }, // daily free usage: 100 queries
  },
  userStore: {
    counter: 0,
    date: '',
  },
  methods: {
    search: function(params) {
      if (!this.$p.active) throw new Error('@cse is not active');
      if (!params.q) throw new Error('query undefined');
      if (this.$p.limit) {
        const now = moment.tz(TIMEZONE);
        if (!this.$u.date || now.isAfter(this.$u.date, 'day')) {
          this.$u.counter = 0;
          this.$u.date = now;
        }
        if (this.$u.counter >= this.$p.limit) {
          throw new Error(`search limit (${this.$p.limit} queries per day)`);
        }
        this.$u.counter++;
      }
      if (!params.key) params.key = this.$p.key;
      if (!params.cx) params.cx = this.$p.cx;
      return axios.get(API_URI, { params });
    },
  },
  onlaunched: function(e) {
    if (this.$u.date) this.$u.date = moment(this.$u.date).tz(TIMEZONE);
  },
};
