import { writeFileSync } from "fs-extra"

const dyes = [
  { name: "black",  color: " 64,  64,  64" },
  { name: "blue",   color: " 64, 128, 255" },
  { name: "brown",  color: "128,  96,  64" },
  { name: "green",  color: " 64, 128,  64" },
  { name: "pink",   color: "255, 192, 192" },
  { name: "red",    color: "192,  64,  64" },
  { name: "orange", color: "255, 128,  64", new: true },
  { name: "purple", color: " 96,  64, 128", new: true },
  { name: "white",  color: "255, 255, 255", new: true },
  { name: "yellow", color: "255, 255,  64", new: true },
]

dyes.forEach(dye => dye.color = dye.color.replace(/ +/g, ""))

function upperFirst(str) {
  return str[0].toUpperCase() + str.substr(1)
}

const deletions = dyes
  .filter(dye => !dye.new)
  .map(c => `  <remove xpath='/item_modifiers/item_modifier[@name="modDye${upperFirst(c.name)}"]'/>`)
  .join("\n")

const insertions = dyes
  .map(dye => `
    <!-- ${dye.name} -->
    <item_modifier name="modDye${upperFirst(dye.name)}" installable_tags="clothing,armor,weapon,tool,vehicle" modifier_tags="dye" type="attachment" rarity="0.2">
      <property name="DescriptionKey" value="modDyeGroupDesc"/>
      <property name="Stacknumber" value="1"/>

      <item_property_overrides name="*">
        <property name="TintColor" value="${dye.color}"/>
        <property name="CustomIconTint" value="${dye.color}"/>
        <property name="UMA.Overlay0Tint" value="${dye.color}"/>
      </item_property_overrides>

      <item_property_overrides name="tankTop">
        <property name="CustomIconTint" value="${dye.color}"/>
        <property name="UMA.Overlay0Tint" value="skin"/>
        <property name="UMA.Overlay1Tint" value="${dye.color}"/>
      </item_property_overrides>

      <item_property_overrides name="tshirt">
        <property name="UMA.Overlay0Tint" value="skin"/>
        <property name="UMA.Overlay1Tint" value="${dye.color}"/>
      </item_property_overrides>

      <item_property_overrides name="denimShortsPants">
        <property name="UMA.Overlay0Tint" value="skin"/>
        <property name="UMA.Overlay1Tint" value="${dye.color}"/>
      </item_property_overrides>

      <property name="PickupJournalEntry" value="augmentGunsTip"/>
    </item_modifier>`)
  .join("\n")

const xml = `<config>
${deletions}
  <append xpath='/item_modifiers'>
${insertions}
  </append>
</config>
`

writeFileSync(__dirname + "/Config/item_modifiers.xml", xml, "utf8")
