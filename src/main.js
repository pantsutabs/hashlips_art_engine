const basePath = process.cwd();
const help = require(`${basePath}/src/help.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);
const fs = require("fs");
const sha1 = require(`${basePath}/node_modules/sha1`);
const { createCanvas, Image } = require(`${basePath}/node_modules/@napi-rs/canvas`);
const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;
const {
	format,
	baseUri,
	description,
	background,
	uniqueDnaTorrance,
	passiveTraits,
	layerConfigurations,
	averageTraitWeight,
	rarityDelimiter,
	shuffleLayerConfigurations,
	debugLogs,
	traitOutline,
	extraMetadata,
	text,
	namePrefix,
	network,
	solanaMetadata,
	gif,
} = require(`${basePath}/src/config.js`);
const {
	generateCustomBackground,
} = require(`${basePath}/src/customBackground.js`);
const {
	generatePassiveTraits,
} = require(`${basePath}/src/passiveTraits.js`);
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;
var metadataList = [];
var attributesList = [];
var dnaList = new Set();
const DNA_DELIMITER = "-";
const HashlipsGiffer = require(`${basePath}/modules/HashlipsGiffer.js`);

let hashlipsGiffer = null;

const buildSetup = () => {
	if (fs.existsSync(buildDir)) {
		fs.rmdirSync(buildDir, { recursive: true });
	}
	fs.mkdirSync(buildDir);
	fs.mkdirSync(`${buildDir}/json`);
	fs.mkdirSync(`${buildDir}/images`);
	if (gif.export) {
		fs.mkdirSync(`${buildDir}/gifs`);
	}
};

const getRarityWeight = (_str) => {
	let nameWithoutExtension = _str.slice(0, -4);
	var nameWithoutWeight = Number(
		nameWithoutExtension.split(rarityDelimiter).pop()
	);
	if (isNaN(nameWithoutWeight)) {
		nameWithoutWeight = averageTraitWeight;
	}
	return nameWithoutWeight;
};

const cleanDna = (_str) => {
	const withoutOptions = removeQueryStrings(_str);
	var dna = Number(withoutOptions.split(":").shift());
	return dna;
};

const cleanName = (_str) => {
	let nameWithoutExtension = _str.slice(0, -4);
	var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
	return nameWithoutWeight;
};

const getElements = (path) => {
	return fs
		.readdirSync(path)
		.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
		.map((i, index) => {
			if (i.includes("-")) {
				throw new Error(`layer name can not contain dashes, please fix: ${i}`);
			}
			return {
				id: index,
				name: cleanName(i),
				filename: i,
				path: `${path}${i}`,
				weight: getRarityWeight(i),
			};
		});
};

// This creates an array very similar to the layerOrder configuration, but lists all the available items under .elements in each member
const layersSetup = (layersOrder) => {
	const layers = layersOrder.map((layerObj, index) => ({
		id: index,
		elements: getElements(`${layersDir}/${layerObj.name}/`),
		name:
			layerObj.options ?.["displayName"] != undefined
				? layerObj.options ?.["displayName"]
					: layerObj.name,
		blend:
			layerObj.options ?.["blend"] != undefined
				? layerObj.options ?.["blend"]
					: "source-over",
		opacity:
			layerObj.options ?.["opacity"] != undefined
				? layerObj.options ?.["opacity"]
					: 1,
		bypassDNA:
			layerObj.options ?.["bypassDNA"] !== undefined
				? layerObj.options ?.["bypassDNA"]
					: false,
		ignore:
			layerObj.options ?.["ignore"] !== undefined
				? layerObj.options ?.["ignore"]
					: false,
		unlisted:
			layerObj.options ?.["unlisted"] !== undefined
				? layerObj.options ?.["unlisted"]
					: false,
		fitWith:
			layerObj.options ?.["fitWith"] !== undefined
				? layerObj.options ?.["fitWith"]
					: null,
	}));
	return layers;
};

const saveImage = (_editionCount) => {
	fs.writeFileSync(
		`${buildDir}/images/${_editionCount}.png`,
		canvas.toBuffer("image/png")
	);
};

const genColor = () => {
	let hue = Math.floor(help.random() * 360);
	let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
	return pastel;
};

const drawBackground = () => {
	ctx.fillStyle = background.static ? background.default : genColor();
	ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = (_dna, _edition) => {
	let dateTime = Date.now();
	let tempMetadata = {
		name: `${namePrefix} #${_edition}`,
		description: description,
		image: `${baseUri}/${_edition}.png`,
		dna: sha1(_dna),
		edition: _edition,
		date: dateTime,
		...extraMetadata,
		attributes: attributesList,
		compiler: "Modified HashLips Art Engine",
	};
	if (network == NETWORK.sol) {
		tempMetadata = {
			//Added metadata for solana
			name: tempMetadata.name,
			symbol: solanaMetadata.symbol,
			description: tempMetadata.description,
			//Added metadata for solana
			seller_fee_basis_points: solanaMetadata.seller_fee_basis_points,
			image: `${_edition}.png`,
			//Added metadata for solana
			external_url: solanaMetadata.external_url,
			edition: _edition,
			...extraMetadata,
			attributes: tempMetadata.attributes,
			properties: {
				files: [
					{
						uri: `${_edition}.png`,
						type: "image/png",
					},
				],
				category: "image",
				creators: solanaMetadata.creators,
			},
		};
	}
	metadataList.push(tempMetadata);
	attributesList = [];
};

