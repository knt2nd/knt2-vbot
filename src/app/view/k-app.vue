<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mobile-breakpoint="ui.drawerWidth + 240"
      :width="ui.drawerWidth"
      app
    >
      <k-plugins :g="g" />
      <k-header
        title="SETTINGS"
        icon="mdi-settings"
      />

      <v-expansion-panels
        v-model="g.ui.open"
        accordion
        multiple
      >
        <v-expansion-panel>
          <v-expansion-panel-header class="font-weight-bold">
            SYSTEM
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-select
              v-model="g.lang"
              :items="langs"
              prepend-icon="mdi-earth"
              dense
              @change="restartSTT(); triggerByGlobal('lang', $event);"
            />
            <v-select
              v-model="g.engine[g.lang].stt"
              :items="sttEngines[g.lang]"
              prepend-icon="mdi-headphones"
              dense
              @change="restartSTT(); triggerByGlobal('engine.stt', $event);"
            />
            <v-select
              v-model="g.engine[g.lang].tts"
              :items="ttsEngines"
              prepend-icon="mdi-microphone"
              dense
              @change="sampleTTS(); triggerByGlobal('engine.tts', $event);"
            />
            <v-slider
              v-model="g.tts.rate"
              min="0"
              max="100"
              prepend-icon="mdi-speedometer"
              thumb-label
              dense
              @change="sampleTTS(); triggerByGlobal('tts.rate', $event);"
            />
            <v-slider
              v-model="g.tts.pitch"
              min="0"
              max="100"
              prepend-icon="mdi-trending-up"
              thumb-label
              dense
              @change="sampleTTS(); triggerByGlobal('tts.pitch', $event);"
            />
            <v-slider
              v-model="g.tts.volume"
              min="0"
              max="100"
              :prepend-icon="g.tts.volume ? 'mdi-volume-high' : 'mdi-volume-off'"
              thumb-label
              dense
              @change="sampleTTS(); triggerByGlobal('tts.volume', $event);"
            />
            <v-slider
              v-model="g.se.volume"
              min="0"
              max="100"
              :prepend-icon="g.se.volume ? 'mdi-bell' : 'mdi-bell-off'"
              thumb-label
              dense
              @change="sampleSE(); triggerByGlobal('se.volume', $event);"
            />
            <v-switch
              v-if="!hidden['settings.command.voice']"
              v-model="g.command.voice"
              prepend-icon="mdi-account-alert"
              label="Voice Command"
              dense
              @change="triggerByGlobal('command.voice', $event);"
            />
            <v-switch
              v-if="!hidden['settings.command.chat']"
              v-model="g.command.chat"
              prepend-icon="mdi-account-details"
              label="Chat Command"
              dense
              @change="triggerByGlobal('command.chat', $event);"
            />
            <v-switch
              v-if="!hidden['settings.chat.speech']"
              v-model="g.chat.speech"
              prepend-icon="mdi-account-voice"
              label="Chat to Speech"
              dense
              @change="triggerByGlobal('chat.speech', $event);"
            />
            <k-password
              v-if="!hidden['settings.chat.key']"
              v-model="g.chat.key"
              :disabled="status.running"
              icon="mdi-discord"
              placeholder="Discord Bot Token"
              dense
              @change="triggerByGlobal('chat.key', $event);"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          v-for="(plugin, name) in plugins"
          :key="name"
        >
          <v-expansion-panel-header
            :class="!g.plugin[name].settings.active ? 'grey--text' : null"
            class="font-weight-bold"
          >
            {{ name }}
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-container class="caption">
              <div
                v-if="plugin.langs.length"
                class="float-right ml-1 grey--text"
              >
                {{ plugin.langs.join(', ') }}
              </div>
              <div
                v-if="plugin.description"
                class="float-left"
              >
                {{ plugin.description }}
              </div>
              <div style="clear: both" />
            </v-container>
            <span
              v-for="(form, key) in plugin.forms"
              :key="key"
            >
              <span v-if="!hidden[['settings.plugin', name, key].join('.')]">
                <v-switch
                  v-if="form.type === 'switch'"
                  v-model="g.plugin[name].settings[key]"
                  :disabled="status.running && form.disable || !g.plugin[name].settings.active && key !== 'active'"
                  :prepend-icon="form.icon"
                  :label="form.icon ? null : form.label"
                  dense
                  @change="triggerByPlugin(name, key, $event)"
                />
                <v-slider
                  v-if="form.type === 'slider'"
                  v-model="g.plugin[name].settings[key]"
                  :disabled="status.running && form.disable || !g.plugin[name].settings.active"
                  :prepend-icon="form.icon"
                  :label="form.icon ? null : form.label"
                  :min="form.min"
                  :max="form.max"
                  :step="form.step"
                  thumb-label
                  dense
                  @change="triggerByPlugin(name, key, $event)"
                />
                <v-select
                  v-if="form.type === 'select' || form.type === 'multi'"
                  v-model="g.plugin[name].settings[key]"
                  :disabled="status.running && form.disable || !g.plugin[name].settings.active"
                  :prepend-icon="form.icon"
                  :label="form.icon ? null : form.label"
                  :rules="form.rules"
                  :items="form.items"
                  :multiple="form.type === 'multi'"
                  :chips="form.type === 'multi'"
                  dense
                  @change="triggerByPlugin(name, key, $event)"
                />
                <v-text-field
                  v-if="form.type === 'text'"
                  v-model="g.plugin[name].settings[key]"
                  :disabled="status.running && form.disable || !g.plugin[name].settings.active"
                  :prepend-icon="form.icon"
                  :label="form.icon ? null : form.label"
                  :rules="form.rules"
                  :placeholder="form.placeholder"
                  :counter="form.counter"
                  :counter-value="form.counterValue"
                  dense
                  @change="triggerByPlugin(name, key, $event)"
                />
                <k-password
                  v-if="form.type === 'password'"
                  v-model="g.plugin[name].settings[key]"
                  :disabled="status.running && form.disable || !g.plugin[name].settings.active"
                  :icon="form.icon"
                  :label="form.icon ? null : form.label"
                  :rules="form.rules"
                  :placeholder="form.placeholder"
                  :counter="form.counter"
                  :counter-value="form.counterValue"
                  dense
                  @change="triggerByPlugin(name, key, $event)"
                />
                <v-textarea
                  v-if="form.type === 'textarea'"
                  v-model="g.plugin[name].settings[key]"
                  :disabled="status.running && form.disable || !g.plugin[name].settings.active"
                  :prepend-icon="form.icon"
                  :label="form.icon ? null : form.label"
                  :rules="form.rules"
                  :placeholder="form.placeholder"
                  :counter="form.counter"
                  :counter-value="form.counterValue"
                  :rows="form.rows"
                  dense
                  @change="triggerByPlugin(name, key, $event)"
                />
              </span>
            </span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>

    <v-app-bar
      color="light-blue darken-4"
      dark
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Kanata 2nd Voice Bot</v-toolbar-title>
      <v-spacer />

      <v-btn
        :loading="status.starting"
        :color="!status.starting && status.running ? 'deep-orange accent-2' : 'primary' "
        width="100"
        class="mr-5"
        @click="status.running ? stopBot() : startBot()"
      >
        {{ status.running ? 'STOP' : 'START' }}
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="cancelTTS">
            <v-list-item-icon><v-icon>mdi-microphone-off</v-icon></v-list-item-icon>
            <v-list-item-title>Cancel Speech</v-list-item-title>
          </v-list-item>
          <v-list-item @click="downloadLog">
            <v-list-item-icon><v-icon>mdi-download</v-icon></v-list-item-icon>
            <v-list-item-title>Download Log</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="dialog = {
              title: 'Favorite Languages',
              message: 'Set your languages.',
              buttons: { 'OK': favoriteLang, 'CANCEL': null },
              multiSelect: langs,
              value: g.ui.favs,
              persistent: true,
            }"
          >
            <v-list-item-icon><v-icon>mdi-star</v-icon></v-list-item-icon>
            <v-list-item-title>Favorite Lang</v-list-item-title>
          </v-list-item>
          <v-list-item @click.stop="switchTheme">
            <v-list-item-icon><v-icon>{{ g.ui.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }} </v-icon></v-list-item-icon>
            <v-list-item-title>{{ g.ui.dark ? 'Light Theme' : 'Dark Theme' }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="dialog = {
              title: 'Confirm',
              message: 'Are you sure you want to reset all your settings?',
              buttons: { 'YES': resetAll, 'NO': null },
            }"
          >
            <v-list-item-icon><v-icon>mdi-trash-can-outline</v-icon></v-list-item-icon>
            <v-list-item-title>Reset Settings</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="dialog = {
              title: 'Help',
              links: {
                'README': 'https://github.com/knt2nd/knt2-vbot#kanata-2nd-voice-bot',
                'English Manual': 'https://github.com/knt2nd/knt2-vbot/blob/master/manuals/en.md#kanata-2nd-voice-bot-manual',
                '日本語マニュアル': 'https://github.com/knt2nd/knt2-vbot/blob/master/manuals/ja.md#kanata-2nd-voice-bot-マニュアル',
              },
              code: getHelp(),
              width: 500,
              buttons: { 'OK': null }
            }"
          >
            <v-list-item-icon><v-icon>mdi-help</v-icon></v-list-item-icon>
            <v-list-item-title>Help</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <k-logs :data="logs" />
    </v-content>

    <k-dialog
      :data="dialog"
      @close="dialog = null"
    />
  </v-app>
