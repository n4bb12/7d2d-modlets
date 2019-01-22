import { readFileSync, writeFileSync } from "fs-extra"

import { BAG_ID_OFFSET, BAG_LIFETIME_SECONDS } from "./config"
import { loot } from "./loot"

function renderEntityClass(zombieName, containerName, lootlist) {
  return `
  <!-- ${zombieName} -->
  <entity_class name="${containerName}">
    <property name="Class" value="EntityLootContainer"/>
    <property name="Faction" value="none"/>
    <property name="IsEnemyEntity" value="false"/>
    <property name="LootListOnDeath" value="${lootlist}"/>
    <property name="Mesh" value="LootContainers/zpackPrefab"/>
    <property name="ModelType" value="Custom"/>
    <property name="Parent" value="Backpack"/>
    <property name="Prefab" value="Backpack"/>
    <property name="TimeStayAfterDeath" value="${BAG_LIFETIME_SECONDS}"/>
  </entity_class>`
}

function renderEntityAssignment(zombieName, containerName) {
  return `
  <append xpath='/entity_classes/entity_class[@name="zombie${zombieName}"]'>
    <property name="LootDropEntityClass" value="${containerName}"/>
  </append>`
}

const validZombies = readFileSync("stats/zombies.txt", "utf8")
  .trim()
  .split("\n")
  .reduce((map, id) => {
    map[id] = true
    return map
  }, {})

const entityclasses = Object.keys(loot)
  .map((zombieName, index) => {
    const containerName = `zombie${zombieName}LootBag`
    const lootlist = BAG_ID_OFFSET + index
    const assignments = ["", "Feral", "Radiated"]
      .map(suffix => zombieName + suffix)
      .filter(zombieId => validZombies[zombieId])
      .map(zombieId => renderEntityAssignment(zombieId, containerName))
      .join("\n")

    return [
      renderEntityClass(zombieName, containerName, lootlist),
      assignments,
    ].join("\n\n")
  }).join("\n")

const entityXml = `<config>
  <append xpath='/entity_classes'>
${entityclasses}

  </append>
</config>
`
writeFileSync(__dirname + "/Config/entityclasses.xml", entityXml, "utf8")