const addAttributes = (_element) => {
	let selectedElement = _element.layer.selectedElement;
	attributesList.push({
		trait_type: _element.layer.name,
		value: selectedElement.name,
	});
};

const loadLayerImg = async (_layer) => {
	try {
		return new Promise(async (resolve) => {
			/* const image = await loadImage(`${_layer.selectedElement.path}`); */

			const file = await fs.promises.readFile(`${_layer.selectedElement.path}`);

			const image = new Image();
			image.src = file;

			resolve({ layer: _layer, loadedImage: image });
		});
	} catch (error) {
		console.error("Error loading image:", error);
	}
};

const addText = (_sig, x, y, size) => {
	ctx.fillStyle = text.color;
	ctx.font = `${text.weight} ${size}pt ${text.family}`;
	ctx.textBaseline = text.baseline;
	ctx.textAlign = text.align;
	ctx.fillText(_sig, x, y);
};

const drawElementDestOut = (_renderObject, _index, _layersLen) => {
	ctx.globalAlpha = _renderObject.layer.opacity;
	ctx.globalCompositeOperation = "destination-out";
	text.only
		? addText(
			`${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
			text.xGap,
			text.yGap * (_index + 1),
			text.size
		)
		: ctx.drawImage(
			_renderObject.loadedImage,
			0,
			0,
			format.width,
			format.height
		);

	addAttributes(_renderObject);
	ctx.globalCompositeOperation = _renderObject.layer.blend;
};

const drawElement = (_renderObject, _index, _layersLen) => {
	ctx.globalAlpha = _renderObject.layer.opacity;
	ctx.globalCompositeOperation = _renderObject.layer.blend;
	text.only
		? addText(
			`${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
			text.xGap,
			text.yGap * (_index + 1),
			text.size
		)
		: ctx.drawImage(
			_renderObject.loadedImage,
			0,
			0,
			format.width,
			format.height
		);

	addAttributes(_renderObject);
};

const constructLayerToDna = (_dna = "", _layers = []) => {
	let mappedDnaToLayers = _layers.map((layer, index) => {
		let selectedElement = layer.elements.find(
			(e) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
		);
		return {
			name: layer.name,
			blend: layer.blend,
			opacity: layer.opacity,
			selectedElement: selectedElement,
		};
	});
	return mappedDnaToLayers;
};

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
	const dnaItems = _dna.split(DNA_DELIMITER);
	const filteredDNA = dnaItems.filter((element) => {
		const query = /(\?.*$)/;
		const querystring = query.exec(element);
		if (!querystring) {
			return true;
		}
		const options = querystring[1].split("&").reduce((r, setting) => {
			const keyPairs = setting.split("=");
			return { ...r, [keyPairs[0]]: keyPairs[1] };
		}, []);

		return options.bypassDNA;
	});

	return filteredDNA.join(DNA_DELIMITER);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna) => {
	const query = /(\?.*$)/;
	return _dna.replace(query, "");
};

