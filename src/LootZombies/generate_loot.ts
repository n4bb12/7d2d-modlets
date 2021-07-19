import { readFileSync, writeFileSync } from "fs-extra"
import { uniq } from "lodash"

import { round } from "../../scripts/util"
import { getStackSize } from "../../stats/stack"

import {
  BAG_ID_OFFSET,
  BAG_SIZE,
  ITEMS_PER_BAG,
  LOOT_FREQUENCY_MULTIPLIER,
} from "./config"
import { loot } from "./loot"
import { Shared } from "./loot_shared"

const economicValue = readFileSync("stats/economic-value.txt", "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line)
  .map((line) => line.split(/\s+/))
  .reduce((map, parts) => {
    map[parts[0]] = parts[1]
    return map
  }, {})

const missing: string[] = []

function renderItem(name) {
  const namePadded = ('"' + name + '"').padEnd(50)
  const stack = getStackSize(name) || 1
  const stackSqrt = Math.pow(stack, 0.5)
  const ec = economicValue[name]
  const frequency = LOOT_FREQUENCY_MULTIPLIER / (ec || Number.MAX_SAFE_INTEGER)
  const countPadded = ('"1,' + Math.round(stackSqrt) + '"')
    .replace(/"1,1"/, '"1"')
    .padEnd(10)
  const probPadded = ('"' + round(frequency) + '"').padEnd(10)

  if (!ec) {
    missing.push(name)
  }

  return `      <item name=${namePadded} count=${countPadded} prob=${probPadded}/>`
}

function renderLootgroup(name, items) {
  return `
    <!-- ${name} -->
    <lootgroup name="zombieLoot${name}" count="1">
${items}
    </lootgroup>`
}

function renderLootcontainer(name, index, items) {
  return `
    <!-- ${name} -->
    <lootcontainer id="${
      BAG_ID_OFFSET + index
    }" count="${ITEMS_PER_BAG}" size="${BAG_SIZE}" destroy_on_close="false" sound_open="UseActions/open_backpack" sound_close="UseActions/close_backpack" open_time="1" loot_quality_template="baseTemplate">
${items}
    </lootcontainer>`
}

function renderConfig(lootGroups, lootContainers) {
  return `<config>
  <append xpath='/lootcontainers'>
${lootGroups}
${lootContainers}

  </append>
</config>
`
}

const groups = renderLootgroup("Shared", Shared.map(renderItem).join("\n"))

const containers = Object.keys(loot)
  .map((name, index) => {
    const items =
      loot[name]
        .sort((a, b) => {
          const aValue = economicValue[a]
          const bValue = economicValue[b]
          if (aValue !== typeof bValue) {
            return aValue - bValue
          }
          return a.localeCompare(b)
        })
        .map(renderItem)
        .join("\n") +
      `

      <item group="zombieLootShared" />`

    return renderLootcontainer(name, index, items)
  })
  .join("\n")

const lootXml = renderConfig(groups, containers)
writeFileSync(__dirname + "/Config/loot.xml", lootXml, "utf8")

uniq(missing)
  .sort()
  .forEach((name) => {
    console.error("Missing economic value: " + name)
  })
