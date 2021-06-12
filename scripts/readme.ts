import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs-extra"

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

export function buildCombinedReadme(rootDir: string) {
  const descriptions = [readmeHeader]

  readdirSync(rootDir).forEach((dir) => {
    const srcDir = rootDir + "/" + dir
    const srcReadme = srcDir + "/README.md"

    if (existsSync(srcReadme)) {
      const name = dir.replace(/^n4bb12_/, "")
      const changes = readFileSync(srcDir + "/README.md", "utf8").trim()

      descriptions.push("#### " + name)
      descriptions.push("")
      descriptions.push(changes)
      descriptions.push("")
    }
  })

  const combinedReadme = descriptions.join("\n")
  writeFileSync(rootDir + "/README.md", combinedReadme, "utf8")
}
