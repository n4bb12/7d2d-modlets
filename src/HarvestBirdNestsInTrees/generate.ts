import { readJsonSync, writeFileSync } from "fs-extra"

import { array } from "../../scripts/util"

const json = readJsonSync("json/blocks.json")

const changes = json
  .blocks
  .block
  .filter(block => block._name.startsWith("tree") && block.drop)
  .map(tree => {
    const wood = array(tree.drop).find(d => d._name === "resourceWood")

    if (wood && +wood._count > 0) {
      return {
        name: tree._name,
        wood: +wood._count,
      }
    }
  })
  .filter(Boolean)
  .map(tree => {
    const chance = Math.round(tree.wood / 30)
    const numEggs = `${chance * 1},${chance * 2}`
    const numFeathers = `${chance * 2},${chance * 4}`

    return `  <append xpath='/blocks/block[@name="${tree.name}"]'>
    <drop event="Destroy" name="foodEgg" count="${numEggs}" prob="0.25" tag="oreWoodHarvest" />
    <drop event="Destroy" name="resourceFeather" count="${numFeathers}" prob="0.75" tag="oreWoodHarvest" />
  </append>`
  })
  .join("\n")

const xml = `<config>
${changes}
</config>
`

writeFileSync(__dirname + "/Config/blocks.xml", xml, "utf8")
