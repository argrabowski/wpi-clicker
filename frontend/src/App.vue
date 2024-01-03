<template class="bg-light">
  <div id="wrapper" class="container-fluid col-8">
    <div class="row border border-3 border-danger rounded">
      <h1 class="text-center">WPI Clicker</h1>
    </div>
    <br>
    <div class="row">
      <div class="col-md-4">
        <Login/>
        <br>
        <Scores/>
      </div>
      <Clicker class="col-md-4" />
      <Upgrades class="col-md-4" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import Login from "./components/Login.vue";
import Scores from "./components/Scores.vue";
import Clicker from "./components/Clicker.vue";
import Upgrades from "./components/Upgrades.vue";

export default {
  name: "App",
  components: {
    Login,
    Scores,
    Clicker,
    Upgrades,
  },
  computed: {
    ...mapGetters(["user"])
  },
  data: function () {
    return {
      tickIntervalID: null,
      updateIntervalID: null
    };
  },
  mounted: function () {
    this.$store.commit("initializeState");
    this.tickIntervalID = setInterval(this.runProductionTick, 1000);
    this.updateIntervalID = setInterval(this.updateBackend, 10000)
  },
  beforeUnmount: function() {
    clearInterval(this.tickIntervalID)
    clearInterval(this.updateIntervalID)
  },
  sockets: {
    updateScores: function(data) {
      console.log('scores update received!', data)
      this.$store.commit("updateScores", data)
    },
    login: function(data) {
      console.log('login data received', data)
      let loginData = {
        score: data.currScore,
        user: {
          production: data.prodUpgrades,
          click: data.clickUpgrades
        }
      }
      this.$store.commit("login", loginData)
    }
  },
  methods: {
    ...mapMutations(["runProductionTick"]),
    updateBackend() {
      this.$socket.emit('update', this.user)
    }
  },
};
</script>

<style>
#wrapper {
  padding-top: 2em;
}
</style>
