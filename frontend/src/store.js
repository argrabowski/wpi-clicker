import { createStore } from "vuex";

import stats from "./data/stats.json";

import { upgradeCost } from "./logic/upgrades";

export default createStore({
  state: {
    score: 0,
    scorePerTick: 0,
    scorePerClick: 0,
    stats: {
      production: [],
      click: [],
    },
    user: {
      production: {},
      click: {},
    },
    scores: []
  },
  getters: {
    score(state) {
      return state.score;
    },
    user(state) {
      let user = state.user
      user.score = state.score
      return user
    },
    scores(state) {
      return state.scores.sort((a, b) => {
        return b.score - a.score
      })
    },
    scorePerTick(state) {
      return state.scorePerTick;
    },
    scorePerClick(state) {
      return state.scorePerClick;
    },
    upgradeCount(state) {
      return {
        production: state.stats.production.length,
        click: state.stats.click.length,
      };
    },
    productionUpgradeStats(state) {
      return state.stats.production;
    },
    productionUpgradeLevels(state) {
      return state.user.production;
    },
    clickUpgradeStats(state) {
      return state.stats.click;
    },
    clickUpgradeLevels(state) {
      return state.user.click;
    },
  },
  mutations: {
    initializeState(state) {
      state.stats = stats;
      state.stats.production.sort((a, b) => {
        return a.index - b.index;
      });
      state.stats.production.forEach((upgrade) => {
        state.user.production[upgrade.index] = 0;
      });
      state.stats.click.sort((a, b) => {
        return a.index - b.index;
      });
      state.stats.click.forEach((upgrade) => {
        state.user.click[upgrade.index] = 0;
      });
    },
    login(state, loginData) {
      state.score = loginData.score
      state.user = loginData.user
    },
    updateScores(state, scores) {
      state.scores = scores
    },
    runProductionTick(state) {
      let tickPower = 0;
      Object.keys(state.user.production).forEach((indexString) => {
        let index = parseInt(indexString);
        let level = state.user.production[index];
        let powerPerLevel = state.stats.production[index].power;
        tickPower += level * powerPerLevel;
      });

      state.scorePerTick = tickPower;
      state.score += tickPower;
    },
    incrementScore(state) {
      let clickPower = 1;
      Object.keys(state.user.click).forEach((indexString) => {
        let index = parseInt(indexString);
        let level = state.user.click[index];
        let powerPerLevel = state.stats.click[index].power;
        clickPower += level * powerPerLevel;
      });

      state.scorePerClick = clickPower;
      state.score += clickPower;
    },
    applyUpgrade(state, upgradeInfo) {
      let { type, index } = upgradeInfo;
      let stats = state.stats[type][index];
      let user = state.user[type];
      let baseCost = stats.baseCost;
      let level = user[index];
      let cost = upgradeCost(baseCost, level);

      if (cost <= state.score) {
        state.user[type][index]++;
        state.score -= cost;
      }
    },
  },
});
