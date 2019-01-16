import { readJsonSync, writeFileSync } from "fs-extra"

interface Quest {
  id: string
  xp: number
}

const json = readJsonSync("json/quests.json")
const factor = 5
const quests: Quest[] = []

json.quests.quest.forEach(q => {
  if (!q.reward) {
    return
  }
  if (!Array.isArray(q.reward)) {
    q.reward = [q.reward]
  }
  const xpNode = q.reward.find(r => r._type === "Exp")
  if (xpNode) {
    quests.push({
      id: q._id,
      xp: q.reward.find(r => r._type === "Exp")._value,
    })
  }
})

const result = quests
  .sort((a, b) => a.xp - b.xp)
  .map(q => {
    const id = ("\"" + q.id + "\"").padEnd(40)
    const oldVal = ("\"" + q.xp + "\"").padEnd(10)
    const newVal = Math.round(q.xp * factor)
    return `  <set xpath='/quests/quest[@id=${id}]/reward[@type="Exp" and @value=${oldVal}]/@value'>${newVal}</set>`
  })
  .join("\n")

const xml = `<config>
${result}
</config>
`

writeFileSync(__dirname + "/Config/quests.xml", xml, "utf8")
