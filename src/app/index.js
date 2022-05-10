import './discord';
import Client from './client/';

let client = null;
window.onload = speechSynthesis.onvoiceschanged = () => {
  if (client) return;
  // https://stackoverflow.com/questions/21513706/getting-the-list-of-voices-in-speechsynthesis-web-speech-api
  const voices = speechSynthesis.getVoices();
  if (!voices || !voices.length || client) return;
  client = new Client({ voices, locales: navigator.languages });
};

window.onbeforeunload = () => {
  if (client) client.destroy();
};
