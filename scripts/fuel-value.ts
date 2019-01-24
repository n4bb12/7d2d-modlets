import { readJsonSync, writeFileSync } from "fs-extra"
import { identity, uniqBy } from "lodash"

import { array } from "./util"

const allItems = readJsonSync("json/items.json").items.item
const allBlocks = readJsonSync("json/blocks.json").blocks.block
const allRecipes = readJsonSync("json/recipes.json").recipes.recipe

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

function getFuelValue(allEntities, entity) {
  return getValue(allEntities, entity, "FuelValue")
}

function isCraftable(item) {
  return allRecipes.find(r => r._name === item._name)
}

const items = allItems
  .filter(item => item.property)
  .map(item => {
    const name = item._name
    const value = getFuelValue(allItems, item)
    const craftable = isCraftable(item)
    if (value) {
      return { name, value, craftable }
    }
  })
  .filter(identity)

const blocks = allBlocks
  .filter(block => block.property)
  .map(block => {
    const name = block._name
    const value = getFuelValue(allBlocks, block)
    const craftable = isCraftable(block)
    if (value) {
      return { name, value, craftable }
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

function saveTable(entries, filename) {
  const table = entries
    .map(item => {
      return `| ${item.name.padEnd(45)} | ${item.value.padStart(10)} | ${item.craftable ? "X" : " "} |`
    })
    .join("\n")

  const fileContents = `
| Item | FuelValue | Craftable |
| :--- | --------: | :-------: |
${table}
`

  writeFileSync(`stats/${filename}`, fileContents, "utf8")
}

saveTable(all, "fuel-value.md")
