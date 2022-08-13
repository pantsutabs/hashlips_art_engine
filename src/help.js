const basePath = process.cwd();
const {
	rngSeed,
} = require(`${basePath}/src/config.js`);


function prng (b) { 
    for (var a = 0, c = b.length; c--;) {
        a += b.charCodeAt(c), a += a << 10, a ^= a >> 6; 
    }
    a += a << 3; a ^= a >> 11; 
    return ((a + (a << 15) & 4294967295) >>> 0);//.toString(16);
}

function prngWrapper (b) {
    let prngj = prng(prng(b).toString(16)) + '';
    let reversePrng = '';

    for(let i = prngj.length; i--;) {
        reversePrng = reversePrng + prngj.charAt(i);
    }

    return parseFloat('0.' + reversePrng);
}

function newPrngStream (seed) {
    let rngIteration = 0;

    return {
        random: function () {
            if(seed) {
                rngIteration++;
                return prngWrapper(seed + rngIteration);
            }
            else {
                return Math.random();
            }
        }
    }
}

let random = newPrngStream(rngSeed).random;

module.exports = {
    newPrngStream: newPrngStream,
    random: random,
    getTagsFromName: function(name, tags) {
        let nameArr = name.split("_");
        let foundTags = [];
        nameArr.forEach(tag=> {
            if(tags.includes(tag)) {
                foundTags.push(tag);
            }
        });
        return foundTags;
    },
    nameIncludesTags: function (name, conditionTags) {
        let tags = name.split("_");
        let passes = true;

        if(conditionTags.length == 0) {
            return false;
        }

        for(let i=0; i<conditionTags.length;i++) {
            let condOrTags = conditionTags[i];
            let atleastOnePasses = false;
            let hardFail = false;

            if(!condOrTags) {
                console.log(name, JSON.stringify(conditionTags));
            }

            if(condOrTags.length == 0) {
                passes = false;
            }

            for(let j=0; j<condOrTags.length;j++) {
                let condnOrTag = condOrTags[j];

                if(condnOrTag.charAt(0) == "-") {
                    if(tags.includes(condnOrTag.substring(1))) {
                        hardFail = true;
                    }
                    else {
                        atleastOnePasses = true;
                    }
                }
                else if(tags.includes(condnOrTag)) {
                    atleastOnePasses = true;
                }
            }

            if(!atleastOnePasses || hardFail) {
                passes = false;
            }

            if(!passes) {
                break;
            }
        }

        return passes;
    },
    arrayUnique: function (arr) {
        return arr.filter((v, i, a) => a.indexOf(v) === i);
    },
    pickElementFromWeightedLayer: function (layer) {
        let totalWeight = 0;
        layer.elements.forEach((element) => {
            totalWeight += element.weight;
        });

        /* if(layer.name=="Legs") {
            console.log(" - picking from:", layer.name, "elements:", layer.elements.reduce((previousValue, currentValue) => (previousValue.name ? previousValue.name : previousValue) + "," + currentValue.name))
        } */
        
        // number between 0 - totalWeight
        let rand = Math.floor(random() * totalWeight);
        for (var i = 0; i < layer.elements.length; i++) {
            // subtract the current weight from the random weight until we reach a sub zero value.
            rand -= layer.elements[i].weight;
            if (rand < 0) {
                return layer.elements[i];
            }
        }
    },
    //clears traits that have an ignore flag
    clearIgnoredTraits: function(_layers, _metadata) {
        let attributes = _metadata.attributes;
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];

            for (let j = 0; j < _layers.length; j++) {
                let layer = _layers[j];
                if (layer.ignore && layer.name == attribute.trait_type) {
                    attributes.splice(i--, 1);
                }
            }
        }
    },
    //clears traits that have their value set to "_none"
    clearNoneTraits: function(_metadata) {
        let attributes = _metadata.attributes;
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];

            if(attribute.value == "_none") {
                attributes.splice(i--, 1);
            }
        }
    },
    //turns something like "Body_4_Light" into "Light", just cuts everything prior to the last _, or changes nothing if there is no _
    makeTraitsReadable: function(_metadata) {
        let attributes = _metadata.attributes;
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];
            let splitValue = attribute.value.split("_");
            attribute.value = splitValue[splitValue.length-1];
        }
    },
    //clears traits that are unlisted, like body(skin color), or other hidden ones
    clearUnlistedTraits: function(_layers, _metadata) {
        let attributes = _metadata.attributes;
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];

            for (let j = 0; j < _layers.length; j++) {
                let layer = _layers[j];
                if (layer.unlisted && layer.name == attribute.trait_type) {
                    attributes.splice(i--, 1);
                }
            }
        }
    },
}