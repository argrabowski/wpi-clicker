<template>
  <div class="text-center">
    <h2>$ {{ score }}</h2>
    <h4>{{ scorePerTick }} $/sec</h4>
    <br />
    <button v-on:click="incrementScore" type="button" class="btn btn-light btn-default rounded-circle">
      <img src="../assets/wpi-logo.png" />
    </button>
    <h4>+ $ {{ scorePerClick }}</h4>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Clicker",
  computed: {
    ...mapGetters(["score", "scorePerTick", "scorePerClick"]),
  },
  methods: {
    ...mapMutations(["incrementScore"]),
  },
};
</script>
