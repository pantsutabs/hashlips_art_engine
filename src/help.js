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
    }
}