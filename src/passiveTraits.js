const basePath = process.cwd();
const {
	format,
	baseUri,
	description,
	background,
	uniqueDnaTorrance,
	layerConfigurations,
	rarityDelimiter,
	shuffleLayerConfigurations,
	debugLogs,
	extraMetadata,
	text,
	namePrefix,
	network,
	solanaMetadata,
	gif,
} = require(`${basePath}/src/config.js`);
const help = require(`${basePath}/src/help.js`);

const demeanors = [
	"Smug", "Playful", "Cute", "Sultry", "Angry", "Crazy", "Shy", "Happy", "Aloof", "Bored", "Tired" 
];

const generatePassiveTraits = (_metadata) => {
	let attributes = _metadata.attributes;
	attributes.push({
		"trait_type": "Demeanor",
		"value": demeanors[Math.floor(Math.random() * demeanors.length)]
	});
  };

module.exports = {
	generatePassiveTraits,
};