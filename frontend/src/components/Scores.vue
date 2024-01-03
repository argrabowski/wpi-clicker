<template>
  <div>
    <h2 class="text-center">Live Scores</h2>
    <ul v-if="scores.length > 0" class="list-group text-center">
      <li v-for="user in scores" :key="user" class="list-group-item align-items-center">
        <div class="row">
          <div class="col-6">{{ user.username }}</div>
          <div class="col-6">$ {{ user.score }}</div>
        </div>
      </li>
    </ul>
    <div v-else>
      <p>No logged in users are live right now. Why not be the first?</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "Scores",
  computed: {
    ...mapGetters(["scores"])
  },
};
</script>
