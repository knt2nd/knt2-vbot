<template>
  <k-plugin
    v-if="p.active"
    title="Example"
    icon="mdi-beaker-outline"
  >
    <v-container>
      <div>Global Settings: {{ g.lang }}</div>
      <div>Plugin Settings: {{ p.text }}</div>
      <div>Plugin User Store: {{ u.favs.join(',') }}</div>
      <div>Plugin Data: {{ d.counter }}</div>
      <div><a href="./plugins/example/assets/example.txt">Asset File</a></div>
    </v-container>
    <v-layout justify-end>
      <v-btn
        class="mr-2"
        @click="clearFavs"
      >
        CLEAR
      </v-btn>
      <v-btn
        @click="countUp"
      >
        UP
      </v-btn>
    </v-layout>
  </k-plugin>
</template>

<style scoped>
/* CSS here */
</style>
