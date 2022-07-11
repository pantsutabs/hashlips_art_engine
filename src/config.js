const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "Your Collection";
const description = "Remember to replace this description";
const baseUri = "ipfs://NewUriToReplace";

const solanaMetadata = {
  symbol: "YC",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://www.youtube.com/c/hashlipsnft",
  creators: [
    {
      address: "7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC",
      share: 100,
    },
  ],
};

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 32,
    layersOrder: [
      //{ name: "Background" },
      { name: "Hair_back", options: { bypassDNA: true, ignore: true } },
      { name: "Hand_accessory", options: { displayName: "Hand accessory", fitWith:"Hand_accessory_top", } },
      { name: "Top_back", options: { bypassDNA: true, ignore: true } },
      { name: "Body", options: { unlisted: true } },
      { name: "Body_overlay", options: { displayName: "Body overlay" } },
      { name: "Legs" },
      { name: "Thighs" },
      { name: "Bottom" },
      { name: "Neck_accessory", options: { displayName: "Neck accessory", fitWith:"Neck_accessory_top", } },
      { name: "Top", options: { fitWith:"Top_back", } },
      { name: "Neck_accessory_top", options: { bypassDNA: true, ignore: true } },
      { name: "Hand_accessory_top", options: { bypassDNA: true, ignore: true } },
      { name: "Facial_feature", options: { displayName: "Facial feature", fitWith:"Facial_feature_top" } },
      { name: "Mouth" },
      { name: "Eyes" },
      /* { name: "Eye_cover_glass", options: { bypassDNA: true, ignore: true, opacity: 0.65 } },
      { name: "Eye_cover", options: { displayName: "Eye cover" } }, */
      { name: "Facial_feature_top", options: { bypassDNA: true, ignore: true } },
      { name: "Hair", options: { fitWith:"Hair_back", } }, // [Hair_back] will try to be matched with an element by the same name as the selected element in [Hair]
      { name: "Earring" },
      { name: "Hairclip" },

    ],

    colorTags:["WHITE","GRAY","BLACK",
      "RED","ORANGE","YELLOW",
      "LIME","OLIVE","GREEN", 
      "TURQ","CYAN","BLUE","DENIM",
      "PURPLE","PINK"],

    generationConditions: [
      // HAIR -> EARRING
      {
        layer: "Hair", tags: [["NOEAR"]],
        blockLayers: ["Earring"],
      },
      {
        layer: "Hair", tags: [["EARSM"]],
        forceTags: [{
          layer:"Earring",
          tags:[["SMALL"]],
          disableSameColor:true
        }]
      },


      // HAIR -> HAIRCLIP
      {
        layer: "Hair", tags: [["HAIR1"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR1"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR2"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR2"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR3"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR3"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR4"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR4"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR5"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR5"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR6"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR6"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR7"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR7"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR8"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR8"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR9"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR9"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR10"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR10"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR11"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR11"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR12"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR12"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR13"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR13"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR14"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR14"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR15"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR15"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR16"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR16"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR17"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR17"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR18"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR18"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR19"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR19"]],disableSameColor:true}]},
      {
        layer: "Hair", tags: [["HAIR20"]],
        forceTags: [{layer:"Hairclip",tags:[["HAIR20"]],disableSameColor:true}]},
      

      // LONG
      {
        layer: "Top", tags: [["LONG"]],
        blockLayers: ["Bottom"],
      },
      // PANT
      {
        layer: "Bottom", tags: [["PANT"]],
        blockLayers: ["Legs", "Thighs"],
      },
      // Cyber neck overlays block neck accessories
      {
        layer: "Body overlay", trait: "Body_overlay_3_Cyber neck",
        blockLayers: ["Neck accessory"],
      },

      // SPECIALS
      // BUNNY SUITS
      {
        layer: "Top", traits: ["Top_SPECIAL_LONG_BLACK_24_Combat bunny suit#2"],
        blockLayers: ["Thighs"],
      },
      {
        layer: "Top", traits: ["Top_SPECIAL_LONG_BLACK_23_Bunny suit", "Top_SPECIAL_LONG_BLACK_23_Bunny suit 2 part#2","Top_SPECIAL_LONG_BLACK_24_Combat bunny suit#2"],
        forceTags: [{
          layer:"Legs",
          //excludeNone:true, // this will disable weighted none possibilities
          tags:[["HT","H","L"],["BLACK","BLACKT"]]
        }]
      },
      {
        layer: "Top", traits: ["Top_SPECIAL_LONG_CYAN_23_Bunny suit cyan#2"],
        forceTags: [{
          layer:"Legs",
          tags:[["HT","H","L"],["BLACK","BLACKT"]]
        }]
      },
      // OVERALLS
      {
        layer: "Top", traits: ["TOP_SPECIAL_DENIM_LONG_Overalls#1"],
        forceTags: [{
          layer:"Legs",
          tags:[["L"],["GRAY"]]
        }]
      },
      // DANCE TOPS
      {
        layer: "Top", traits: ["Top_SPECIAL_Dance top 1#2","Top_SPECIAL_Dance top 2#1"],
        forceTraits: [{
          layer:"Bottom",
          traits:["Bottom_SPECIAL_PANT_Dance suit 2#0","Bottom_SPECIAL_PANT_Dance suit#0"]
        }]
      },
      // MODERN TOP
      {
        layer: "Top", traits: ["Top_SPECIAL_BLACK_36_Modern jacket#1"],
        forceTraits: [{
          layer:"Bottom",
          traits:["Bottom_H_CAS_BLACK_PANT_23_Jeans black#5","Bottom_H_SPECIAL_BLACK_7_High skirt black","Bottom_H_SPECIAL_BLACK_PANT_24_Tight pants black"]
        }]
      },
      {
        layer: "Bottom", traits: ["Bottom_H_SPECIAL_BLACK_7_High skirt black"],
        forceTags: [{
          layer:"Legs",
          tags:[["L","T"],["BLACK","BLACKT"]]
        }],
      },

      // SCHOOL
      // SCHOOL GYM TOPS
      {
        layer: "Top", traits: ["Top_SG_BLUE_14_Gym uniform#5"],
        forceTags: [{
          layer:"Bottom",
          tags:[["SG"],["BLUE"]]
        }],
      },
      {
        layer: "Top", traits: ["Top_SG_RED_15_Gym uniform 2#5"],
        forceTags: [{
          layer:"Bottom",
          tags:[["SG"],["RED"]]
        }],
      },
      // SCHOOL GYM BOTTOMS
      {
        layer: "Bottom", traits: ["Bottom_SG_BLUE_12_Gym bloomers","Bottom_SG_BLUE_21_Gym retro shorts"],
        forceTags: [{
          layer:"Legs",
          tags:[["L"],["BLUE","BLACK","WHITE"]]
        }],
      },
      {
        layer: "Bottom", traits: ["Bottom_SG_RED_13_Gym bloomers 2","Bottom_SG_RED_21_Gym retro shorts 2"],
        forceTags: [{
          layer:"Legs",
          tags:[["L"],["RED","BLACK","WHITE"]]
        }],
      },
      // SCHOOL TOPS
      {
        layer: "Top", traits: ["Top_S_WHITE_20_Serafuku#5","Top_S_WHITE_20_Serafuku leader#2","Top_S_YELLOW_21_Serafuku sweater#5"],
        forceTags: [{
          layer:"Bottom",
          tags:[["S"],["BLUE"]]
        }],
      },
      {
        layer: "Top", traits: ["Top_S_BLACK_20_Serafuku 2#5","Top_S_BLACK_20_Serafuku leader 2#2","Top_S_BLACK_21_Serafuku sweater 2#5"],
        forceTags: [{
          layer:"Bottom",
          tags:[["S"],["RED"]]
        }],
      },
      {
        layer: "Top", traits: ["Top_S2_WHITE_26_School top","Top_S2_BLACK_27_School top sweater"],
        forceTags: [{
          layer:"Bottom",
          tags:[["S"],["BLACK","BLUE"]]
        }],
      },
      // SCHOOL BOTTOMS
      {
        layer: "Bottom", traits: ["Bottom_S_BLUE_17_Serafuku skirt"],
        forceTags: [{
          layer:"Legs",
          tags:[["L","H","T"],["BLUE","BLACK","WHITE","BLACKT"]]
        }],
      },
      {
        layer: "Bottom", traits: ["Bottom_S_RED_17_Serafuku skirt 2"],
        forceTags: [{
          layer:"Legs",
          tags:[["L","H","T"],["RED","BLACK","WHITE","BLACKT"]]
        }],
      },
      {
        layer: "Bottom", traits: ["Bottom_S_BLACK_17_Serafuku skirt 3"],
        forceTags: [{
          layer:"Legs",
          tags:[["L","H","T"],["BLACK","WHITE","BLACKT"]]
        }],
      },

      // OFFICE
      // OFFICE TOPS
      {
        layer: "Top", traits: ["Top_O_WHITE_17_Buttoned","Top_O_WHITE_22_Office sweater","Top_O_WHITE_25_Exotic office shirt","Top_O_WHITE_16_Loose#5"],
        forceTags: [{
          layer:"Bottom",
          tags:[["O"],["GRAY","RED"]]
        }]
      },
      {
        layer: "Top", traits: ["Top_O_GRAY_19_Business"],
        forceTags: [{
          layer:"Bottom",
          tags:[["O"],["GRAY"]]
        }]
      },
      {
        layer: "Top", traits: ["Top_O_RED_19_Business red#2"],
        forceTags: [{
          layer:"Bottom",
          tags:[["O"],["RED"]]
        }]
      },
      // OFFICE SWEATERS
      {
        layer: "Top", traits: ["Top_O_WHITE_LONG_22_Long office sweater#4","Top_O_RED_LONG_22_Long office sweater red#2","Top_O_PINK_LONG_22_Long office sweater pink#1","Top_O_GRAY_LONG_22_Long office sweater gray#2"],
        forceTraits: [{
          layer:"Legs",
          traits:["Legs_H_GRAY_1_Thigh highs strapped"]
        }],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT"],["H","T"]]
        }]
      },
      // OFFICE BOTTOMS
      {
        layer: "Bottom", tags: [["O"]],
        forceTraits: [{
          layer:"Legs",
          traits:["Legs_H_GRAY_1_Thigh highs strapped"]
        }],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT"],["H","T"]]
        }]
      },

      // SECURITY
      // SECURITY TOPS
      {
        layer: "Top", traits: ["Top_SEC_GRAY_32_Combat vest","Top_SEC_GRAY_34_Vest used#5","Top_SEC_GRAY_34_Vest#5","Top_SEC_GRAY_35_Heavy vest"],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS","S","O","CYB"],["GRAY","DENIM","BLUE","RED","PINK"],["H","S","O","CYB"]]
        }]
      },
      
      // CYBER
      // CYBER TOPS
      {
        layer: "Top", traits: ["Top_CYB_GRAY_29_Jacket","Top_CYB_GRAY_33_Jacket 2"],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS","CYB"],["GRAY","DENIM","BLUE","RED","PINK","BLACK"],["H","CYB"]]
        }]
      },

      // CYBER BOTTOMS
      {
        layer: "Bottom", tags: [["CYB"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT","GRAY"],["L","H","T"]]
        }]
      },

      // SPORT
      // SPORT TOPS
      {
        layer: "Top", tags: [["SP"],["H"],["WHITE","PINK"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["H"]]
        }],
        forceTraits: [{
          layer:"Bottom",
          traits:["Bottom_L_CAS_DENIM_4_Denim"]
        }],
      },
      {
        layer: "Top", tags: [["SP"],["H"],["PURPLE","GRAY"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["H"],["GRAY","DENIM","BLUE"]]
        }],
        forceTraits: [{
          layer:"Bottom",
          traits:["Bottom_L_CAS_DENIM_4_Denim"]
        }],
      },
      {
        layer: "Top", tags: [["SP"],["L"],["WHITE","PINK"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"]]
        }]
      },
      {
        layer: "Top", tags: [["SP"],["L"],["PURPLE","GRAY"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["GRAY","DENIM","BLUE"]]
        }]
      },
      // SPORT BOTTOMS
      {
        layer: "Bottom", tags: [["SP"],["WHITE","PINK","GREEN"]],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","PINK","BLACKT"],["L","H","T"]]
        }]
      },
      {
        layer: "Bottom", tags: [["SP"],["PURPLE","BLUE","CYAN","OLIVE","RED"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT","GRAY"],["L","H","T"]]
        }]
      },
      {
        layer: "Bottom", tags: [["SP"],["GRAY"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT","GRAY","WHITE"],["L","H","T"]]
        }]
      },

      // CASUAL
      // CASUAL TOPS
      {
        layer: "Top", tags: [["CAS"],["H"],["WHITE","PINK","GREEN","GRAY"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS","CYB"],["H"]]
        }],
      },
      {
        layer: "Top", tags: [["CAS"],["H"],["PURPLE","BLUE","DENIM","CYAN","OLIVE","RED"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS","S","CYB"],["H"],["PURPLE","GRAY","BLUE","DENIM","CYAN","OLIVE","RED"]]
        }],
      },
      {
        layer: "Top", tags: [["CAS"],["L"],["WHITE","PINK","GREEN","GRAY"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS","CYB"]]
        }]
      },
      {
        layer: "Top", tags: [["CAS"],["L"],["PURPLE","BLUE","DENIM","CYAN","OLIVE","RED"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS","S","CYB"],["PURPLE","GRAY","BLUE","DENIM","CYAN","OLIVE","RED"]]
        }]
      },
      // CASUAL BOTTOMS
      {
        layer: "Bottom", tags: [["CAS"],["WHITE","PINK","GREEN"]],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","PINK","BLACKT"],["L","H","T"]]
        }]
      },
      {
        layer: "Bottom", tags: [["CAS"],["PURPLE","BLUE","CYAN","OLIVE","RED"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT","GRAY"],["L","H","T"]]
        }]
      },
      {
        layer: "Bottom", tags: [["CAS"],["GRAY"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT","GRAY","WHITE"],["L","H","T"]]
        }]
      },
      {
        layer: "Bottom", tags: [["CAS"],["DENIM"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT","GRAY","RED","BLUE","WHITE","PINK"],["L","H","T"]]
        }]
      },
      // CASUAL LONGS
      {
        layer: "Top", tags: [["CAS"],["LONG"],["PINK","WHITE","YELLOW","GREEN","GRAY"]],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","PINK","BLACKT"],["L","H","T"]]
        }]
      },
      {
        layer: "Top", tags: [["CAS"],["LONG"],["BLACK"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT","BLACK"],["L","H","T"]]
        }]
      },
      /* {
        layer: "Top", tags: [["CAS"],["LONG"],["PURPLE","BLUE","CYAN","OLIVE","RED"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT","GRAY","RED"],["L","H","T"]]
        }]
      }, */
  ],
  },
];

const averageTraitWeight = 10;

const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 2600,
  height: 3200,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 2 / 128,
};

const background = {
  generate: true,
  useCustomBackground: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const passiveTraits = true;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  passiveTraits,
  layerConfigurations,
  averageTraitWeight,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
};
