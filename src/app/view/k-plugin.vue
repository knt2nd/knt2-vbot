<template>
  <div>
    <k-header
      :title="title"
      :icon="icon"
    />
    <v-card
      class="caption pa-3"
      tile
    >
      <slot />
    </v-card>
  </div>
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
