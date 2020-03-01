<template>
  <v-text-field
    v-model="_value"
    :type="visible ? 'text' : 'password'"
    :disabled="disabled"
    :prepend-icon="icon"
    :append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
    :label="label"
    :rules="rules"
    :placeholder="placeholder"
    :counter="counter"
    :counter-value="counterValue"
    :dense="dense"
    @change="$emit('change', $event)"
    @click:append="visible = !visible"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: undefined,
    },
    label: {
      type: String,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    counter: {
      type: [Boolean, Number, String],
      default: undefined,
    },
    counterValue: {
      type: Function,
      default: null,
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  data: function() {
    return {
      visible: false,
    };
  },
  computed: {
    _value: {
      get: function() { return this.value; },
      set: function(value) { this.$emit('input', value); },
    },
  },
};
</script>
