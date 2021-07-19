import { readJsonSync, writeFileSync } from "fs-extra"

import { array } from "../../scripts/util"

interface Tree {
  name: string
  oldHarvest: string
  newHarvest: string
}

const json = readJsonSync("json/blocks.json")
const factor = 1.5
const trees: Tree[] = []

json.blocks.block
  .filter((block) => block._name.startsWith("tree") && block.drop)
  .forEach((tree) => {
    const wood = array(tree.drop).find((d) => d._name === "resourceWood")

    if (wood) {
      trees.push({
        name: tree._name,
        oldHarvest: wood._count,
        newHarvest: wood._count
          .split(",")
          .map((num) => +num * factor)
          .map((num) => Math.round(num))
          .join(","),
      })
    }
  })

const result = trees
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((tree) => {
    const name = ('"' + tree.name + '"').padEnd(30)
    const oldHarvest = ('"' + tree.oldHarvest + '"').padEnd(10)
    return `  <set xpath='/blocks/block[@name=${name}]/drop[@name="resourceWood" and @count=${oldHarvest}]/@count'>${tree.newHarvest}</set>`
  })
  .join("\n")

const xml = `<config>
${result}
</config>
`

writeFileSync(__dirname + "/Config/blocks.xml", xml, "utf8")
