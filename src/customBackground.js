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

const genColor = () => {
	let hue = Math.floor(Math.random() * 360);
	let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
	return pastel;
};

const generateCustomBackground = (ctx) => {
    ctx.fillStyle = background.static ? background.default : genColor();
	ctx.fillRect(0, 0, format.width, format.height);
    ctx.fillStyle = background.static ? background.default : genColor();
	ctx.fillRect(0 + format.width * 0.1, 0 + format.height * 0.1, format.width * 0.8, format.height * 0.8);
  };

module.exports = {
	generateCustomBackground,
};