import { readJsonSync, writeFileSync } from "fs-extra"
import { identity, uniq } from "lodash"

import { array} from "./util"

const items = readJsonSync("json/items.json")
  .items
  .item
  .filter(item => {
    if (!item.property) {
      return true
    }
    return !array(item.property).find(p => p._name === "CreativeMode" && p._value === "None")
  })
  .map(item => item._name)
  .filter(name => !name.includes("Admin"))

const mods = readJsonSync("json/item_modifiers.json")
  .item_modifiers
  .item_modifier
  .map(mod => mod._name)

const recipes = readJsonSync("json/recipes.json")
  .recipes
  .recipe
  .map(recipe => recipe._name)

const pickup = readJsonSync("json/blocks.json")
  .blocks
  .block
  .filter(block => block.property)
  .filter(block => {
    return array(block.property).find(p => p._name === "CanPickup" && p._value === "true" && !p._param1)
  })
  .map(block => block._name)

const harvest: string[] = []

readJsonSync("json/blocks.json")
  .blocks
  .block
  .filter(block => block.drop)
  .forEach(block => {
    array(block.drop)
      .filter(p => p._event === "Destroy")
      .map(drop => drop._name)
      .forEach(name => harvest.push(name))
  })

const all = uniq([
  ...items,
  ...mods,
  ...recipes,
  ...pickup,
  ...harvest,
])

function save(name, list) {
  const cleanList = uniq(list).filter(identity).sort()
  writeFileSync(`stats/${name}.txt`, cleanList.join("\n") + "\n", "utf8")
}

save("items", all)
save("items-mod", mods)
save("items-craft", recipes)
save("items-pickup", pickup)
save("items-harvest", harvest)
