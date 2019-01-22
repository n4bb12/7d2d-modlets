import { readJsonSync, writeFileSync } from "fs-extra"

import { array } from "./util"

const items = readJsonSync("json/items.json")
  .items
  .item
  .filter(item => !item._name.includes("Admin"))
  .filter(item => array(item.effect_group).find(group => group._name === "Base Effects" || !group._name))

function table(prop, decimals, filteredItems) {
  const entries = filteredItems
    .map(item => {
      const name = item._name
      const baseEffects = array(item.effect_group).find(group => group._name === "Base Effects" || !group._name)
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

writeFileSync("stats/weapons.md", `## Base Effects

- [AttacksPerMinute](#AttacksPerMinute)
- [BlockDamage](#BlockDamage)
- [BlockRange](#BlockRange)
- [DamageFalloffRange](#DamageFalloffRange)
- [EntityDamage](#EntityDamage)
- [MagazineSize](#MagazineSize)
- [MaxRange](#MaxRange)
- [ProjectileVelocity](#ProjectileVelocity)
- [ReloadSpeedMultiplier](#ReloadSpeedMultiplier)
- [RoundsPerMinute](#RoundsPerMinute)
- [SpreadDegreesHorizontal](#SpreadDegreesHorizontal)
- [SpreadDegreesVertical](#SpreadDegreesVertical)
- [SpreadMultiplierAiming](#SpreadMultiplierAiming)
- [SpreadMultiplierCrouching](#SpreadMultiplierCrouching)
- [SpreadMultiplierRunning](#SpreadMultiplierRunning)
- [SpreadMultiplierWalking](#SpreadMultiplierWalking)
- [StaminaLoss](#StaminaLoss)
- [WeaponHandling](#WeaponHandling)

${table("AttacksPerMinute",          0, items)}
${table("BlockDamage",               1, items)}
${table("BlockRange",                1, items)}
${table("DamageFalloffRange",        1, items.filter(i => !i._name.startsWith("melee")))}
${table("EntityDamage",              1, items)}
${table("MagazineSize",              0, items)}
${table("MaxRange",                  2, items)}
${table("ProjectileVelocity",        1, items.filter(i => !i._name.startsWith("gun")))}
${table("ReloadSpeedMultiplier",     2, items)}
${table("RoundsPerMinute",           0, items)}
${table("SpreadDegreesHorizontal",   2, items)}
${table("SpreadDegreesVertical",     2, items)}
${table("SpreadMultiplierAiming",    2, items)}
${table("SpreadMultiplierCrouching", 2, items)}
${table("SpreadMultiplierRunning",   2, items)}
${table("SpreadMultiplierWalking",   2, items)}
${table("StaminaLoss",               2, items)}
${table("WeaponHandling",            2, items)}
`, "utf8")

writeFileSync("stats/armor.md", `## Base Effects

- [ElementalDamageResist](#ElementalDamageResist)
- [HyperthermalResist](#HyperthermalResist)
- [HypothermalResist](#HypothermalResist)
- [PhysicalDamageResist](#PhysicalDamageResist)

${table("ElementalDamageResist", 0, items)}
${table("HyperthermalResist",    0, items)}
${table("HypothermalResist",     0, items)}
${table("PhysicalDamageResist",  0, items)}
`, "utf8")
