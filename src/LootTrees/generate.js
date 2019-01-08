const json = require(process.cwd() + "/config/blocks")
const factor = 2
const trees = []

json.blocks.block
  .filter(block => block._name.startsWith("tree") && block.drop)
  .forEach(tree => {
    if (!Array.isArray(tree.drop)) {
      tree.drop = [tree.drop]
    }
    const wood = tree.drop.find(d => d._name === "resourceWood")

    if (wood) {
      trees.push({
        name: tree._name,
        oldHarvest: wood._count,
        newHarvest: wood._count
          .split(",")
          .map(num => +num * factor)
          .map(num => Math.round(num))
          .join(","),
      })
    }
  })

const result = trees
  .map(tree => `<set xpath='/blocks/block[@name="${tree.name}"]/drop[@name="resourceWood" and @count="${tree.oldHarvest}"]/@count'>${tree.newHarvest}</set>`)
  .join("\n")

console.log(`<config>${result}</config>`)
