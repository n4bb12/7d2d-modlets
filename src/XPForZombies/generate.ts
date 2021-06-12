import { readJsonSync, writeFileSync } from "fs-extra"

interface Zed {
  name: string
  parentName: string
  xpBefore: number
  xpAfter: number
}

const json = readJsonSync("json/entityclasses.json")
const zeds: { [name: string]: Zed } = {}

function getXP(zed) {
  const xpNode = zed.property.find((p) => p._name === "ExperienceGain")
  if (xpNode) {
    return +xpNode._value
  }
  if (zeds[zed._extends]) {
    return zeds[zed._extends].xpBefore
  }
}

json.entity_classes.entity_class
  .filter((ec) => ec._name.startsWith("zombie"))
  .forEach((zed) => {
    const name = zed._name
    const parentName = zed._extends
    const xpBefore = getXP(zed)

    if (xpBefore) {
      let xpAfter = xpBefore

      if (name.endsWith("Feral") && zeds[parentName]) {
        xpAfter = zeds[parentName].xpBefore * 2
      }
      if (
        name.endsWith("Radiated") &&
        zeds[parentName] &&
        zeds[zeds[parentName].parentName]
      ) {
        xpAfter = zeds[zeds[parentName].parentName].xpBefore * 5
      }

      zeds[name] = {
        name,
        parentName,
        xpBefore,
        xpAfter,
      }
    }
  })

const result = Object.values(zeds)
  .filter((zed) => zed.xpAfter !== zed.xpBefore)
  .sort((a, b) => {
    if (a.xpAfter !== b.xpAfter) {
      return a.xpAfter - b.xpAfter
    }
    return a.name.localeCompare(b.name)
  })
  .map((zed) => {
    const name = ('"' + zed.name + '"').padEnd(30)
    const xpBefore = ('"' + zed.xpBefore + '"').padEnd(10)
    return `  <set xpath='/entity_classes/entity_class[@name=${name}]/property[@name="ExperienceGain" and @value=${xpBefore}]/@value'>${zed.xpAfter}</set>`
  })
  .join("\n")

const xml = `<config>
${result}
</config>
`

writeFileSync(__dirname + "/Config/entityclasses.xml", xml, "utf8")
