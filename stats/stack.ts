import { readJsonSync } from "fs-extra"

import { array } from "./../scripts/util"

export const GEAR               = 1     // stuff that is worn
export const SLOTFILLER         = 1     // stuff that goes into machines
export const CONSUMABLE         = 25    // consumed when eaten, above +1
export const PLACEABLE          = 100   // consumed when placed
export const AMMO               = 250   // consumed by machines and repairing
export const AMMO_COMPACT       = 25    // consumed by machines and repairing
export const MATERIAL_PRODUCT   = 25    // dense materials that cannot be scrapped
export const MATERIAL_DENSE     = 50    // can be scrapped for huge amounts
export const MATERIAL_COMPACT   = 100   // can be scrapped for large amounts
export const MATERIAL           = 250   // regular crafting materials
export const MATERIAL_ELEMENTAL = 1000  // natural materials that cannot be scrapped
export const MATERIAL_MELTED    = 50000 // materials that were melted in the forge
export const CURRENCY           = 50000 // used for trading

export type ItemType =
 | typeof GEAR
 | typeof SLOTFILLER
 | typeof CONSUMABLE
 | typeof PLACEABLE
 | typeof CURRENCY
 | typeof AMMO
 | typeof AMMO_COMPACT
 | typeof MATERIAL_PRODUCT
 | typeof MATERIAL_DENSE
 | typeof MATERIAL_COMPACT
 | typeof MATERIAL
 | typeof MATERIAL_ELEMENTAL
 | typeof MATERIAL_MELTED

