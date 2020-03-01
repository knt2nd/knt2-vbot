// eslint-disable-next-line no-undef
const wpEnv = ENV;

const env = {
  mode: null,
  autostart: false,
  intro: null,
  settings: {},
};

if (wpEnv) Object.assign(env, wpEnv);

export default env;
