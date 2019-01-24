import { writeFileSync } from "fs-extra"
import { range } from "lodash"

const maxLevel = 300
const expToLevel = 9545
const experienceMultiplier = 1.01
const skillPointsPerLevel = 1

const xml = `<config>
  <set xpath='/progression/level[@max_level="300"]/@max_level'>${maxLevel}</set>
  <set xpath='/progression/level[@exp_to_level="9545"]/@exp_to_level'>${expToLevel}</set>
  <set xpath='/progression/level[@experience_multiplier="1.0149"]/@experience_multiplier'>${experienceMultiplier}</set>
  <set xpath='/progression/level[@skill_points_per_level="1"]/@skill_points_per_level'>${skillPointsPerLevel}</set>
</config>
`
let xpCurrentSum = 0

writeFileSync(__dirname + "/Config/progression.xml", xml, "utf8")

const rows = range(1, 301)
  .map(level => {
    const xp = Math.floor(expToLevel * Math.pow(experienceMultiplier, level))
    const xpTotal = Math.floor(xpCurrentSum + xp)
    xpCurrentSum = xpTotal

    return { level, xp, xpTotal, percentage: 0 }
  })

rows.forEach(row => {
  row.percentage = Math.round(10000 * row.xp / xpCurrentSum)
})

const table = `
| Level | XP | Total XP | 1/10000 |
| :---- | -: | -------: | ------: |
${rows.map(row => {
  return "| "
    + row.level.toString().padEnd(5) + "| "
    + row.xp.toLocaleString().padStart(10) + " | "
    + row.xpTotal.toLocaleString().padStart(15) + " | "
    + row.percentage.toString().padStart(10) + " |"
}).join("\n")}
`

writeFileSync(__dirname + "/progression.md", table, "utf8")
