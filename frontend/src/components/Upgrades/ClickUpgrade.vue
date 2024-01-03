<template>
  <li class="list-group-item align-items-center">
    <div class="row">
      <div class="col-6">
        {{ stats.name }}
        <br />
        <span class="badge bg-danger rounded-pill col-10">Level {{ level }}</span>
        <br />
        <span class="badge bg-danger rounded-pill col-10">Power: $ {{ stats.power }}/click</span>
        <br />
        <button v-on:click="applyUpgrade(upgradeInfo)" v-bind:disabled="!canUpgrade" class="btn btn-danger col-12">
          {{ buttonText }}
        </button>
      </div>
      <div class="col-6">
        <img :src="stats.src" class="img-fluid img-rounded" />
      </div>
    </div>
  </li>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import { upgradeCost } from "../../logic/upgrades";

export default {
  name: "ClickUpgrade",
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["score", "clickUpgradeStats", "clickUpgradeLevels"]),
    stats() {
      return this.clickUpgradeStats[this.index] || {};
    },
    level() {
      return this.clickUpgradeLevels[this.index];
    },
    upgradeCost() {
      return upgradeCost(this.stats.baseCost, this.level);
    },
    upgradeInfo() {
      return {
        type: "click",
        index: this.index,
      };
    },
    buttonText() {
      return `Buy ($${this.upgradeCost})`;
    },
    canUpgrade() {
      return this.score >= this.upgradeCost;
    },
  },
  methods: {
    ...mapMutations(["applyUpgrade"]),
  },
};
</script>
