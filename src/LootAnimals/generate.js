const json = require(process.cwd() + "/config/entityclasses")
const animals = {}

json.entity_classes.entity_class
  .filter(ec => ec._name.startsWith("animal"))
  .forEach(animal => {
    const xpNode = animal.property.find(p => p._name === "ExperienceGain")

    const xp = xpNode
      ? +xpNode._value
      : animals[animal._extends].xp

    const resources = (animal.drop || [])
      .filter(drop => drop._event === "Harvest" && drop._tag === "butcherHarvest")
      .map(drop => {
        const name = drop._name
        switch (name) {
          case "foodRawMeat":
            return { name, count: Math.round(xp / 50) }
          case "resourceAnimalFat":
            return { name, count: Math.round(xp / 150) }
          case "resourceLeather":
            return { name, count: Math.round(xp / 150) }
          case "resourceFemur":
            return { name, count: Math.round(xp / 200) }
          case "resourceFeather":
            return { name, count: Math.round(xp / 50) }
          case "resourceTestosteroneExtract":
            return { name, count: Math.round(xp / 500) }
          case "foodRottingFlesh":
            return { name, count: Math.round(xp / 50) }
          default:
            throw new Error(name)
        }
      })
      .sort((a, b) => b.count - a.count)

    const name = animal._name
    animals[name] = {
      name: name,
      xp,
      resources,
      isTemplate: name.includes("Template"),
    }
  })

const result = Object.values(animals)
  .filter(animal => animal.resources.length)
  .filter(animal => !animal.isTemplate)
  .map(animal => `<!-- ${animal.name} -->` + animal.resources.map(resource => `
    <set xpath='/entity_classes/entity_class[@name="${animal.name}"]/drop[@event="Harvest" and @tag="butcherHarvest" and @name="${resource.name}"]/@count'>${resource.count},${resource.count * 2}</set>`)
    .join("")
  )
  .join("\n")
  .trim()

console.log(`<config>${result}</config>`)
