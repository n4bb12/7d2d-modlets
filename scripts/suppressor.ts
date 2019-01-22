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

const table = `
| Sound | Range | Volume | Range Reduction | Volume Reduction |
| ----- | ----- | ------ | --------------- | ---------------- |
${rows.map(row => {
  return "| "
    + row[0].padEnd(25) + "| "
    + row[1].padEnd(10) + "| "
    + row[2].padEnd(10) + "| "
    + row[3].padEnd(10) + "| "
    + row[4].padEnd(10) + "| "
      .trim()
}).join("\n")}
`

writeFileSync("stats/suppressor.md", table, "utf8")
