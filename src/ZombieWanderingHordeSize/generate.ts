import { readJsonSync, writeFileSync } from "fs-extra"

import { array } from "../../scripts/util"

interface Gamestage {
  stage: string
  group: string
  num: number
}

const json = readJsonSync("json/gamestages.json")
const factor = 5
const gamestages: Gamestage[] = []

json.gamestages.spawner.find(s => s._name === "WanderingHorde").gamestage.forEach(gs => {
  array(gs.spawn).forEach(s => {
    const group = s._group

    if (!group.includes("Bear") && !group.includes("Dog") && !group.includes("Vulture") && !group.includes("Wolf")) {
      gamestages.push({
        stage: gs._stage,
        group,
        num: s._num,
      })
    }
  })
})

const result = gamestages
  .map(gs => {
    const group = ("\"" + gs.group + "\"").padEnd(30)
    return `<set xpath='/gamestages/spawner[@name="WanderingHorde"]/gamestage[@stage="${gs.stage}"]/spawn[@group=${group} and @num="${gs.num}"]/@num'>${+gs.num * factor}</set>`
  })
  .join("\n")

const xml = `<config>
${result}
</config>
`

writeFileSync(__dirname + "/Config/gamestages.xml", xml, "utf8")
