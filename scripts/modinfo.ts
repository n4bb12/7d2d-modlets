import { readJsonSync } from "fs-extra"

const pkg = readJsonSync("package.json")

export function buildModInfo(name, description) {
  return `<?xml version="1.0" encoding="UTF-8" ?>
<xml>
  <ModInfo>
    <Name value="n4bb12_${name}"/>
    <Description value="${description}"/>
    <Author value="n4bb12"/>
    <Version value="${pkg.version}"/>
  </ModInfo>
</xml>
`
}
