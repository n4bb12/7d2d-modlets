const { copySync, readdirSync, removeSync } = require("fs-extra")
const notifier = require("node-notifier")

const paths = {
  game: "D:/Spiele/SteamLibrary/steamapps/common/7 Days To Die",
}
paths.mods = paths.game + "/Mods"

readdirSync(paths.mods)
  .filter(name => name.startsWith("n4bb12_"))
  .map(name => paths.mods + "/" + name)
  .forEach(path => removeSync(path))

copySync("dist", paths.mods)

notifier.notify({
  title: "7D2D Balance Changes",
  message: "Copy complete!",
})
