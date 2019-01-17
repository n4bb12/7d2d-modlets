import { readJsonSync, writeFileSync } from "fs-extra"

const nodes = readJsonSync("json/sounds.json").Sounds.SoundDataNode
const factor = 1 / 3

const result = nodes
  .map(suppressed => {
    if (suppressed._name.endsWith("_s_fire")) {
      const name = suppressed._name
      const normal = nodes.find(node => node._name.toLowerCase() === suppressed._name.toLowerCase().replace(/_s_/, "_"))
      const id = normal.Noise._ID
      const range = Math.round(+normal.Noise._range * factor)
      const volume = Math.round(+normal.Noise._volume * factor)
      const heatStrength = normal.Noise._heat_map_strength || 0.05
      const heatTime = normal.Noise._heat_map_time || 60

      return `  <remove xpath='/Sounds/SoundDataNode[@name="${name}"]/Noise'/>
  <append xpath='/Sounds/SoundDataNode[@name="${name}"]'>
    <Noise ID="${id}" range="${range}" volume="${volume}" time="2" heat_map_strength="${heatStrength}" heat_map_time="${heatTime}"/>
  </append>`
    }
  })
  .filter(Boolean)
  .join("\n")

const xml = `<config>
${result}
</config>
`

writeFileSync(__dirname + "/Config/sounds.xml", xml, "utf8")