const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
	const _filteredDNA = filterDNAOptions(_dna);
	return !_DnaList.has(_filteredDNA);
};

const getNamedElement = (_layer, _name) => {
	let name = _name.split("#")[0];
	for (let i = 0; i < _layer.elements.length; i++) {
		let element = _layer.elements[i];
		if (element.name == name) {
			return element;
		}
	}

	return null;
};

const getNoneElement = (_layer) => {
	return getNamedElement(_layer, "_none");
};

const getLayer = (_layers, _layerName) => {
	let foundLayer = null;

	for (let i = 0; i < _layers.length; i++) {
		let layer = _layers[i];
		if(layer.name == _layerName) {
			foundLayer = layer;
		}
	}

	return foundLayer;
}

// This selects the layers that will be used
const createDna = (_layerConfiguration, _layers, _editionNum) => {
	let layerElements = [];
	let specialEditionCreated = false;

	for(let i=0; i<_layerConfiguration.specialEditions.length; i++) {
		let specialEd = _layerConfiguration.specialEditions[i];

		if(_editionNum == specialEd.id) {
			// Go over every layer and pick a specified element
			for (let i = 0; i < _layers.length; i++) {
				let layer = _layers[i];
				let element = getNoneElement(layer);

				if(specialEd.traits[layer.name]) {
					element = getNamedElement(layer, specialEd.traits[layer.name]);
				}

				layerElements.push({
					element: element,
					layer: layer,
					nonePickedTimes:0 // This is a hackey solution to avoid none being overrepresented
				});
			}

			specialEditionCreated = true;
			break;
		}
	}

	if(!specialEditionCreated) {
		// Go over every layer and pick a random element
		for (let i = 0; i < _layers.length; i++) {
			let layer = _layers[i];
			let element = help.pickElementFromWeightedLayer(layer);

			// if ignore is flagged pick the none element, every folder should have a transparent none element
			if (layer.ignore) {
				element = getNoneElement(layer);
			}

			layerElements.push({
				element: element,
				layer: layer,
				nonePickedTimes:0 // This is a hackey solution to avoid none being overrepresented
			});
		}

		// Go over conditions and see if we require repicking elements, there is a soft hierarchy so "tops" lead "bottoms" which lead "legs" and so on
		{
			let repickedSomething = true;
			while(repickedSomething) {
				repickedSomething = false;
				let conditions = _layerConfiguration.generationConditions;
				let repickLayers = {};
			
				// Figures out what to repick and how
				for(let i=0; i<layerElements.length;i++) {
					let layerElement = layerElements[i];

					for(let j=0; j<conditions.length;j++) {
						let condition = conditions[j];
						let matchingElement = false;

						// First we go over every selected element, and figure out if it creates requirements for other layers
						if(layerElement.layer.name == condition.layer) {
							// We want to match trait names, or trait tags
							if(condition.traits) {
								condition.traits.forEach(condTraitName => {
									// if condition trait is not a tag
									/* if(condTraitName.includes("_")) { */
									matchingElement = matchingElement || (condTraitName == layerElement.element.name);
									/* } */
									// otherwise it's a tag // TODO: Should be deprecated
									/* else {
										matchingElement = matchingElement || (layerElement.element.name.split("_").includes(condTraitName));
									} */
								});
							}
							// Also acknowledge .tags
							if(condition.tags) {
								matchingElement = matchingElement || help.nameIncludesTags(layerElement.element.name, condition.tags);
							}
						}

						// Second we record the new requirements for later
						if(matchingElement) {
							if(condition.forceTraits) {
								for(let m=0; m<condition.forceTraits.length;m++) {
									let forceTrait = condition.forceTraits[m];

									if(repickLayers[forceTrait.layer] && repickLayers[forceTrait.layer].important) {
										continue;
									}

									if(!repickLayers[forceTrait.layer]) {
										repickLayers[forceTrait.layer] = {
											traits: [],
											tags: [],
										}	
									}

									if(forceTrait.important) {
										repickLayers[forceTrait.layer].important = true;
										repickLayers[forceTrait.layer].tags = [];
										repickLayers[forceTrait.layer].traits = forceTrait.traits;
										continue;
									}

									repickLayers[forceTrait.layer].traits = repickLayers[forceTrait.layer].traits.concat(forceTrait.traits);

									// Add none if it has weight, and condition doesn't disallow it
									if(!repickLayers[forceTrait.layer].traits.includes("_none") && !forceTrait.excludeNone && getNoneElement(getLayer(_layers,forceTrait.layer)).weight > 0) {
										repickLayers[forceTrait.layer].traits.push("_none");
									}

									if(forceTrait.disableSameColor) {
										let colorTags = help.getTagsFromName(layerElement.layer.name, _layerConfiguration.colorTags);
										colorTags.forEach(colorTag => {
											repickLayers[forceTrait.layer].tags.push("-" + colorTag);
										});
									}
								}
							}

							if(condition.forceTags) {
								for(let m=0; m<condition.forceTags.length;m++) {
									let forceTag = condition.forceTags[m];

									if(repickLayers[forceTag.layer] && repickLayers[forceTag.layer].important) {
										continue;
									}

									if(!repickLayers[forceTag.layer]) {
										repickLayers[forceTag.layer] = {
											traits: [],
											tags: [],
										}	
									}

									repickLayers[forceTag.layer].tags = repickLayers[forceTag.layer].tags.concat(forceTag.tags);
									
									// Add none if it has weight, and condition doesn't disallow it
									if(!repickLayers[forceTag.layer].traits.includes("_none") && !forceTag.excludeNone && getNoneElement(getLayer(_layers,forceTag.layer)).weight > 0) {
										repickLayers[forceTag.layer].traits.push("_none");
									}

									if(forceTag.disableSameColor) {
										let colorTags = help.getTagsFromName(layerElement.element.name, _layerConfiguration.colorTags);
										colorTags.forEach(colorTag => {
											repickLayers[forceTag.layer].tags.push(["-" + colorTag]);
										});
									}
								}
							}
						}
					}
				}

				// makes sure that filtered traits/tags don't repeat, repeating traits would be likelier to get selected, not desired behavior
				let repickLayersKeys = Object.keys(repickLayers);
				for(let i=0; i<repickLayersKeys.length;i++) {
					let repickLayerKey = repickLayersKeys[i];

					repickLayers[repickLayerKey].traits = help.arrayUnique(repickLayers[repickLayerKey].traits);
					repickLayers[repickLayerKey].tags = help.arrayUnique(repickLayers[repickLayerKey].tags);
				}

				// Repick layers based on new requirements derived from conditions earlier
				for(let i=0; i<layerElements.length;i++) {
					let layerElement = layerElements[i];

					if(repickLayers[layerElement.layer.name]) {
						let repick = repickLayers[layerElement.layer.name];
						let fakeLayer = {name:layerElement.layer.name,elements:[]};
						let repickedItemAlreadyPicked = false;

						for(let j=0; j<layerElement.layer.elements.length;j++) {
							let element = layerElement.layer.elements[j];
							if(repick.traits.includes(element.name) ||
								help.nameIncludesTags(element.name, repick.tags)) {

								// Note if a possible item is already a picked one, no reason to repick
								if(element.name == layerElement.element.name) {
									if(element.name == "_none" && layerElement.nonePickedTimes < 1) {
										layerElement.nonePickedTimes++;
									}
									else {
										repickedItemAlreadyPicked = true;
									}
								}

								fakeLayer.elements.push({
									name:element.name, 
									weight: element.weight > 0 ? element.weight : averageTraitWeight
								});
							}
						}
						
						if(fakeLayer.elements.length == 0) {
							console.log("ISSUE FINDING ELEMENTS", JSON.stringify(repick, null, 2));
						}

						if(!repickedItemAlreadyPicked) {
							let newElementName = help.pickElementFromWeightedLayer(fakeLayer);
							let newElement = getNamedElement(layerElement.layer, newElementName.name);
							layerElement.element = newElement;
							repickedSomething = true;
						}
					}
				}
			}
		}
	}

	// Fits fitWith options
	{
		let matchedFitWith = true;
		while(matchedFitWith) {
			matchedFitWith = false;
			let postGenFitWith = [];
			// Correct fit with options, this should be done last
			for (let i = 0; i < layerElements.length; i++) {
				// if we have a fitWith option, remember it for later, fitWith is used for traits that use multiple layers
				if (layerElements[i].layer.fitWith) {
					postGenFitWith.push({
						name: layerElements[i].element.name,
						layerName: layerElements[i].layer.fitWith
					});
				}
			}

			// Go over every layer we need to fit with another
			for (let i = 0; i < postGenFitWith.length; i++) {
				let fitWith = postGenFitWith[i];
				let elementName = fitWith.name;
				let layerName = fitWith.layerName;

				// Go over every layerElement to find the one that needs refitting
				for (let j = 0; j < layerElements.length; j++) {
					if (layerName == layerElements[j].layer.name) {
						let newElement = getNamedElement(layerElements[j].layer, elementName) || getNoneElement(layerElements[j].layer);

						if(newElement.name != "_none" && elementName != layerElements[j].element.name) {
							matchedFitWith = true;
						}
						
						layerElements[j].element = newElement;
					}
				}
			}
		}
	}
	
	let randNumCompiled = [];
	layerElements.forEach(obj => {
		randNumCompiled.push(
			`${obj.element.id}:${obj.element.filename}${
			obj.layer.bypassDNA ? "?bypassDNA=true" : ""
			}`
		);
	});

	return {newDna:randNumCompiled.join(DNA_DELIMITER), layerElements:layerElements};
};

