export function upgradeCost(baseCost, level) {
  let rawCost =  baseCost * Math.pow(1.15, level)
  return rawCost.toFixed()
}