<template>
  <div class="logs">
    <div
      v-for="log in data"
      :key="log.id"
      :class="log.classes"
      :style="log.styles"
      class="log"
    >
      <div class="log-time">
        {{ log.time }}
      </div>
      <div class="log-message body-2">
        {{ log.message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style>
.logs .log:first-child {
  padding-top: 0.3em;
}

.log-time {
  padding: 0.5em 1.4em;
  position: absolute;
  font-size: 0.7em;
}

.log-message {
  position: relative;
  padding: 0.3em;
  left: 3.6em;
  width: calc(100% - 3.6em);
}
</style>
