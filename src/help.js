module.exports = {
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
        let random = Math.floor(Math.random() * totalWeight);
        for (var i = 0; i < layer.elements.length; i++) {
            // subtract the current weight from the random weight until we reach a sub zero value.
            random -= layer.elements[i].weight;
            if (random < 0) {
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