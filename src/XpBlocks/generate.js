// http://convertjson.com/xml-to-json.htm

const factor = 2
const materials = {}

json.materials.material.forEach(m => {
  const exp = m.property.find(p => p._name === "Experience")
  if (exp) {
    const value = exp._value
    materials[value] = 1
  }
})
const result = Object.keys(materials)
  .sort((a, b) => +a - +b)
  .map(value => `<set xpath="/materials/material/property[@name='Experience' and @value='${value}']/@value">${(value * factor).toFixed(2)}</set>`)
  .join("\n")

console.log(result)
