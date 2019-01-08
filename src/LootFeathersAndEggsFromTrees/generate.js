const json = require(process.cwd() + "/config/blocks")
const trees = []

json.blocks.block
  .filter(block => block._name.startsWith("tree") && block.drop)
  .forEach(tree => {
    if (!Array.isArray(tree.drop)) {
      tree.drop = [tree.drop]
    }
    const wood = tree.drop.find(d => d._name === "resourceWood")

    if (wood && +wood._count > 0) {
      const harvestCountMin = Math.round(+wood._count / 20)
      const harvestProbMin = +wood._count / 1000

      trees.push({
        name: tree._name,
        harvestCount: `${harvestCountMin},${harvestCountMin * 3}`,
        harvestProbMin,
      })
    }
  })

const result = trees
  .map(tree => `<append xpath='/blocks/block[@name="${tree.name}"]'>
  <drop event="Harvest" name="foodEgg" count="${tree.harvestCount}" prob="${(tree.harvestProbMin * 1).toFixed(2)}" tag="oreWoodHarvest" />
  <drop event="Harvest" name="resourceFeather" count="${tree.harvestCount}" prob="${(tree.harvestProbMin * 3).toFixed(2)}" tag="oreWoodHarvest" />
</append>`)
  .join("")

console.log(`<config>${result}</config>`)
