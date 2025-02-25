export interface BattleNetGame {
  apiId: string;
  internalId: string;
  name: string;
  productId: string;
}

const BATTLE_NET_GAMES: BattleNetGame[] = [
  {
    apiId: "5730135",
    internalId: "wow",
    name: "World of Warcraft",
    productId: "WoW",
  },
  {
    apiId: "22323",
    internalId: "w3",
    name: "Warcraft III: Reforged",
    productId: "W3",
  },
  {
    apiId: "5272175",
    internalId: "prometheus",
    name: "Overwatch 2",
    productId: "Pro",
  },
  {
    apiId: "17459",
    internalId: "diablo3",
    name: "Diablo III",
    productId: "D3",
  },
  {
    apiId: "1465140039",
    internalId: "hs_beta",
    name: "Hearthstone",
    productId: "WTCG",
  },
  {
    apiId: "1214607983",
    internalId: "heroes",
    name: "Heroes of the Storm",
    productId: "Hero",
  },
  {
    apiId: "21298",
    internalId: "s2",
    name: "StarCraft II",
    productId: "S2",
  },
  {
    apiId: "21297",
    internalId: "s1",
    name: "StarCraft",
    productId: "S1",
  },
  {
    apiId: "1894607",
    internalId: "destiny2",
    name: "Destiny 2",
    productId: "DST2",
  },
  {
    apiId: "1831721",
    internalId: "viper",
    name: "Call of Duty: Black Ops 4",
    productId: "VIPR",
  },
  {
    apiId: "1938454",
    internalId: "odin",
    name: "Call of Duty: Modern Warfare",
    productId: "ODIN",
  },
  {
    apiId: "1968759",
    internalId: "lazarus",
    name: "Call of Duty: MW2 Campaign Remastered",
    productId: "LAZR",
  },
  {
    apiId: "2002054",
    internalId: "zeus",
    name: "Call of Duty: Black Ops Cold War",
    productId: "ZEUS",
  },
  {
    apiId: "2061250",
    internalId: "fore",
    name: "Call of Duty: Vanguard",
    productId: "FORE",
  },
  {
    apiId: "4613486",
    internalId: "diablo4",
    name: "Diablo IV",
    productId: "Fen",
  },
  {
    apiId: "2346783",
    internalId: "wlby",
    name: "Crash Team Rumble",
    productId: "WLBY",
  },
  {
    apiId: "4674137",
    internalId: "gryphon",
    name: "Warcraft Rumble",
    productId: "GRY",
  },
  {
    apiId: "5272175",
    internalId: "pro",
    name: "Overwatch 2",
    productId: "Pro",
  },
  {
    apiId: "2166862",
    internalId: "anbs",
    name: "Diablo Immortal",
    productId: "ANBS",
  },
  {
    apiId: "2345729",
    internalId: "spotv",
    name: "Call of Duty: Modern Warfare III",
    productId: "SPOTV",
  },
  {
    apiId: "1096108883",
    internalId: "auks",
    name: "Call of Duty: Modern Warfare II",
    productId: "AUKS",
  },
  {
    apiId: "1447645266",
    internalId: "viper",
    name: "Call of Duty: Black Ops 4",
    productId: "VIPR",
  },
  {
    apiId: "1329875278",
    internalId: "odin",
    name: "Call of Duty: Modern Warfare",
    productId: "ODIN",
  },
  {
    apiId: "1329875278",
    internalId: "lazarus",
    name: "Call of Duty: Modern Warfare 2 Campaign Remastered",
    productId: "LAZR",
  },
  {
    apiId: "1329875278",
    internalId: "zeus",
    name: "Call of Duty: Black Ops Cold War",
    productId: "ZEUS",
  },
  {
    apiId: "1464615513",
    internalId: "wlby",
    name: "Crash Bandicoot 4",
    productId: "WLBY",
  },
  {
    apiId: "5198665",
    internalId: "osi",
    name: "Diablo II: Resurrected",
    productId: "OSI",
  },
  {
    apiId: "1381257807",
    internalId: "rtro",
    name: "Blizzard Arcade Collection",
    productId: "RTRO",
  },
  {
    apiId: "1179603525",
    internalId: "fore",
    name: "Call of Duty: Vanguard",
    productId: "FORE",
  },
  {
    apiId: "1095647827",
    internalId: "anbs",
    name: "Diablo Immortal",
    productId: "ANBS",
  },
  {
    apiId: "1146246220",
    internalId: "D1",
    name: "Diablo",
    productId: "D1",
  },
  {
    apiId: "5714258",
    internalId: "w1r",
    name: "Warcraft: Remastered",
    productId: "W1R",
  },
  {
    apiId: "5714514",
    internalId: "w2r",
    name: "Warcraft II: Remastered",
    productId: "W2R",
  },
  {
    apiId: "5714514",
    internalId: "w2",
    name: "Warcraft II: Battle.net Edition",
    productId: "W2",
  },
  {
    apiId: "1463898673",
    internalId: "w1",
    name: "Warcraft: Orcs & Humans",
    productId: "W1",
  },
];

const getBattleNetGameBy = (key: keyof BattleNetGame, value: string): BattleNetGame | undefined =>
  BATTLE_NET_GAMES.find((game) => game[key].toLowerCase() === value.toLowerCase());

export const getBattleNetGameByProductId = (productId: string): BattleNetGame | undefined =>
  getBattleNetGameBy("productId", productId);

export const getBattleNetGameByApiId = (apiId: string): BattleNetGame | undefined => getBattleNetGameBy("apiId", apiId);
