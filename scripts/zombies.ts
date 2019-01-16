import { readJsonSync, writeFileSync } from "fs-extra"

const zombies = readJsonSync("json/entityclasses.json")
  .entity_classes
  .entity_class
  .map(ec => ec._name)
  .filter(name => name.startsWith("zombie"))
  .filter(name => !name.includes("Template"))
  .map(name => name.substr("zombie".length))
  .sort()

writeFileSync("stats/zombies.md", zombies.join("\n") + "\n", "utf8")
