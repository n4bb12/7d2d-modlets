import { readJsonSync, writeFileSync } from "fs-extra"

import { array } from "../../scripts/util"

const items = readJsonSync("json/items.json").items.item
const factor = 0.5

const hands = items
  .filter(item => item._name.startsWith("meleeHand"))
  .map(item => {
    const melee = item.property.find(p => p._class === "Action0")

    if (melee && melee.property) {
      const entityDamage = array(melee.property).find(p => p._name === "DamageEntity")
      const blockDamage = array(melee.property).find(p => p._name === "DamageBlock")

      if (entityDamage && blockDamage) {
        return {
          name: item._name,
          entityDamage: +entityDamage._value,
          blockDamage: +blockDamage._value,
          blockDamageNew: Math.min(+entityDamage._value, +blockDamage._value),
        }
      }
    }
  })
  .filter(Boolean)
  .filter(hand => hand.blockDamage !== hand.blockDamageNew)
  .sort((a, b) => a.blockDamage - b.blockDamage)
  .map(hand => {
    const name = ("\"" + hand.name + "\"").padEnd(40)
    const value = ("\"" + hand.blockDamage + "\"").padEnd(10)
    return `  <set xpath='/items/item[@name=${name}]/property[@class="Action0"]/property[@name="DamageBlock" and @value=${value}]/@value'>${hand.blockDamageNew}</set>`
  })
  .join("\n")

const xml = `<config>
${hands}
</config>
`

writeFileSync(__dirname + "/Config/items.xml", xml, "utf8")
