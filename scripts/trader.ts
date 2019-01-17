import { readJsonSync, writeFileSync } from "fs-extra"
import { identity, uniqBy } from "lodash"

function getEconomicValue(allEntities, entity) {
  if (!Array.isArray(entity.property)) {
    entity.property = [entity.property]
  }
  const ecoProp = entity.property.find(p => p._name === "EconomicValue")
  if (ecoProp) {
    return ecoProp._value
  }
  const extProp = entity.property.find(p => p._name === "Extends")
  if (extProp) {
    const parent = allEntities.find(i => i._name === extProp._value)
    return getEconomicValue(allEntities, parent)
  }
}

const allItems = readJsonSync("json/items.json").items.item

const items = allItems
  .filter(item => item.property)
  .map(item => {
    const value = getEconomicValue(allItems, item)
    if (value) {
      return { name: item._name, value }
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

const all = [
  ...items,
  ...blocks,
]

const list = uniqBy(all, "name")
  .sort((a, b) => {
    if (a.value !== b.value) {
      return +b.value - +a.value
    }
    return a.name.localeCompare(b.name)
  })
  .map(item => `${item.name.padEnd(60)}${item.value.padStart(5)}`)
  .join("\n") + "\n"

writeFileSync(`stats/economic-value.txt`, list, "utf8")
