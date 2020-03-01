<template>
  <k-plugin
    v-show="p.active && d.player && (d.player.running || d.player.queue.length)"
    title="PLAYER"
    icon="mdi-youtube"
  >
    <v-layout justify-center>
      <div id="yt-player" />
    </v-layout>
    <div v-if="d.player">
      <div class="now-playing mt-3">
        Playing: {{ d.player.playingVideo ? d.player.playingVideo.title || `youtu.be/${d.player.playingVideo.id}` : '-' }}
      </div>
      <div v-show="d.player.queue.length">
        <div>Queue: {{ d.player.queue.length }}</div>
        <ol class="queue-list">
          <li
            v-for="(q, i) in d.player.queue"
            :key="q.key"
            class="queue-item"
          >
            <span class="queue-control">
              <v-icon
                small
                @click="remove(i)"
              >mdi-delete-circle</v-icon>
            </span>
            <span class="queue-control">
              <v-icon
                small
                @click="skip(i)"
              >mdi-play-circle</v-icon>
            </span>
            <span>{{ q.title || `youtu.be/${q.id}` }}</span>
          </li>
        </ol>
      </div>
    </div>
  </k-plugin>
</template>

<style scoped>
.now-playing,
.queue-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.queue-list {
  padding: 0;
  max-height: 16em;
  overflow-y: auto;
}

.queue-item {
  padding-left: 0.5em;
  list-style-position: inside;
}

.queue-control {
  display: none;
  float: right;
  padding-right: 0.2em;
}

.queue-item:hover .queue-control {
  display: inline;
}
</style>
