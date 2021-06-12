import {
  copySync,
  ensureDirSync,
  readdirSync,
  readFileSync,
  removeSync,
  statSync,
  writeFileSync,
} from "fs-extra"
import glob from "glob"
import notifier from "node-notifier"

import { disabledMods } from "./disabled"
import { buildModInfo } from "./modinfo"
import { buildCombinedReadme } from "./readme"

try {
  removeSync("dist")
  removeSync("enabled")

  const mods = readdirSync("src")

  mods
    .filter((name) => {
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
    .forEach((name) => {
      const srcDir = "src/" + name
      const distDir = "dist/n4bb12_" + name
      const enabledDir = "enabled/n4bb12_" + name

      ensureDirSync(distDir)
      copySync(srcDir, distDir)

      const description = readFileSync(srcDir + "/README.md", "utf8")
        .trim()
        .split("\n")
        .map((line) => line.replace(/- /g, "").trim())
        .join(" | ")
      const modInfo = buildModInfo(name, description)
      writeFileSync(distDir + "/ModInfo.xml", modInfo, "utf8")

      const unwantedFiles = glob.sync(distDir + "/**/*.{ts,js,json}")
      unwantedFiles.forEach((file) => removeSync(file))

      if (!disabledMods.includes(name)) {
        ensureDirSync(enabledDir)
        copySync(distDir, enabledDir)
      }
    })

  disabledMods.forEach((name) => {
    if (!mods.includes(name)) {
      console.log("WARN: No such mod: " + name)
    }
  })

  buildCombinedReadme("dist")
  buildCombinedReadme("enabled")
} catch (error) {
  notifier.notify({
    title: "7D2D Modlets",
    message: "Build failed! " + error.message,
  })
}
