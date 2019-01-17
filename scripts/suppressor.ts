import { readJsonSync, writeFileSync } from "fs-extra"

const nodes = readJsonSync("json/sounds.json").Sounds.SoundDataNode

function values(sound, normal?) {
  return [
    sound._name,
    sound.Noise._range,
    sound.Noise._volume,
    normal ? ((100 - 100 * +sound.Noise._range / +normal.Noise._range).toFixed(2) + "%") : "",
    normal ? ((100 - 100 * +sound.Noise._volume / +normal.Noise._volume).toFixed(2) + "%") : "",
  ]
}

const rows: any[] = []

rows.push([
  "SOUND NAME",
  "SOUND RANGE",
  "SOUND VOLUME",
  "RANGE REDUCTION",
  "VOLUME REDUCTION",
])

nodes
  .map(suppressed => {
    if (suppressed._name.endsWith("_s_fire")) {
      const normal = nodes.find(node => {
        return node._name.toLowerCase() === suppressed._name.toLowerCase().replace(/_s_/, "_")
      })
      return { normal, suppressed }
    }
  })
  .filter(Boolean)
  .sort((a, b) => {
    return +b.normal.Noise._volume - +a.normal.Noise._volume
  })
  .forEach(({ normal, suppressed }) => {
    rows.push(values(normal))
    rows.push(values(suppressed, normal))
  })

const table = rows.map(row => {
  return ""
    + row[0].padEnd(40)
    + row[1].padEnd(20)
    + row[2].padEnd(20)
    + row[3].padEnd(20)
    + row[4].padEnd(20)
      .trim()
}).join("\n")

writeFileSync("stats/suppressor.txt", table + "\n", "utf8")
