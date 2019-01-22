import { readJsonSync, writeFileSync } from "fs-extra"

import { array } from "./util"

const zombies = readJsonSync("json/entityclasses.json")
  .entity_classes
  .entity_class
  .filter(zombie => !zombie._name.includes("Admin"))
  .filter(zombie => array(zombie.effect_group).find(group => group._name === "Base Effects" || !group._name))

function table(prop, decimals, filteredZombies) {
  const entries = filteredZombies
    .map(zombie => {
      const name = zombie._name
      const baseEffects = array(zombie.effect_group).find(group => group._name === "Base Effects" || !group._name)
      const valueNode = array(baseEffects.passive_effect).find(effect => effect._name === prop)
      if (valueNode) {
        const str = valueNode._value
        const value = Number.isNaN(+str) ? str : +str
        return { name, value }
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.value !== b.value) {
        return b.value - a.value
      }
      return a.name.localeCompare(b.name)
    })
    .map(pair => {
      const value = typeof pair.value === "string" ? pair.value : pair.value.toFixed(decimals)
      return `| ${pair.name.padEnd(30)} | ${value.padStart(10)} |`
    })
    .join("\n")

  return `
### ${prop}
|     |     |
| :-- | --: |
${entries}`
}

writeFileSync("stats/zombies.md", `## Base Effects

- [HealthMax](#HealthMax)
- [PhysicalDamageResist](#PhysicalDamageResist)

${table("HealthMax",             0, zombies)}
${table("PhysicalDamageResist",  0, zombies)}
`, "utf8")
