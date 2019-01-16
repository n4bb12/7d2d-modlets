import { readJsonSync, writeFileSync } from "fs-extra"

const json = readJsonSync("json/sounds.json")
const factor = 1 / 3

const result = json.Sounds.SoundDataNode
  .map((sound, index) => {
    if (sound._name.endsWith("_s_fire")) {
      const name = sound._name
      const normalNoise = json.Sounds.SoundDataNode[index - 1].Noise
      const id = normalNoise._ID
      const range = Math.round(+normalNoise._range * factor * 100) / 100
      const volume = Math.round(+normalNoise._volume * factor * 100) / 100
      const heatStrength = normalNoise._heat_map_strength
      const heatTime = normalNoise._heat_map_time

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
