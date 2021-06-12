import { readJsonSync } from "fs-extra"

const items = readJsonSync("json/items.json").items.item

export const Shared = [
  "foodMoldyBread",
  "foodRottingFlesh",
  "foodShamSandwich",
  "resourceBrokenGlass",
  "resourceCloth",
  "resourceFemur",
  "resourceNail",
  ...items.map((item) => item._name).filter((name) => name.startsWith("mod")),
]
