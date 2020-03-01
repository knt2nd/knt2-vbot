import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import Vuetify from 'vuetify';
import Vue from 'vue';
import KApp from './k-app.vue';
import KDialog from './k-dialog.vue';
import KPassword from './k-password.vue';
import KHeader from './k-header.vue';
import KPlugin from './k-plugin.vue';

export default class View {
  static create(client) {
    let template = '';
    const components = {};
    client.plugin.plugins.forEach((p, i) => {
      if (!p.ui) return;
      const component = p.ui;
      const name = `plugin-${i}`;
      template += `<${name} :g="g" :p="g.plugin['${p.name}'].settings" :u="g.plugin['${p.name}'].user"/>`;
      component.data = () => ({ d: p.data });
      if (!component.methods) component.methods = {};
      Object.keys(p.methods).forEach(name => {
        component.methods[name] = (...args) => p.$invoker[name](...args);
      });
      component.props = {
        g: {
          type: Object,
          default: () => ({}),
        },
        p: {
          type: Object,
          default: () => ({}),
        },
        u: {
          type: Object,
          default: () => ({}),
        },
      };
      components[name] = component;
    });

    Vue.use(Vuetify);
    Vue.component('k-dialog', KDialog);
    Vue.component('k-password', KPassword);
    Vue.component('k-header', KHeader);
    Vue.component('k-plugin', KPlugin);
    Vue.component('k-plugins', {
      components: components,
      props: {
        g: {
          type: Object,
          default: () => ({}),
        },
      },
      template: `<div>${template}</div>`,
    });

    return new Vue({
      el: '#app',
      components: { KApp },
      computed: {
        client: () => client,
        drawerWidth: () => 360,
      },
      template: '<KApp/>',
      vuetify: new Vuetify({
        theme: {
          dark: client.$.ui.dark,
          themes: {
            light: { secondary: '#ccc' },
            dark:  { secondary: '#555' },
          },
        },
      }),
    });
  }
}
