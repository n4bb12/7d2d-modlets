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

import { distributedMods } from "./distributedMods"
import { enabledMods } from "./enabledMods"
import { buildModInfo } from "./modinfo"
import { buildCombinedReadme } from "./readme"

try {
  removeSync("build")
  removeSync("enabled")
  removeSync("dist")

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
      const buildDir = "build/n4bb12_" + name
      const enabledDir = "enabled/n4bb12_" + name
      const distDir = "dist/n4bb12_" + name

      ensureDirSync(buildDir)
      copySync(srcDir, buildDir)

      const description = readFileSync(srcDir + "/README.md", "utf8")
        .trim()
        .split("\n")
        .map((line) => line.replace(/- /g, "").trim())
        .join(" | ")
      const modInfo = buildModInfo(name, description)
      writeFileSync(buildDir + "/ModInfo.xml", modInfo, "utf8")

      const unwantedFiles = glob.sync(buildDir + "/**/*.{ts,js,json,xlsx}")
      unwantedFiles.forEach((file) => removeSync(file))

      if (enabledMods.includes(name)) {
        ensureDirSync(enabledDir)
        copySync(buildDir, enabledDir)
      }

      if (distributedMods.includes(name)) {
        ensureDirSync(distDir)
        copySync(buildDir, distDir)
      }
    })

  enabledMods.forEach((name) => {
    if (!mods.includes(name)) {
      console.log("WARN: No such mod: " + name)
    }
  })

  buildCombinedReadme("build")
  buildCombinedReadme("enabled")
  buildCombinedReadme("dist")
} catch (error) {
  notifier.notify({
    title: "7D2D Modlets",
    message: "Build failed! " + error.message,
  })
}
