<template>
  <v-container class="text-center font-weight-bold subtitle-2 mt-1">
    <v-icon
      v-if="icon"
      class="mr-1"
    >
      {{ icon }}
    </v-icon>
    <span>{{ title }}</span>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
};
</script>
