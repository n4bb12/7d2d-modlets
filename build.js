const { ensureDirSync, readFileSync, readdirSync, removeSync, writeFileSync, copySync } = require("fs-extra")
const notifier = require("node-notifier")
const glob = require("glob")

try {
  const version = require("./package.json").version
  const descriptions = [`
<h1 align="center">
  <img src="https://user-images.githubusercontent.com/6136865/29045114-9ae8e510-7bc2-11e7-8487-19552001aafd.png" height="48">
  7 Days to Die – Balance Modlets
</h1>

<p align="center">
  Re-balancing the game to make it more fun
</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/n4bb12/7d2d-balance/master/LICENSE">
    <img alt="License" src="https://flat.badgen.net/github/license/n4bb12/7d2d-balance?icon=github">
  </a>
  <a href="https://github.com/n4bb12/7d2d-balance/issues/new">
    <img alt="Issues" src="https://flat.badgen.net/badge/github/create issue/pink?icon=github">
  </a>
</p>

## Usage

Copy individual folders to your 7 Days to Die \`Mods\` folder.

## Modlets
`]

  removeSync("dist")
  readdirSync("src").map(name => {
    const srcDir = "src/" + name
    const distDir = "dist/n4bb12_" + name

    ensureDirSync(distDir)
    copySync(srcDir, distDir)

    const modInfo = `<?xml version="1.0" encoding="UTF-8" ?>
<xml>
  <ModInfo>
    <Name value="n4bb12_${name}"/>
    <Description value="See a full list of changes in the README"/>
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

  const unwantedFiles = glob.sync("dist/**/*.{js,json}")
  unwantedFiles.forEach(file => removeSync(file))

} catch (error) {
  notifier.notify({
    title: "7D2D Modlets",
    message: "Build failed! " + error.message,
  })
}
