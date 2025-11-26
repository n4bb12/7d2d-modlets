import { readJsonSync } from "fs-extra"

const pkg = readJsonSync("package.json")

export function buildModInfo(name, description) {
  return `
<?xml version="1.0" encoding="UTF-8" ?>
<xml>
  <Name value="n4bb12_${name}"/>
  <DisplayName value="${name}" />
  <Version value="${pkg.version}"/>
  <Description value="${description}"/>
  <Author value=${pkg.author}/>
  <Website value="${pkg.homepage}" />
</xml>
`.trim()
}
