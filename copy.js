const fs = require("fs-extra")
const notifier = require("node-notifier")

const paths = {
  game: "D:/Spiele/SteamLibrary/steamapps/common/7 Days To Die",
}

fs.copySync("dist", paths.game + "/Mods")

notifier.notify({
  title: "7D2D Balance Changes",
  message: "Copy complete!",
})
