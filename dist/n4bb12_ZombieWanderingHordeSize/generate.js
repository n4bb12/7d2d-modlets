// http://convertjson.com/xml-to-json.htm

const factor = 5
const gamestages = []

json.gamestages.spawner.find(s => s._name === "WanderingHorde").gamestage.forEach(gs => {
  gs.spawn.forEach(s => {
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
  .map(gs => `<set xpath='/gamestages/spawner[@name="WanderingHorde"]/gamestage[@stage="${gs.stage}"]/spawn[@group="${gs.group}" and @num="${gs.num}"]/@num'>${+gs.num * factor}</set>`)
  .join("\n")

console.log(`<config>${result}</config>`)
