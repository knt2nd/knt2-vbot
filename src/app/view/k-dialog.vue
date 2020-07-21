<template>
  <span v-if="data">
    <v-dialog
      v-model="visible"
      :persistent="data.persistent"
      :max-width="data.width || 360"
      max-height="500"
    >
      <v-card>
        <v-card-title>{{ data.title }}</v-card-title>
        <v-card-text v-if="data.message || data.links">
          <div v-if="data.message">{{ data.message }}</div>
          <div v-if="data.links">
            <a
              v-for="(uri, label) in data.links"
              :key="label"
              :href="uri"
              class="mr-3"
              target="_blank"
            >{{ label }}</a>
          </div>
        </v-card-text>
        <v-container
          v-if="data.code"
          class="pa-0"
          style="height: 300px; overflow: scroll"
        >
          <div
            class="code"
          >{{ data.code }}</div>
        </v-container>
        <v-container v-if="data.multiSelect">
          <v-select
            v-model="_value"
            :items="data.multiSelect"
            multiple
            chips
            dense
          />
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-for="(callback, label) in data.buttons"
            :key="label"
            color="blue darken-1"
            text
            @click="callback ? callback(value) : $emit('close')"
          >{{ label }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data: function() {
    return {
      value: null,
    };
  },
  computed: {
    visible: {
      get: function() { return !!this.data; },
      set: function(value) { if (!value) this.$emit('close'); },
    },
    _value: {
      get: function() { return this.data.value; },
      set: function(value) { this.value = value; },
    },
  },
};
</script>

<style>
.code {
  padding: 0.6em 1em;
  background-color: #f5f5f5;
  color: #bd4147;
  white-space: pre-wrap;
  font-family: monospace,monospace;
  font-size: 0.8em;
}
</style>
