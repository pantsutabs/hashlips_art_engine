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

const rngSeed = "TESTING ROLLS: FBD Scuffed Femboys #:"; // null to disable, this makes it so every NFT is predetermined

const traitOutline = false;

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 500,
    layersOrder: [
      { name: "Hair_back", options: { bypassDNA: true, ignore: true } },
      { name: "Back" },
      { name: "Hand_accessory", options: { displayName: "Hand accessory", fitWith:"Hand_accessory_top", } },
      { name: "Top_back", options: { bypassDNA: true, ignore: true } },
      { name: "Body", options: { unlisted: true } },
      { name: "Belly" },
      { name: "Body_overlay", options: { displayName: "Body overlay" } },
      { name: "Legs" },
      { name: "Thighs" },
      { name: "Bottom" },
      { name: "Neck_accessory", options: { displayName: "Neck accessory", fitWith:"Neck_accessory_top", } },
      { name: "Top", options: { fitWith:"Top_back", } },
      { name: "Neck_accessory_top", options: { bypassDNA: true, ignore: true } },
      { name: "Facial_feature", options: { displayName: "Facial feature", fitWith:"Facial_feature_top" } },
      { name: "Mouth" },
      { name: "Eyes" },
      { name: "Facial_feature_top", options: { bypassDNA: true, ignore: true, fitWith:"Facial_feature_top_2" } },
      { name: "Hair", options: { fitWith:"Hair_back", } }, // [Hair_back] will try to be matched with an element by the same name as the selected element in [Hair]
      { name: "Facial_feature_top_2", options: { bypassDNA: true, ignore: true } },
      { name: "Earring" },
      { name: "Hairclip" },
      { name: "Hand_accessory_top", options: { bypassDNA: true, ignore: true } },

    ],

    specialEditions:[
      // This lets you create special generations at specific ids, useful for hand crafted rare ones
      //
      // Special version 0 femboy
      /* {
        id:1,
        traits:{
          "Hand accessory":"Hand_accessory_1_Knowledge",
          "Body":"Body_2_Caramel",
          "Bottom":"Bottom_H_SP_GRAY_10_Tight shorts",
          "Top":"Top_L_CAS_WHITE_1_Off shoulder shirt",
          "Mouth":"Mouth_3",
          "Eyes":"Eyes_2_Purple",
          "Hair":"Hair_HAIR1_BLONDE_NORMAL_EAR_Magma blonde",
        }
      }, */
    ],

    // These are needed if you intend to use 'disableSameColor', tagging traits with colors seems like a decent practice in general
    colorTags:["WHITE","GRAY","BLACK",
      "RED","ORANGE","YELLOW","BLONDE",
      "LIME","OLIVE","GREEN", 
      "TURQ","TEAL","CYAN","BLUE","DENIM",
      "PURPLE","PINK"],

    // This is a really long bit that dictates how generation conditions
    generationConditions: [






      // HAIR -> HAIRCLIP
      // Hairclips are fitted manually to every hair style
      // disableSameColor makes sure that hairclips that would be hard to see on a hair color would be excluded
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


        
      // HAIR -> EARRING
      // Hairs without ears shouldn't have earrings
      {
        layer: "Hair", tags: [["NOEAR"]],
        blockLayers: ["Earring"],
      },
      // 1 hairstyle has very little ear room, it only has small earrings
      // none is excluded because the small earrings are a much smaller pool
      {
        layer: "Hair", tags: [["EARSM"]],
        forceTags: [{
          layer:"Earring",
          tags:[["SMALL"]],
          disableSameColor:true,
          excludeNone:true
        }]
      },
      {
        layer: "Hair", tags: [["EAR"],["-HAIR3"]],
        forceTags: [{
          layer:"Earring",
          tags:[["BIG","SMALL"]],
          disableSameColor:true
        }]
      },
      // Special case, loops looks weird with hair 3
      {
        layer: "Hair", tags: [["HAIR3"]],
        forceTags: [{
          layer:"Earring",
          tags:[["BIG","SMALL"],["-Loop"],["-Loop square"]],
          disableSameColor:true
        }]
      },


      // HAIR -> FACIAL FEATURE
      // Partially face covering hairs on LEFT shouldn't have LEFT facial features, specifically it's 1 bandage
      {
        layer: "Hair", tags: [["COVERL"]],
        forceTags: [{
          layer:"Facial feature",
          tags:[["M","R"]],
        }]
      },
      




      // GENERAL OUTFIT CONDITIONS
      // LONG
      // Long outfits have bottoms disabled, things like dresses and overalls
      {
        layer: "Top", tags: [["LONG"]],
        blockLayers: ["Bottom"],
      },
      // PANT
      // Pants have thigh highs and thigh accessories disabled
      {
        layer: "Bottom", tags: [["PANT"]],
        blockLayers: ["Legs", "Thighs"],
      },





      ////
      // MISC CONDITIONS
      ////

      ////
      // Special full robo body shouldn't have belly piercings or facial features
      {
        layer: "Body", traits: ["Body_CYBORG_5_Robo#1", "Body_CYBORG_5_Robo 2#1"],
        blockLayers: ["Belly"],
      },
      // General cyborg bodies shouldn't have body overlays (most are bandages or other cyber parts, silly) and cyber eyes
      // Cyber eyes are listed manually but I should've tagged them
      {
        layer: "Body", tags: [["CYBORG"]],
        blockLayers: ["Body overlay", "Facial feature"],
        forceTags: [{
          layer:"Eyes",
          tags:[["-Cyber green"],["-Cyber red"]]
        },
        {
          layer:"Neck accessory",
          tags:[["-Bandages"]]
        },
        {
          layer:"Legs",
          tags:[["-Adhesive bandage"],["-Bandaged leg"]]
        }]
      },
      // Cyber neck overlays block neck accessories
      {
        layer: "Body overlay", traits: ["Body_overlay_3_Cyber neck"],
        blockLayers: ["Neck accessory"],
      },
      // DISABLE THIGHS WITH COLORED LEGS
      // Thigh accessories (THIGH slot) should only appear on GRAY and BLACKT legs, the solution is either disable on every other color... or mark all the thigh accessories with #0
      {
        layer: "Legs", tags: [["PINK","WHITE","BLACK","RED","GREEN"]],
        blockLayers: ["Thighs"],
      },
      // If bottoms are too high and block belly, block belly trait
      {
        layer: "Bottom", tags: [["H","S","SPECIAL"]],
        blockLayers: ["Belly"],
      },
      // If top doesn't reveal tummy, block belly trait
      {
        layer: "Top", tags: [["-TUM"]],
        blockLayers: ["Belly"],
      },





      

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //////          //////          //////          //////          //////          //////          //////          //////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //////          //////          //////          //////          //////          //////          //////          //////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////// CLOTHING
      ////////////////////////////////////////////////////////////////

      ////////////////////////////////////////////
      ////////////////////////////////////////// MOSTLY TOPS
      ////////////////////////////////////////////

      ////
      // SPECIALS
      ////

      ////
      // MAID DRESSES
      ////
      {
        layer: "Top", traits: ["Top_SPECIAL_LONG_26_Maid dress","Top_SPECIAL_LONG_26_Combat maid#5"],
        forceTags: [{
          layer:"Legs",
          excludeNone:true,
          tags:[["WHITE","BLACK","BLACKT"]]
        }]
      },
      {
        layer: "Top", traits: ["Top_SPECIAL_LONG_26_Maid dress pink#5"],
        forceTags: [{
          layer:"Legs",
          excludeNone:true,
          tags:[["WHITE","PINK"]]
        }]
      },

      ////
      // DOLL DRESS
      ////
      {
        layer: "Top", traits: ["Top_SPECIAL_LONG_25_Doll dress#5"],
        forceTraits: [{
          layer:"Legs",
          traits:["Legs_T_BLACKT_14_Light tights","Legs_T_BLACKT_5_Tights","Legs_L_GRAY_4_Kitty","Legs_L_GRAY_1_Thigh highs","Legs_L_GRAY_1_Thigh highs stripes#5"]
        }]
      },

      ////
      // BUNNY SUITS
      ////
      // This suit clashes with the thigh slot a little
      {
        layer: "Top", traits: ["Top_SPECIAL_LONG_BLACK_24_Combat bunny suit#4"],
        blockLayers: ["Thighs"],
      },
      {
        layer: "Top", traits: ["Top_SPECIAL_LONG_BLACK_23_Bunny suit", "Top_SPECIAL_LONG_BLACK_23_Bunny suit 2 part#4","Top_SPECIAL_LONG_BLACK_24_Combat bunny suit#4","Top_SPECIAL_LONG_CYAN_23_Bunny suit cyan#4"],
        forceTags: [{
          layer:"Legs",
          tags:[["HT","H","L"],["BLACK","BLACKT"]]
        }]
      },

      ////
      // DANCE TOPS
      ////
      {
        layer: "Top", traits: ["Top_SPECIAL_Dance top 2#3","Top_SPECIAL_Dance top 1#3"],
        blockLayers: ["Thighs","Legs"],
        forceTraits: [{
          layer:"Bottom",
          traits:["Bottom_SPECIAL_Dance suit#0","Bottom_SPECIAL_Dance suit 2#0"]
        }]
      },

      ////
      // MODERN JACKET
      ////
      {
        layer: "Top", traits: ["Top_SPECIAL_BLACK_36_Modern jacket#4"],
        forceTraits: [{
          layer:"Bottom",
          traits:["Bottom_H_SPECIAL_BLACK_7_High skirt black","Bottom_H_SPECIAL_BLACK_PANT_24_Tight pants black","Bottom_H_CAS_BLACK_PANT_23_Jeans black#5"]
        }]
      },

      ////
      // OVERALLS
      ////
      {
        layer: "Top", traits: ["Top_SPECIAL_DENIM_LONG_Overalls#4"],
        forceTags: [{
          layer:"Legs",
          tags:[["L"],["GRAY"]]
        }]
      },

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //////          //////          //////          //////          //////          //////          //////          //////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //////          //////          //////          //////          //////          //////          //////          //////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // SEC & CYB
      ////
      // SEC tops go with pretty much anything H or similarly high, the juxtaposition with brighter colors is funny
      {
        layer: "Top", tags: [["SEC"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS","S","O","CYB"],["GRAY","DENIM","BLUE","RED","PINK"],["H","S","O","CYB"]]
        }]
      },
      // CYB tops are pretty much the same, they look a bit awkward with office and school bottoms though
      {
        layer: "Top", tags: [["CYB"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS","CYB"],["GRAY","DENIM","BLUE","RED","PINK","BLACK"],["H","CYB"]]
        }]
      },

      ////
      // OFFICE TOPS
      ////
      // White office tops work with gray/red office bottoms
      {
        layer: "Top", tags: [["O"],["WHITE"],["-LONG"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["O"],["GRAY","RED"]]
        }]
      },
      // Gray tops work only with gray bottoms
      {
        layer: "Top", tags: [["O"],["GRAY"],["-LONG"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["O"],["GRAY"]]
        }]
      },
      // Red tops work only with red bottoms
      {
        layer: "Top", tags: [["O"],["RED"],["-LONG"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["O"],["RED"]]
        }]
      },
      // OFFICE SWEATERS
      // Office sweaters go with a specific gray bottom (it looks less casual than the rest) and transparent black thigh highs and tights
      {
        layer: "Top", tags: [["LONG"],["O"]],
        forceTraits: [{
          layer:"Legs",
          traits:["Legs_H_GRAY_1_Long thigh highs strapped"]
        }],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT"],["H","T"]]
        }]
      },

      ////
      // MODERN SCHOOL TOPS [S2]
      ////
      // White or black tops go with black or blue school skirts
      {
        layer: "Top", tags: [["S2"],["WHITE","BLACK"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["S"],["BLACK","BLUE"]]
        }],
      },
      // This is the tomoko outfit, it goes only with the special yellow school skirt
      {
        layer: "Top", tags: [["S2"],["YELLOW"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["S"],["YELLOW"]]
        }],
      },

      //// 
      // TRADITIONAL SCHOOL TOPS [S]
      ////
      // White and yellow tops are blue uniforms (confusing) they use blue bottoms
      {
        layer: "Top", tags: [["S"],["WHITE","YELLOW"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["S"],["BLUE"]]
        }],
      },
      // Black tops are red uniforms, red bottoms
      {
        layer: "Top", tags: [["S"],["BLACK"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["S"],["RED"]]
        }],
      },

      //// 
      // SCHOOL GYM OUTFITS [SG]
      ////
      {
        layer: "Top", tags:[["SG"],["BLUE"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SG"],["BLUE"]]
        }],
      },
      {
        layer: "Top", tags:[["SG"],["RED"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SG"],["RED"]]
        }],
      },

      ////
      // SPORTS TOPS [SP]
      ////
      // Sports tops go with their height, and SP/CAS
      {
        layer: "Top", tags: [["SP"],["H"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["H"]]
        }]
      },
      ////
      {
        layer: "Top", tags: [["SP"],["L"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"]]//,["L"]]
        }]
      },
      // These don't specify L or H becasue the above 2 conditions already do, SP/CAS aren't necessary here either but it's clearer this way
      {
        layer: "Top", tags: [["SP"],["PURPLE","GRAY","RED","BLUE"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["GRAY","DENIM","BLUE"]]
        }],
      },
      {
        layer: "Top", tags: [["SP"],["WHITE","PINK"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"]]
        }]
      },
      // Specific bottoms for a few tops that have a unique shade of pink and look bad with gray things
      {
        layer: "Top", traits: ["Top_H_TUM_SP_PINK_12_Cropped hoodie pink", "Top_H_TUM_SP_PINK_10_Pink croptop"],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["WHITE","PINK"]]
        },
        {
          layer:"Legs",
          tags:[["WHITE","PINK"]]
        }],
      },     
      {
        layer: "Top", traits: ["Top_H_TUM_SP_WHITE_10_White croptop","Top_H_TUM_SP_WHITE_12_Cropped hoodie"],
        forceTags: [{
          layer:"Bottom",
          tags:[["-Leggings alternative pink"]]
        }]
      },

      ////
      // CASUAL TOPS
      ////
      // CASUAL LONG TOPS
      ////
      {
        layer: "Top", tags: [["CAS"],["LONG"],["DENIM"]],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","PINK","BLACKT"],["L","T"]]
        }]
      },
      {
        layer: "Top", tags: [["CAS"],["LONG"],["GRAY"]],
        forceTags: [{
          layer:"Legs",
          tags:[["GRAYPINK","GRAY","BLACKT"],["L","T"]]
        }]
      },
      {
        layer: "Top", tags: [["CAS"],["LONG"],["PINK"]],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","PINK","BLACKT"],["L","T"]]
        }]
      },
      {
        layer: "Top", tags: [["CAS"],["LONG"],["BLACK"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKPINK","BLACKT"],["L","H","T"]]
        }]
      },
      ////
      // CASUAL NORMAL TOPS
      ////
      {
        layer: "Top", tags: [["CAS"],["H"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["H"]]
        }]
      },
      ////
      {
        layer: "Top", tags: [["CAS"],["L"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["L","CAS"]] // This means SP has to be L, and CAS can be either H/L
        }]
      },
      ////
      // CASUAL NORMAL TOPS IN DEPTH
      ////
      {
        layer: "Top", tags: [["CAS"],["WHITE"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["GRAY","WHITE","DENIM","PINK","RED","BLUE","GREEN","CYAN"]]
        },
        // Added color restrictions to legs
        {
          layer:"Legs",
          tags:[["GRAY","WHITE","PINK"]]
        }],
      },
      {
        layer: "Top", tags: [["CAS"],["GRAY"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["GRAY","DENIM","RED","BLUE"]]
        },
        {
          layer:"Legs",
          tags:[["GRAY","GRAYPINK","BLACKT","RED","BLUE"]]
        }],
      },
      {
        layer: "Top", tags: [["CAS"],["RED","PURPLE","BLUE"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["GRAY","DENIM","RED","BLUE","BLACK"]]
        },
        {
          layer:"Legs",
          tags:[["GRAY","GRAYPINK","BLACKT","PURPLE","BLUE","BLACK"]]
        }],
      },
      {
        layer: "Top", tags: [["CAS"],["OLIVE"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["GRAY","DENIM","RED","BLUE"]]
        },
        {
          layer:"Legs",
          tags:[["GRAY","GRAYPINK","BLACKT","RED","BLUE"]]
        }],
      },
      {
        layer: "Top", tags: [["CAS"],["PINK"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["GRAY","DENIM","WHITE","PINK"]]
        },
        {
          layer:"Legs",
          tags:[["WHITE","PINK","GRAYPINK","GRAY","BLACKT"]]
        }],
      },
      {
        layer: "Top", tags: [["CAS"],["CYAN","GREEN"]],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["GRAY","DENIM","WHITE","BLACK","GREEN"]]
        },
        {
          layer:"Legs",
          tags:[["WHITE","PINK","GRAYPINK","GRAY","BLACKT","GREEN","RED"]]
        }],
      },
      // Specific bottoms for a few tops that have a unique shade of pink and look bad with gray things
      {
        layer: "Top", traits: ["Top_L_CAS_PINK_13_Rainbow sweater#6"],
        forceTags: [{
          layer:"Bottom",
          tags:[["SP","CAS"],["PINK"]]
        },
        {
          layer:"Legs",
          tags:[["PINK"]]
        }],
      },
      // Specific rules for sundresses
      {
        layer: "Top", traits: ["Top_CAS_PINK_LONG_9_Pink sundress#5","Top_CAS_YELLOW_LONG_9_Sundress#5"],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","BLACKT","PINK"]]
        }],
      },
      {
        layer: "Top", traits: ["Top_CAS_BLACK_LONG_9_Black sundress#5"],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACK","BLACKT"]]
        }],
      },





      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //////          //////          //////          //////          //////          //////          //////          //////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //////          //////          //////          //////          //////          //////          //////          //////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      ////////////////////////////////////////////
      ////////////////////////////////////////// BOTTOMS
      ////////////////////////////////////////////

      ////
      // SPECIAL BOTTOMS
      ////
      {
        layer: "Bottom", traits: ["Bottom_H_SPECIAL_BLACK_7_High skirt black"],
        forceTags: [{
          layer:"Legs",
          tags:[["L","T"],["BLACK","BLACKT"]]
        }],
      },

      ////
      // These server as additional rules, tops can dictate leg slot rules, but if missing these are more generalized rules
      ////
      // CYBER BOTTOMS
      // CYB bottoms are all gray, they fit with grays and transparent blacks
      {
        layer: "Bottom", tags: [["CYB"],["GRAY"]],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT","GRAY"],["L","T"]]
        }]
      },

      ////
      // OFFICE BOTTOMS
      ////
      {
        layer: "Bottom", tags: [["O"]],
        forceTraits: [{
          layer:"Legs",
          traits:["Legs_H_GRAY_1_Long thigh highs strapped"]
        }],
        forceTags: [{
          layer:"Legs",
          tags:[["BLACKT"],["H","T"]]
        }]
      },

      ////
      // SCHOOL BOTTOMS
      // UNSORTED [S],[S2]
      ////
      {
        layer: "Bottom", tags: [["S"],["BLUE"]],
        forceTags: [{
          layer:"Legs",
          tags:[["L","H","T"],["BLUE","BLACK","WHITE","BLACKT"]]
        }],
      },
      {
        layer: "Bottom", tags: [["S"],["RED"]],
        forceTags: [{
          layer:"Legs",
          tags:[["L","H","T"],["RED","BLACK","WHITE","BLACKT"]]
        }],
      },
      {
        layer: "Bottom", tags: [["S"],["BLACK"]],
        forceTags: [{
          layer:"Legs",
          tags:[["L","H","T"],["BLACK","WHITE","BLACKT"]]
        }],
      },
      // Yellow bottoms specific
      {
        layer: "Bottom", tags: [["S"],["YELLOW"]],
        forceTags: [{
          layer:"Legs",
          tags:[["L","H","T"],["WHITE"]]
        }],
        forceTraits: [{
          layer:"Legs",
          traits:["Legs_L_BLACK_7_Socks black","Legs_L_BLACK_1_Thigh highs black"]
        }],
      },

      ////
      // SCHOOL GYM BOTTOMS
      ////
      {
        layer: "Bottom", tags:[["SG"],["BLUE"]],
        forceTags: [{
          layer:"Legs",
          tags:[["L"],["BLUE","BLACK","WHITE"]]
        }],
      },
      {
        layer: "Bottom", tags:[["SG"],["RED"]],
        forceTags: [{
          layer:"Legs",
          tags:[["L"],["RED","BLACK","WHITE"]]
        }],
      },

      ////
      // SPORTS BOTTOMS
      ////
      {
        layer: "Bottom", tags: [["SP"],["WHITE","PINK","GREEN"]],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","PINK","GRAYPINK"],["L","H","T"]]
        }]
      },
      /* { // This doesn't apply to anything
        layer: "Bottom", tags: [["SP"],["PURPLE","BLUE","CYAN","OLIVE","RED"]],
        forceTags: [{
          layer:"Legs",
          tags:[["GRAY","GRAYPINK"],["L","H","T"]]
        }]
      }, */
      {
        layer: "Bottom", tags: [["SP"],["GREEN"]],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","GREEN","RED","BLACK"]]
        }]
      },
      {
        layer: "Bottom", tags: [["SP"],["GRAY"]],
        forceTags: [{
          layer:"Legs",
          tags:[["GRAY","WHITE","GRAYPINK","RED","BLUE","BLACKT"],["L","H","T"]]
        }]
      },

      ////
      // CASUAL BOTTOMS
      ////
      {
        layer: "Bottom", tags: [["CAS"],["H"]],
        forceTags: [{
          layer:"Legs",
          tags:[["L","H","T"]]
        }]
      },
      {
        layer: "Bottom", tags: [["CAS"],["L"]],
        forceTags: [{
          layer:"Legs",
          tags:[["L","H","T"]]
        }]
      },
      {
        layer: "Bottom", tags: [["CAS"],["GRAY"]],
        forceTags: [{
          layer:"Legs",
          tags:[["GRAY","GRAYPINK","BLACKT","RED","BLUE"]]
        }]
      },
      {
        layer: "Bottom", tags: [["CAS"],["DENIM"]],
        forceTags: [{
          layer:"Legs",
          tags:[["GRAY","GRAYPINK","BLACKT","PINK","WHITE","RED","BLUE"]]
        }]
      },
      {
        layer: "Bottom", tags: [["CAS"],["PINK"]],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","BLACKT","PINK","GRAYPINK"]]
        }]
      },
      {
        layer: "Bottom", tags: [["CAS"],["GREEN"]],
        forceTags: [{
          layer:"Legs",
          tags:[["WHITE","GREEN","RED","BLACK"]]
        }]
      },

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

const passiveTraits = false; // true;

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
  rngSeed,
  traitOutline,
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
