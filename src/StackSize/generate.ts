import { readJsonSync, writeFileSync } from "fs-extra"

import { array } from "../../scripts/util"
import { getStackSize, stack } from "../../stats/stack"

interface Item {
  name: string
  oldStack: number
  newStack: number
}

const json = readJsonSync("json/items.json")

const items: Item[] = []

export function getOldStackSize(name: string) {
  const item = json.items.item.find((entry) => entry._name === name)
  const propStacknumber = array(item.property).find(
    (p) => p._name === "Stacknumber",
  )
  if (propStacknumber) {
    return +propStacknumber._value
  }
  const propExtends = array(item.property).find((p) => p._name === "Extends")
  if (propExtends) {
    return getStackSize(
      json.items.item.find((parent) => parent._name === propExtends._value),
    )
  }
}

json.items.item.forEach((item) => {
  const name = item._name
  const oldStack = getOldStackSize(name)
  const newStack = stack[name] || oldStack

  items.push({ name, oldStack, newStack })
})

const stackChanges = items
  .filter((item) => item.oldStack !== item.newStack)
  .sort((a, b) => {
    if (!!a.oldStack !== !!b.oldStack) {
      return a.oldStack ? -1 : 1
    }
    if (a.newStack !== b.newStack) {
      return a.newStack - b.newStack
    }
    return a.name.localeCompare(b.name)
  })
  .map((item) => {
    const name = ('"' + item.name + '"').padEnd(35, " ")
    const oldStack = ('"' + item.oldStack + '"').padEnd(10, " ")
    if (!item.oldStack) {
      return `  <append xpath='/items/item[@name=${name}]'><property name="Stacknumber" value="${item.newStack}"/></append>`
    }
    return `  <set xpath='/items/item[@name=${name}]/property[@name="Stacknumber" and @value=${oldStack}]/@value'>${item.newStack}</set>`
  })
  .join("\n")

const xml = `<config>
${stackChanges}
</config>
`

writeFileSync(__dirname + "/Config/items.xml", xml, "utf8")