</template>

<script>
import i18n from '../i18n';
import KLogs from './k-logs.vue';

export default {
  components: { KLogs },
  data: function() {
    return {
      drawer: true,
      dialog: null,
      status: this.$parent.client.status,
      g: this.$parent.client.settings.data,
      logs: this.$parent.client.logger.data,
      plugins: this.$parent.client.plugin.viewData,
    };
  },
  computed: {
    ttsEngines: function() { return this.$parent.client.ttss.data.map(engine => ({ text: engine.uri, value: engine })); },
    sttEngines: function() {
      const sttEngines = {};
      i18n.list.forEach(code => {
        sttEngines[code] = [];
        Object.keys(i18n.lang[code].stt.engines).forEach(name => {
          sttEngines[code].push({ text: i18n.lang[code].stt.engines[name], value: name});
        });
      });
      return sttEngines;
    },
    langs: function() {
      const favMap = {};
      const favLangs = this.$parent.client.settings.data.ui.favs;
      favLangs.forEach(code => favMap[code] = true);
      const langs = favLangs.slice();
      i18n.list.forEach(code => { if (!favMap[code]) langs.push(code); });
      return langs.map(code => ({ text: favMap[code] ? `★ ${i18n.lang[code].name}` : i18n.lang[code].name, value: code }));
    },
    hidden: function() {
      const settings = this.$parent.client.env.settings.constant;
      const hidden = {};
      if (!settings) return hidden;
      ['command', 'chat'].forEach(name => {
        if (!settings[name]) return;
        Object.keys(settings[name]).forEach(key => {
          hidden[`settings.${name}.${key}`] = true;
        });
      });
      if (settings.plugin) {
        Object.keys(settings.plugin).forEach(name => {
          if (!settings.plugin[name].settings) return;
          Object.keys(settings.plugin[name].settings).forEach(key => {
            hidden[`settings.plugin.${name}.${key}`] = true;
          });
        });
      }
      return hidden;
    },
    ui: function() { return { drawerWidth: this.$parent.drawerWidth }; },
  },
  methods: {
    startBot: function() { this.$parent.client.startBot(); },
    stopBot: function() { this.$parent.client.stopBot(); },
    restartSTT: function() { this.$parent.client.restartSTT(); },
    cancelTTS: function() { this.$parent.client.cancelTTS(); },
    sampleTTS: function() { this.$parent.client.sampleTTS(); },
    sampleSE: function() { this.$parent.client.sampleSE(); },
    resetAll: function() { this.$parent.client.resetAll(); },
    getHelp: function() { return this.$parent.client.getHelp(this.g.lang); },
    downloadLog: function() { this.$parent.client.downloadLog(); },
    favoriteLang: function(langs) {
      this.dialog = null;
      if (langs) {
        this.g.ui.favs = langs;
        this.triggerByGlobal('ui.favs', this.g.ui.favs);
      }
    },
    switchTheme: function() {
      this.$vuetify.theme.dark = this.g.ui.dark = !this.g.ui.dark;
      this.triggerByGlobal('ui.dark', this.g.ui.dark);
    },
    triggerByGlobal: function(key, value) {
      this.$parent.client.plugin.trigger('globalsettingschanged', { key, value }, true);
    },
    triggerByPlugin: function(name, key, value) {
      this.$parent.client.plugin.triggerOne(name, 'settingschanged', { key, value }, true);
    },
  },
};
</script>

<style>
.theme--dark.v-application {
  background-color: #2e2e2e;
}

.theme--dark.v-list,
.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: #252525;
}
</style>
