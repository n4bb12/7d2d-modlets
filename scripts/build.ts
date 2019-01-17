import {
  copySync,
  ensureDirSync,
  readdirSync,
  readFileSync,
  readJsonSync,
  removeSync,
  statSync,
  writeFileSync,
} from "fs-extra"
import glob from "glob"
import notifier from "node-notifier"

const pkg = readJsonSync("package.json")

const readmeHeader = `
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
`

function renderModInfo(name) {
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

try {
  const descriptions = [readmeHeader]

  removeSync("dist")

  readdirSync("src")
    .filter(name => {
      const dir = "src/" + name
      const isDirectory = statSync(dir).isDirectory()
      if (!isDirectory) {
        return false
      }
      const numFiles = readdirSync(dir).length
      if (!numFiles) {
        removeSync(dir)
        return false
      }
      return true
    })
    .map(name => {
      const srcDir = "src/" + name
      const distDir = "dist/n4bb12_" + name

      ensureDirSync(distDir)
      copySync(srcDir, distDir)

      const modInfo = renderModInfo(name)
      writeFileSync(distDir + "/ModInfo.xml", modInfo, "utf8")

      const changes = readFileSync(srcDir + "/README.md", "utf8")
      descriptions.push("#### " + name)
      descriptions.push("")
      descriptions.push(changes)
      descriptions.push("")
    })

  const readme = descriptions.join("\n")
  writeFileSync("dist/README.md", readme, "utf8")

  const unwantedFiles = glob.sync("dist/**/*.{ts,js,json}")
  unwantedFiles.forEach(file => removeSync(file))

} catch (error) {
  notifier.notify({
    title: "7D2D Modlets",
    message: "Build failed! " + error.message,
  })
}
