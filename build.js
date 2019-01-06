const { ensureDirSync, readFileSync, readdirSync, writeFileSync, copySync } = require("fs-extra")

const version = require("./package.json").version
const descriptions = [`
<h1 align="center">
  <img src="https://user-images.githubusercontent.com/6136865/29045114-9ae8e510-7bc2-11e7-8487-19552001aafd.png" height="48">
  7 Days to Die – Balance Modlets
</h1>

<p align="center">
  Re-balancing the game to make it more fun
</p>

## Usage

Copy individual folders to your 7 Days to Die \`Mods\` folder.

## Modlets
`]

readdirSync("dist")
readdirSync("src").map(name => {
  const srcDir = "src/" + name
  const distDir = "dist/n4bb12_" + name

  ensureDirSync(distDir)
  copySync(srcDir, distDir)

  const modInfo = `<?xml version="1.0" encoding="UTF-8" ?>
<xml>
  <ModInfo>
    <Name value="n4bb12_${name}"/>
    <Description value="See a full list of balance changes in the README"/>
    <Author value="n4bb12"/>
    <Version value="${version}"/>
  </ModInfo>
</xml>
`
  writeFileSync(distDir + "/ModInfo.xml", modInfo, "utf8")

  const changes = readFileSync(srcDir + "/README.md", "utf8")
  descriptions.push("#### " + name)
  descriptions.push("")
  descriptions.push(changes)
  descriptions.push("")
})

const readme = descriptions.join("\n")
writeFileSync("dist/README.md", readme, "utf8")
