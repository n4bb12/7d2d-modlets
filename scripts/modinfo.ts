import { readJsonSync } from "fs-extra"

const pkg = readJsonSync("package.json")

export function buildModInfo(name) {
  return `<?xml version="1.0" encoding="UTF-8" ?>
<xml>
  <ModInfo>
    <Name value="n4bb12_${name}"/>
    <Description value="See a full list of changes in the README"/>
    <Author value="n4bb12"/>
    <Version value="${pkg.version}"/>
  </ModInfo>
</xml>
`
}
