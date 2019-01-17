import { clothes } from "./loot_clothes"
import { items } from "./loot_items"

export const loot = {}

Object.keys(clothes).forEach(key => {
  loot[key] = [...clothes[key], ...items[key]]
})
