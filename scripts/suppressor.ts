import { readJsonSync, writeFileSync } from "fs-extra"

const nodes = readJsonSync("json/sounds.json").Sounds.SoundDataNode

function format(node, comparison?) {
  return [
    node._name.padEnd(40),
    node.Noise._range.padEnd(20),
    node.Noise._volume.padEnd(20),
    comparison && (Math.round(100 - 100 * +node.Noise._range / +comparison.Noise._range) + "%").padEnd(20),
    comparison && (Math.round(100 - 100 * +node.Noise._volume / +comparison.Noise._volume) + "%"),
  ].filter(Boolean).join("")
}

const results = nodes
  .map(suppressed => {
    if (suppressed._name.endsWith("_s_fire")) {
      const normal = nodes.find(node => node._name.toLowerCase() === suppressed._name.toLowerCase().replace(/_s_/, "_"))
      return [
        format(normal),
        format(suppressed, normal),
      ].join("\n")
    }
  })
  .filter(Boolean)
  .join("\n") + "\n"

const legend = [
  "NAME".padEnd(40),
  "RANGE".padEnd(20),
  "VOLUME".padEnd(20),
  "RANGE REDUCTION".padEnd(20),
  "VOLUME REDUCTION",
].join("") + "\n"

writeFileSync("stats/suppressor.md", legend + results, "utf8")
