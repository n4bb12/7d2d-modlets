const { readdirSync, removeSync } = require("fs-extra")
const notifier = require("node-notifier")

try {
  const paths = {
    game: "D:/Spiele/SteamLibrary/steamapps/common/7 Days To Die",
  }
  paths.mods = paths.game + "/Mods"

  readdirSync(paths.mods)
    .filter(name => name.startsWith("n4bb12_"))
    .map(name => paths.mods + "/" + name)
    .forEach(path => removeSync(path))

} catch (error) {
  notifier.notify({
    title: "7D2D Mods",
    message: "Clean failed! " + error.message,
  })
}
