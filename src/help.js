module.exports = {
    pickElementFromWeightedLayer: function (layer) {
        let totalWeight = 0;
        layer.elements.forEach((element) => {
            totalWeight += element.weight;
        });
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