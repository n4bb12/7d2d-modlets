const json = require(process.cwd() + "/config/materials")
const factor = 2
const materials = []

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
  .sort((a, b) => +a - +b)
  .map(m => `<!-- ${m.name} --><set xpath='/materials/material[@id="${m.id}"]/property[@name="Experience" and @value="${m.xp}"]/@value'>${Math.round(m.xp * factor)}</set>`)
  .join("\n")

console.log(`<config>${result}</config>`)
