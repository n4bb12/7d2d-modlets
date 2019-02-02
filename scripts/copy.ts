import { copySync, ensureDirSync, readdirSync, removeSync } from "fs-extra"
import notifier from "node-notifier"

const paths = {
  mods: "D:/Spiele/SteamLibrary/steamapps/common/7 Days To Die/Mods",
}

try {
  ensureDirSync(paths.mods)

  readdirSync(paths.mods)
    .filter(name => name.startsWith("n4bb12_"))
    .map(name => paths.mods + "/" + name)
    .forEach(path => removeSync(path))

  copySync("enabled", paths.mods)

  notifier.notify({
    title: "7D2D Mods",
    message: "Copy complete!",
  })

} catch (error) {
  notifier.notify({
    title: "7D2D Mods",
    message: "Copy failed! " + error.message,
  })
}
