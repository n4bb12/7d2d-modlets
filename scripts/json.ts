import parser from "fast-xml-parser"
import {
  ensureDirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs-extra"

const paths = {
  config: "D:/Spiele/SteamLibrary/steamapps/common/7 Days To Die/Data/Config",
}

ensureDirSync("config")
readdirSync(paths.config)
  .filter((name) => name.endsWith(".xml"))
  .forEach((name) => {
    const xmlFile = paths.config + "/" + name
    const xml = readFileSync(xmlFile, "utf8")
    const json = parser.parse(xml, {
      attributeNamePrefix: "_",
      textNodeName: "__text",
      ignoreAttributes: false,
    })
    const jsonFile = `config/${name.replace(/\.xml$/, ".json")}`
    const jsonStr = JSON.stringify(json, null, 2)
    writeFileSync(jsonFile, jsonStr, "utf8")
  })
