import { readJsonSync, writeFileSync } from "fs-extra"

interface Material {
  id: string
  name: string
  xp: number
}

const json = readJsonSync("json/materials.json")
const factor = 0.75
const materials: Material[] = []

json.materials.material.forEach(m => {
  const exp = m.property.find(p => p._name === "Experience")
  if (exp) {
    materials.push({
      id: m._id,
      name: m._id.replace(/^M/, "").replace(/^resource/, ""),
      xp: exp._value,
    })
  }
})

const result = materials
  .sort((a, b) => a.xp - b.xp)
  .map(m => {
    const id = ("\"" + m.id + "\"").padEnd(30)
    const oldVal = ("\"" + m.xp + "\"").padEnd(10)
    const newVal = Math.round(m.xp * factor)
    return `  <set xpath='/materials/material[@id=${id}]/property[@name="Experience" and @value=${oldVal}]/@value'>${newVal}</set>`
  })
  .join("\n")

const xml = `<config>
${result}
</config>
`

writeFileSync(__dirname + "/Config/materials.xml", xml, "utf8")
