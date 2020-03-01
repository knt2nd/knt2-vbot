export default {
  code: 'en',
  name: 'English',
  locales: ['en-US', 'en-AU', 'en-CA', 'en-IN', 'en-NZ', 'en-ZA', 'en-GB'],
  stt: {
    engines: {
      'en-AU': 'Australia',
      'en-CA': 'Canada',
      'en-IN': 'India',
      'en-NZ': 'New Zealand',
      'en-ZA': 'South Africa',
      'en-GB': 'United Kingdom',
      'en-US': 'United States',
    },
  },
  formatChat: (name, message) => `${name} says, ${message}`,
};
