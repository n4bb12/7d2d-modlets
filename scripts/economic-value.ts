import { readJsonSync, writeFileSync } from "fs-extra"
import { identity, uniqBy } from "lodash"

import { array } from "./util"

function getValue(allEntities, entity, prop) {
  const ecoProp = array(entity.property).find(p => p._name === prop)
  if (ecoProp) {
    return ecoProp._value
  }
  const extProp = array(entity.property).find(p => p._name === "Extends")
  if (extProp) {
    const parent = allEntities.find(i => i._name === extProp._value)
    return getValue(allEntities, parent, prop)
  }
}

function getEconomicValue(allEntities, entity) {
  return getValue(allEntities, entity, "EconomicValue")
}

function isSellable(allEntities, entity) {
  return getValue(allEntities, entity, "SellableToTrader") !== "false"
}

const allItems = readJsonSync("json/items.json").items.item

const items = allItems
  .filter(item => item.property)
  .map(item => {
    const name = item._name
    const value = getEconomicValue(allItems, item)
    const sellable = isSellable(allItems, item)
    if (value) {
      return { name, value, sellable }
    }
  })
  .filter(identity)

const allBlocks = readJsonSync("json/blocks.json").blocks.block

const blocks = allBlocks
  .filter(block => block.property)
  .map(block => {
    const value = getEconomicValue(allBlocks, block)
    if (value) {
      return { name: block._name, value }
    }
  })
  .filter(identity)

const all = uniqBy([...items, ...blocks], "name")
  .filter(item => {
    return !item.name.includes("Helper")
  })
  .sort((a, b) => {
    if (a.value !== b.value) {
      return +b.value - +a.value
    }
    return a.name.localeCompare(b.name)
  })

const onlySellable = all
  .filter(item => item.sellable)

function saveTable(entries, filename) {
  const table = entries
    .map(item => {
      return `| ${item.name.padEnd(45)} | ${item.value.padStart(10)} | ${item.sellable ? "X" : " "} |`
    })
    .join("\n")

  const fileContents = `
| Item | EconomicValue | Sellable |
| :--- | ------------: | :------: |
${table}
`

  writeFileSync(`stats/${filename}`, fileContents, "utf8")
}

saveTable(all, "economic-value.md")
saveTable(onlySellable, "economic-value-sellable.md")
