<template>
  <div>
    <div class="text-center">
      <h2 class="text-center">Upgrades</h2>
      <button v-on:click="showProduction = true" class="btn btn-danger btn-sm col-5 m-1">Production Upgrades</button>
      <button v-on:click="showProduction = false" class="btn btn-danger btn-sm col-5 m-1">Click Upgrades</button>
    </div>
    <div v-if="showProduction">
      <h4>Production Upgrades</h4>
      <ul v-if="upgradeCount.production > 0" class="list-group">
        <production-upgrade v-for="index in upgradeCount.production" v-bind:key="index" v-bind:index="index - 1" />
      </ul>
    </div>
    <div v-else>
      <h4>Click Upgrades</h4>
      <ul v-if="upgradeCount.click > 0" class="list-group">
        <click-upgrade v-for="index in upgradeCount.click" v-bind:key="index" v-bind:index="index - 1" />
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ProductionUpgrade from "./Upgrades/ProductionUpgrade.vue";
import ClickUpgrade from "./Upgrades/ClickUpgrade.vue";

export default {
  name: "Upgrades",
  components: {
    ProductionUpgrade,
    ClickUpgrade,
  },
  computed: {
    ...mapGetters(["upgradeCount"]),
  },
  data: function () {
    return {
      showProduction: true,
    };
  },
};
</script>