export const stack: {
  [name: string]: number,
} = {
  ammo9mmBullet:                  AMMO,               // 500
  ammoArrowStone:                 AMMO,               // 250
  ammoBlunderbuss:                AMMO,               // 250
  ammoCrossbowBoltIron:           AMMO,               // 250
  ammoCrossbowBoltStone:          AMMO,               // 250
  ammoDartSteel:                  AMMO,               // 500
  ammoGasCan:                     AMMO,               // 1000
  ammoRocketHE:                   AMMO_COMPACT,       // 20
  ammoShotgunShell:               AMMO,               // 250
  ammoShotgunSlug:                AMMO,               // 128
  backpackMedium:                 GEAR,               // 1
  ballCap:                        GEAR,               // 1
  bandana:                        GEAR,               // 1
  bucketEmpty:                    GEAR,               // 1
  bucketRiverWater:               GEAR,               // 1
  candle:                         PLACEABLE,          // 50
  carBattery:                     SLOTFILLER,         // 1
  casinoCoin:                     CURRENCY,           // 20000
  cigar:                          GEAR,               // 1
  cowboyBoots:                    GEAR,               // 1
  cowboyHat:                      GEAR,               // 1
  denimPants:                     GEAR,               // 1
  dressShoes:                     GEAR,               // 1
  drinkCanBoiledWater:            CONSUMABLE,         // 1
  drinkCanEmpty:                  CONSUMABLE,         // 500
  drinkCanRiverWater:             CONSUMABLE,         // 15
  drinkJarBeer:                   CONSUMABLE,         // 15
  drinkJarBoiledWater:            CONSUMABLE,         // 15
  drinkJarCoffee:                 CONSUMABLE,         // 15
  drinkJarEmpty:                  CONSUMABLE,         // 500
  drinkJarGoldenRodTea:           CONSUMABLE,         // 15
  drinkJarGrainAlcohol:           CONSUMABLE,         // 15
  drinkJarGrandpasAwesomeSauce:   CONSUMABLE,         // 15
  drinkJarGrandpasLearningElixir: CONSUMABLE,         // 500
  drinkJarGrandpasMoonshine:      CONSUMABLE,         // 15
  drinkJarRedTea:                 CONSUMABLE,         // 15
  drinkJarRiverWater:             CONSUMABLE,         // 500
  drinkJarYuccaJuice:             CONSUMABLE,         // 15
  drinkYuccaJuiceSmoothie:        CONSUMABLE,         // 15
  drugAntibiotics:                CONSUMABLE,         // 50
  drugFortBites:                  CONSUMABLE,         // 50
  drugHerbalAntibiotics:          CONSUMABLE,         // 50
  drugPainkillers:                CONSUMABLE,         // 50
  drugRecog:                      CONSUMABLE,         // 50
  drugVitamins:                   CONSUMABLE,         // 50
  facialPiercings:                GEAR,               // 1
  foodBaconAndEggs:               CONSUMABLE,         // 50
  foodBakedPotato:                CONSUMABLE,         // 50
  foodBlueberryPie:               CONSUMABLE,         // 50
  foodBoiledMeat:                 CONSUMABLE,         // 50
  foodCanBeef:                    CONSUMABLE,         // 50
  foodCharredMeat:                CONSUMABLE,         // 50
  foodCornBread:                  CONSUMABLE,         // 50
  foodCornMeal:                   MATERIAL,           // 500
  foodCornOnTheCob:               CONSUMABLE,         // 50
  foodCropBlueberries:            MATERIAL,           // 500
  foodCropCorn:                   MATERIAL,           // 500
  foodCropGraceCorn:              MATERIAL,           // 500
  foodCropMushrooms:              MATERIAL,           // 500
  foodCropPotato:                 MATERIAL,           // 500
  foodCropYuccaFruit:             MATERIAL,           // 50
  foodEgg:                        CONSUMABLE,         // 500
  foodEggBoiled:                  CONSUMABLE,         // 50
  foodFishTacos:                  CONSUMABLE,         // 500
  foodGrilledMeat:                CONSUMABLE,         // 50
  foodHoboStew:                   CONSUMABLE,         // 50
  foodHoney:                      CONSUMABLE,         // 10
  foodMeatStew:                   CONSUMABLE,         // 50
  foodMoldyBread:                 CONSUMABLE,         // 50
  foodRawMeat:                    MATERIAL,           // 250
  foodRottingFlesh:               MATERIAL,           // 100
  foodShamSandwich:               CONSUMABLE,         // 50
  foodSteakAndPotato:             CONSUMABLE,         // 500
  foodVegetableStew:              CONSUMABLE,         // 50
  foolsCapAdmin:                  GEAR,               // 1
  gasMask:                        GEAR,               // 1
  gothicPants:                    GEAR,               // 1
  gunPistolAdmin:                 GEAR,               // 1
  gunToolDiggerAdmin:             GEAR,               // 1
  hazmatClothingMaster:           GEAR,               // 1
  hoodedSweatshirt:               GEAR,               // 1
  hpRunningShoes:                 GEAR,               // 1
  jacketWhite:                    GEAR,               // 1
  jetPackAdmin:                   GEAR,               // 1
  leatherDuster:                  GEAR,               // 1
  leatherPoncho:                  GEAR,               // 1
  medicalAloeCream:               MATERIAL_COMPACT,   // 20
  medicalBandage:                 CONSUMABLE,         // 10
  medicalBloodBag:                MATERIAL_COMPACT,   // 250
  medicalBloodDrawKit:            GEAR,               // 1
  medicalFirstAidBandage:         CONSUMABLE,         // 10
  medicalFirstAidKit:             CONSUMABLE,         // 5
  medicalSnowberryExtract:        MATERIAL_COMPACT,   // 15
  medicalSplint:                  CONSUMABLE,         // 10
  meleeHandMaster:                GEAR,               // 1
  meleeToolPaintTool:             GEAR,               // 1
  meleeToolPaintToolAdmin:        GEAR,               // 1
  meleeToolTorch:                 PLACEABLE,          // 50
  meleeToolWireTool:              GEAR,               // 1
  nightvisionGoggles:             GEAR,               // 1
  oldCash:                        CURRENCY,           // 500
  partsMaster:                    MATERIAL_DENSE,     // 1
  pimpCoatAdmin:                  GEAR,               // 1
  plantFiberClothingMaster:       GEAR,               // 1
  pufferCoat:                     GEAR,               // 1
  questItem:                      SLOTFILLER,         // 1
  questMaster:                    CONSUMABLE,         // 50
  resourceAcid:                   MATERIAL,           // 100
  resourceAirFilter:              MATERIAL_COMPACT,   // 250
  resourceAnimalFat:              MATERIAL,           // 500
  resourceArrowHeadIron:          MATERIAL,           // 500
  resourceArrowHeadSteelAP:       MATERIAL,           // 500
  resourceBrokenGlass:            MATERIAL_COMPACT,   // 6000
  resourceBuckshot:               MATERIAL,           // 250
  resourceBulletCasing:           MATERIAL,           // 500
  resourceBulletCasingSteel:      MATERIAL,           // 500
  resourceBulletTip:              MATERIAL,           // 500
  resourceCandleStick:            MATERIAL_DENSE,     // 250
  resourceCandyTin:               MATERIAL,           // 250
  resourceCement:                 MATERIAL,           // 1000
  resourceClayLump:               MATERIAL_ELEMENTAL, // 6000
  resourceCloth:                  MATERIAL,           // 250
  resourceCoal:                   MATERIAL_ELEMENTAL, // 6000
  resourceCobblestones:           MATERIAL,           // 1000
  resourceConcreteMix:            MATERIAL_COMPACT,   // 1000
  resourceCropAloeLeaf:           MATERIAL,           // 500
  resourceCropChrysanthemumPlant: MATERIAL,           // 500
  resourceCropCoffeeBeans:        MATERIAL,           // 500
  resourceCropCottonPlant:        MATERIAL,           // 500
  resourceCropGoldenrodPlant:     MATERIAL,           // 500
  resourceCropHopsFlower:         MATERIAL,           // 500
  resourceCrushedSand:            MATERIAL_ELEMENTAL, // 6000
  resourceDoorKnob:               MATERIAL_COMPACT,   // 250
  resourceDuctTape:               MATERIAL_COMPACT,   // 500
  resourceElectricParts:          MATERIAL,           // 1000
  resourceElectronicParts:        MATERIAL,           // 1000
  resourceFeather:                MATERIAL,           // 250
  resourceFemur:                  MATERIAL,           // 250
  resourceFishingWeight:          MATERIAL,           // 500
  resourceForgedIron:             MATERIAL_COMPACT,   // 500
  resourceForgedSteel:            MATERIAL_COMPACT,   // 500
  resourceGlue:                   MATERIAL,           // 500
  resourceGunPowder:              MATERIAL,           // 1000
  resourceHeadlight:              MATERIAL_COMPACT,   // 50
  resourceHubcap:                 MATERIAL_COMPACT,   // 250
  resourceInsulator:              MATERIAL,           // 500
  resourceIronFragment:           MATERIAL,           // 1200
  resourceLeather:                MATERIAL,           // 250
  resourceMechanicalParts:        MATERIAL,           // 1000
  resourceMetalPipe:              MATERIAL_COMPACT,   // 500
  resourceMilitaryFiber:          MATERIAL_PRODUCT,   // 250
  resourceNail:                   MATERIAL,           // 1000
  resourceOil:                    MATERIAL_COMPACT,   // 50
  resourceOilShale:               MATERIAL_ELEMENTAL, // 6000
  resourcePaint:                  MATERIAL,           // 1000
  resourcePaper:                  MATERIAL,           // 250
  resourcePotassiumNitratePowder: MATERIAL_ELEMENTAL, // 6000
  resourceRadiator:               MATERIAL_PRODUCT,   // 5
  resourceRepairKit:              MATERIAL_PRODUCT,   // 50
  resourceRocketCasing:           MATERIAL_COMPACT,   // 50
  resourceRocketTip:              MATERIAL,           // 500
  resourceRockSmall:              MATERIAL_ELEMENTAL, // 6000
  resourceScrapBrass:             MATERIAL_ELEMENTAL, // 6000
  resourceScrapIron:              MATERIAL_ELEMENTAL, // 6000
  resourceScrapLead:              MATERIAL_ELEMENTAL, // 6000
  resourceScrapPolymers:          MATERIAL,           // 1000
  resourceSilverNugget:           MATERIAL_DENSE,     // 250
  resourceSnowBall:               MATERIAL_ELEMENTAL, // 6000
  resourceSpring:                 MATERIAL,           // 500
  resourceSteelPolish:            MATERIAL_DENSE,     // 250
  resourceTallow:                 MATERIAL,           // 500
  resourceTestosteroneExtract:    MATERIAL,           // 10
  resourceTrophy1:                MATERIAL_COMPACT,   // 250
  resourceTrophy2:                MATERIAL_COMPACT,   // 250
  resourceTrophy3:                MATERIAL,           // 250
  resourceWood:                   MATERIAL_ELEMENTAL, // 6000
  resourceYuccaFibers:            MATERIAL_ELEMENTAL, // 6000
  ringOfFireAdmin:                GEAR,               // 1
  rocketBootsAdmin:               GEAR,               // 1
  runningShoes:                   GEAR,               // 1
  schematicMaster:                CONSUMABLE,         // 1
  shades:                         GEAR,               // 1
  shirt:                          GEAR,               // 1
  skullCap:                       GEAR,               // 1
  smallEngine:                    SLOTFILLER,         // 1
  solarCell:                      SLOTFILLER,         // 1
  suitPants:                      GEAR,               // 1
  sweatshirt:                     GEAR,               // 1
  tankTop:                        GEAR,               // 1
  thrownAmmoFlare:                AMMO_COMPACT,       // 40
  thrownAmmoMolotovCocktail:      AMMO_COMPACT,       // 40
  thrownAmmoPipeBomb:             AMMO_COMPACT,       // 40
  thrownDynamite:                 AMMO_COMPACT,       // 40
  toolAndDieSet:                  SLOTFILLER,         // 1
  toolAnvil:                      SLOTFILLER,         // 1
  toolBeaker:                     SLOTFILLER,         // 10
  toolBellows:                    MATERIAL_COMPACT,   // 1
  toolCookingGrill:               SLOTFILLER,         // 250
  toolForgeCrucible:              SLOTFILLER,         // 1
  tshirt:                         GEAR,               // 1
  unit_iron:                      MATERIAL_MELTED,    // 30000
  wornBoots:                      GEAR,               // 1
}

const json = readJsonSync("json/items.json")

export function getStackSize(name: string) {
  if (stack[name]) {
    return stack[name]
  }
  const item = json.items.item.find(entry => entry._name === name)
  if (item) {
    const propExtends = array(item.property).find(p => p._name === "Extends")
    if (propExtends) {
      const parent = json.items.item.find(entry => entry._name === propExtends._value)
      return getStackSize(parent._name)
    }
  }
}
