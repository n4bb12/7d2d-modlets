import { writeFileSync } from "fs-extra"
import { range } from "lodash"

const maxLevel = 500 // default 300
const expToLevel = 10000 // default 10000
const experienceMultiplier = Math.pow(10, 1 / 80) // default 1.05
const skillPointsPerLevel = 4 // default 1
// You can spend 320 skill points. You start at level 1 with 0 skill points. You
// get 4 skill points from the starter quest. Then skillPointsPerLevel per
// level.
const clampExpCostAtLevel = 1 + Math.ceil((320 - 4) / skillPointsPerLevel) // default 60

const xml = `<config>
  <set xpath='/progression/level/@max_level'>${maxLevel}</set>
  <set xpath='/progression/level/@exp_to_level'>${expToLevel}</set>
  <set xpath='/progression/level/@experience_multiplier'>${experienceMultiplier}</set>
  <set xpath='/progression/level/@skill_points_per_level'>${skillPointsPerLevel}</set>
  <set xpath='/progression/level/@clamp_exp_cost_at_level'>${clampExpCostAtLevel}</set>
</config>
`
let xpTotal = 0

writeFileSync(__dirname + "/Config/progression.xml", xml, "utf8")

const rows = range(1, maxLevel).map((index) => {
  const level = index + 1
  const xpCurrentLevel = Math.floor(
    expToLevel * Math.pow(experienceMultiplier, level),
  )

  xpTotal += xpCurrentLevel

  return { level, xp: xpCurrentLevel, xpTotal, percentage: 0 }
})

rows.forEach((row) => {
  row.percentage = Math.round((10_000 * row.xp) / xpTotal)
})

const table = `| Level |      XP |   Total XP | 1/10000 |
| :---- | ------: | ---------: | ------: |
${rows
  .map((row) => {
    return (
      " | " +
      row.level.toString().padEnd(5) +
      " | " +
      row.xp.toLocaleString().padStart(7) +
      " | " +
      row.xpTotal.toLocaleString().padStart(10) +
      " | " +
      row.percentage.toString().padStart(7) +
      " | "
    ).trim()
  })
  .join("\n")}
`

writeFileSync(__dirname + "/progression.md", table, "utf8")