const writeMetaData = (_data) => {
	fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
	let metadata = metadataList.find((meta) => meta.edition == _editionCount);
	debugLogs
		? console.log(
			`Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
		)
		: null;
	fs.writeFileSync(
		`${buildDir}/json/${_editionCount}.json`,
		JSON.stringify(metadata, null, 2)
	);
};

// Shuffles an array
function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(help.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
	return array;
}

const startCreating = async () => {
	let layerConfigIndex = 0;
	let editionCount = 1;
	let failedCount = 0;
	let abstractedIndexes = [];
	for (
		let i = network == NETWORK.sol ? 0 : 1;
		i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
		i++
	) {
		abstractedIndexes.push(i);
	}
	if (shuffleLayerConfigurations) {
		abstractedIndexes = shuffle(abstractedIndexes);
	}
	debugLogs
		? console.log("Editions left to create: ", abstractedIndexes)
		: null;
	while (layerConfigIndex < layerConfigurations.length) {
		// This part generates the NFTs
		const layers = layersSetup(
			layerConfigurations[layerConfigIndex].layersOrder
		);
		
		layerConfigurations[layerConfigIndex].generationConditions.forEach(cond => {
			if(cond.trait) {
				cond.traits = cond.traits || [];
				cond.traits.push(cond.trait);
				delete cond.trait;
			}
			// turns blocked layer into forced none traits
			if(cond.blockLayers) {
				for(let i=0; i<cond.blockLayers.length; i++) {
					let blockLayer = cond.blockLayers[i];
					if(!cond.forceTraits) {
						cond.forceTraits = [];
					}
					cond.forceTraits.push({
						layer:blockLayer,
						traits:["_none"],
						important:true
					});
				}
			}

			if(cond.forceTraits) {
				cond.forceTraits.forEach(forceTrait => forceTrait.traits = forceTrait.traits.map(x => x.split("#")[0]));
			}
			
			if(cond.traits) {
				cond.traits = cond.traits.map(x => x.split("#")[0]);
			}
		});

		while (editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo) {
			let {newDna, layerElements} = createDna(layerConfigurations[layerConfigIndex], layers, abstractedIndexes[0]);
			if (isDnaUnique(dnaList, newDna)) {
				let results = constructLayerToDna(newDna, layers);
				let loadedElements = [];

				results.forEach((layer) => {
					loadedElements.push(loadLayerImg(layer));
				});

				await Promise.all(loadedElements).then((renderObjectArray) => {
					debugLogs ? console.log("Clearing canvas") : null;
					ctx.clearRect(0, 0, format.width, format.height);
					if (gif.export) {
						hashlipsGiffer = new HashlipsGiffer(
							canvas,
							ctx,
							`${buildDir}/gifs/${abstractedIndexes[0]}.gif`,
							gif.repeat,
							gif.quality,
							gif.delay
						);
						hashlipsGiffer.start();
					}
					if (background.useCustomBackground) {
						generateCustomBackground(layerConfigurations[layerConfigIndex], layerElements, ctx);
					}
					else if (background.generate) {
						drawBackground();
					}
					/* if(traitOutline) {
						This is stupid, doesn't significantly improve the collection, and would take forever, may not even work (surely there's a better way to do this)
						draw the nft without a background 
						save
						draw the background
						load the previous image, and draw it around with DestOut, this creates a hole
						draw the nft normally
						save
						draw a plain canvas colored with the previously used color scheme [0] color
						load the previous image and place it on top, now the empty hole is filled
						save

						renderObjectArray.forEach((renderObject, index) => {
							drawElementDestOut(
								renderObject,
								index,
								layerConfigurations[layerConfigIndex].layersOrder.length
							);
							if (gif.export) {
								hashlipsGiffer.add();
							}
						});
					} */
					/* else */ {
						// draws the traits normally
						renderObjectArray.forEach((renderObject, index) => {
							drawElement(
								renderObject,
								index,
								layerConfigurations[layerConfigIndex].layersOrder.length
							);
							if (gif.export) {
								hashlipsGiffer.add();
							}
						});
					}
					if (gif.export) {
						hashlipsGiffer.stop();
					}
					debugLogs
						? console.log("Editions left to create: ", abstractedIndexes)
						: null;
					saveImage(abstractedIndexes[0]);
					addMetadata(newDna, abstractedIndexes[0]);
					help.clearIgnoredTraits(layers, metadataList[metadataList.length - 1]);
					help.clearNoneTraits(metadataList[metadataList.length - 1]);
					help.clearUnlistedTraits(layers, metadataList[metadataList.length - 1]);
					help.makeTraitsReadable(metadataList[metadataList.length - 1]);
					passiveTraits ? generatePassiveTraits(metadataList[metadataList.length - 1]) : null;
					// saves the last metadata piece to a file
					saveMetaDataSingleFile(abstractedIndexes[0]);
					console.log(
						`Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
							newDna
						)}`
					);
				});
				dnaList.add(filterDNAOptions(newDna));
				editionCount++;
				abstractedIndexes.shift();
			} else {
				console.log("DNA exists!");
				failedCount++;
				if (failedCount >= uniqueDnaTorrance) {
					console.log(
						`You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`
					);
					process.exit();
				}
			}
		}
		layerConfigIndex++;
	}
	writeMetaData(JSON.stringify(metadataList, null, 2));
};

module.exports = { startCreating, buildSetup, getElements };
