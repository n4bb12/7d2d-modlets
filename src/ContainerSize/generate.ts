import { readJsonSync, writeFileSync } from "fs-extra"

interface Container {
  id: string
  oldSize: number
  size: string
}

const json = readJsonSync("json/loot.json")
const containers: { [id: string]: Container } = {}

json.lootcontainers.lootcontainer
  .forEach(container => {
    const sizeX = +container._size.split(",")[0]
    const sizeY = +container._size.split(",")[1]
    const slots = sizeX * sizeY

    // only use even numbers, never make them taller than wide
    let size = "6,2"
    if (slots >= 6 * 4) { size = "6,4" }
    if (slots >= 6 * 6) { size = "6,6" }
    if (slots >= 8 * 6) { size = "8,6" }
    if (slots >= 8 * 8) { size = "8,8" }

    containers[container._id] = {
      id: container._id,
      oldSize: container._size,
      size,
    }
  })

containers["1"].size = "6,4"// player-crafted chest
containers["1"].size = "6,6"// player-crafted storage box
containers["2"].size = "8,10"// player-dropped backpack
containers["5"].size = "6,4"// stove
containers["6"].size = "6,2"// wooden desk
containers["8"].size = "6,6"// cupboards
containers["12"].size = "6,6"// POI storage box that looks like the player-built one
containers["18"].size = "6,4"// washing machine
containers["24"].size = "6,2"// iron desk
containers["34"].size = "6,6"// air drop
containers["41"].size = "6,2"// reinforced chest
containers["42"].size = "6,6"// gun safe
containers["43"].size = "6,4"// locker
containers["47"].size = "6,6"// fridge
containers["52"].size = "6,6"// beverage cooler
containers["66"].size = "8,8"// dumpster
containers["69"].size = "6,6"// green drawer
containers["76"].size = "6,2"// bicycle
containers["77"].size = "6,4"// minibike
containers["78"].size = "6,4"// motorcycle
containers["79"].size = "8,8"// 4x4 truck
containers["80"].size = "6,2"// gyrocopter
containers["19"].size = "6,4"// cars

const result = Object.values(containers)
  .map(c => `  <set xpath='/lootcontainers/lootcontainer[@id="${c.id}" and @size="${c.oldSize}"]/@size'>${c.size}</set>`)
  .join("\n")

const xml = `<config>
  <append xpath='/lootcontainers'>
    <!-- smaller container for small wooden chests -->
    <lootcontainer id="199" count="0" size="6,2" sound_open="UseActions/open_chest" sound_close="UseActions/close_chest" loot_quality_template="baseTemplate">
      <item name="cobweb" count="1,2"/>
    </lootcontainer>

    <!-- bigger container for full cupboards -->
    <lootcontainer id="198" count="1,2" size="6,6" sound_open="UseActions/open_cupboard" sound_close="UseActions/close_cupboard" loot_quality_template="baseTemplate">
      <item group="cupboard"/>
    </lootcontainer>

    <!-- bigger container for hardened chest -->
    <lootcontainer id="197" count="2,6" size="8,6" sound_open="UseActions/open_safe" sound_close="UseActions/close_safe" open_time="1" loot_quality_template="baseTemplate">
      <item group="weaponsBasicGuns+ammo" loot_prob_template="probTemplate0.5to1.0"/>
      <item name="oldCash" count="10,450" prob="0.1"/>
      <item group="ammo" count="3,5"/>
      <item group="ammoSteel" count="1,2"/>
      <item group="modAllT1" prob=".1"/>
      <item group="modAllT2" prob=".1"/>
      <item group="modAllT3" prob=".1"/>
    </lootcontainer>

    <!-- bigger container for full lockers -->
    <lootcontainer id="196" count="1,2" size="6,4" sound_open="UseActions/open_locker" sound_close="UseActions/close_locker" loot_quality_template="baseTemplate">
      <item group="clothes" prob="28"/>
      <item group="hats" prob="10"/>
      <item group="ammo" prob="0.02"/>
      <item group="weaponsShotgun+ammo" prob="0.02"/>
      <item group="books" count="1,2"/>
      <item name="resourcePaper" count="1,2" prob="0.7"/>
      <item name="oldCash" count="1,40" prob="0.3"/>
      <item group="medicine" prob="0.05"/>
      <item group="trophyGroup"/>
      <item name="resourceGunPowder" count="1,5"/>
    </lootcontainer>
  </append>

${result}
</config>
`

writeFileSync(__dirname + "/Config/loot.xml", xml, "utf8")
