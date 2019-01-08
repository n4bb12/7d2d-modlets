const json = require(process.cwd() + "/config/loot")
const containers = {}

json.lootcontainers.lootcontainer
  .forEach(container => {
    const sizeX = +container._size.split(",")[0]
    const sizeY = +container._size.split(",")[1]
    const slots = sizeX * sizeY

    // only use even numbers, never make them taller than wide
    let size = "6,2"
    if (slots >= 6 * 4) size = "6,4"
    if (slots >= 6 * 6) size = "6,6"
    if (slots >= 8 * 8) size = "8,8"

    containers[container._id] = {
      id: container._id,
      oldSize: container._size,
      size,
    }
  })

containers["1"].size = "8,8"// player-crafted storage
containers["2"].size = "8,10"// player-dropped backpack
containers["6"].size = "6,2"// wooden desk
containers["12"].size = "8,8"// POI storage box that looks like the player-built one
containers["24"].size = "6,2"// iron desk
containers["34"].size = "8,8"// air drop
containers["76"].size = "6,2"// bicycle
containers["77"].size = "6,4"// minibike
containers["78"].size = "6,4"// motorcycle
containers["79"].size = "8,8"// 4x4 truck
containers["80"].size = "6,2"// gyrocopter
containers["19"].size = "8,8"// cars

const result = Object.values(containers)
  .map(c => `<set xpath='/lootcontainers/lootcontainer[@id="${c.id}" and @size="${c.oldSize}"]/@size'>${c.size}</set>`)
  .join("\n")

console.log(`<config>${result}</config>`)
