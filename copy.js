const { copySync } = require("fs-extra")
const notifier = require("node-notifier")

try {
  const paths = {
    game: "D:/Spiele/SteamLibrary/steamapps/common/7 Days To Die",
  }
  paths.mods = paths.game + "/Mods"

  copySync("dist", paths.mods)

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
