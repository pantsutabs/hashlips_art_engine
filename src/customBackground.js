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

const addText = (_ctx,_sig, x, y, size) => {
	_ctx.fillStyle = text.color;
	_ctx.font = `${text.weight} ${size}pt ${text.family}`;
	_ctx.textBaseline = text.baseline;
	_ctx.textAlign = text.align;
	_ctx.fillText(_sig, x, y);
};

const genColorAdv = (_hue, _sat, _brightness) => {
	let pastel = `hsl(${Math.round(_hue)}, ${Math.round(_sat)}%, ${Math.round(_brightness)}%)`;
	return pastel;
};

const getColorToH = (_colorArr) => {
	let hval = Math.round(_colorArr[0] + Math.random()*(_colorArr[1] - _colorArr[0]));

	if(hval < 0) {
		hval += 360;
	}

	return hval;
};

let darkColors = ["BLACK","OLIVE","PURPLE","BLUE"];
let neutralColors = ["RED","GRAY","DENIM","GREEN","CYAN",  "ORANGE","TURQ"];
let brightColors = ["WHITE","PINK","YELLOW",  "LIME"];

let colorToH = {
	"BLACK": null,
	"GRAY": null,
	"WHITE": null,
	"PURPLE": [290,310],
	"RED": [-10,10],
	"OLIVE": [85,100],
	"GREEN": [120,140],
	"BLUE": [230,250],
	"DENIM": [205,215],
	"CYAN": [195,205],
	"PINK": [325,335],
	"YELLOW": [50,60],

	"ORANGE": [15,35],
	"LIME": [70,85],
	"TURQ":[150,165]
};

let colorOpposites = {
	"PURPLE": ["YELLOW","ORANGE","LIME","GREEN"],
	"RED": ["GREEN","LIME","OLIVE","TURQ"],
	"OLIVE": ["PURPLE","RED"],
	"GREEN": ["PURPLE","RED","ORANGE"],
	"BLUE": ["ORANGE","RED"],
	"DENIM": ["ORANGE","YELLOW","PINK"],
	"CYAN": ["ORANGE","YELLOW","PINK"],
	"PINK": ["YELLOW","GREEN","LIME","TURQ"],
	"YELLOW": ["DENIM","CYAN","PURPLE","PINK"],
	
	"ORANGE": ["BLUE","DENIM","CYAN","PURPLE","GREEN"],
	"LIME": ["RED","PURPLE","PINK"],
	"TURQ":["RED","PINK"]
};

/* let colorComp = {
	"PURPLE": ["PINK","BLUE"],
	"RED": ["ORANGE","YELLOW"],
	"OLIVE": ["GREEN","YELLOW"],
	"GREEN": ["OLIVE","TURQ"],
	"BLUE": ["CYAN","PURPLE"],
	"DENIM": ["PURPLE","TURQ"],
	"CYAN": ["BLUE","TURQ"],
	"PINK": ["RED","PURPLE"],
	"YELLOW": ["ORANGE","LIME"],
	
	"ORANGE": ["YELLOW","RED"],
	"LIME": ["YELLOW","OLIVE"],
	"TURQ":["DENIM","GREEN"]
}; */

// deprecated
const generateColorScheme = (taggedColors, _darkness) => {
	let scheme = [];
	let saturations = [];
	let darkness = _darkness == 0 ? (Math.floor(Math.random()*4) - 2) : _darkness;
	let nonColorUsed = false;

	// Generate base color
	{
		let colorTag = null;
		let goodColors = [];
		
		taggedColors.forEach(taggedColor => {
			if(colorOpposites[taggedColor]) {
				goodColors = goodColors.concat(colorOpposites[taggedColor]);
			}
		});

		if(goodColors.length==0) {
			colorTag = Object.keys(colorToH)[Math.floor(Math.random()*Object.keys(colorToH).length)];
		}
		else {
			colorTag = goodColors[Math.floor(Math.random()*goodColors.length)];
		}

		if(!colorToH[colorTag]) {
			colorTag = Object.keys(colorOpposites)[Math.floor(Math.random()*Object.keys(colorOpposites).length)];
		}

		saturations.push(70 + Math.random()*20);

		let color = genColorAdv(
			getColorToH(colorToH[colorTag]), 
			saturations[saturations.length-1], 
			55 + Math.min(35,Math.max(0,(15 + darkness*5 - 5 + Math.random()*10)))
			);

		scheme.push({tag:colorTag,color:color});
	}
	
	// Generate secondary color
	{
		let colorTag = null;
		let goodColors = [];
		
		if(colorComp[scheme[0].tag]) {
			goodColors = goodColors.concat(colorComp[scheme[0].tag]);
		}

		if(goodColors.length==0) {
			colorTag = Object.keys(colorToH)[Math.floor(Math.random()*Object.keys(colorToH).length)];
		}
		else {
			colorTag = goodColors[Math.floor(Math.random()*goodColors.length)];
		}

		let color = null;

		saturations.push(saturations[saturations.length-1] < 70 ? 70 + Math.random()*10 : 60 + Math.random()*20);

		if(!nonColorUsed && Math.random()<0.1) {
			color = genColorAdv(
				0, 
				0, 
				90 + Math.random()*5
				);
			nonColorUsed = true;
		}
		else {
			color = genColorAdv(
				getColorToH(colorToH[colorTag]), 
				saturations[saturations.length-1], 
				65 + Math.min(25,Math.max(0,(15 + darkness*5 - 5 + Math.random()*10)))
				);
		}


		scheme.push({tag:colorTag,color:color});
	}

	// Generate third color
	{
		let colorTag = null;
		let goodColors = [];

		for(let i=0, keys=Object.keys(colorOpposites); i<keys.length; i++) {
			let colorW = colorOpposites[keys[i]];

			if(colorW && colorW.includes(scheme[0].tag)/*  && colorW.includes(scheme[1].tag) */) {
				goodColors.push(keys[i]);
			}
		}

		if(goodColors.length==0) {
			colorTag = Object.keys(colorToH)[Math.floor(Math.random()*Object.keys(colorToH).length)];
		}
		else {
			colorTag = goodColors[Math.floor(Math.random()*goodColors.length)];
		}

		let color = null;

		if(!nonColorUsed && Math.random()<0.1) {
			color = genColorAdv(
				0, 
				0, 
				90 + Math.random()*5
				);
			nonColorUsed = true;
		}
		else {
			color = genColorAdv(
				getColorToH(colorToH[colorTag]), 
				/* brightColors.includes(colorTag) ? 80 + Math.random()*10 : */ 60 + Math.random()*20, 
				//brightColors.includes(colorTag) ? 60 + Math.min(30,Math.max(0,(15 + darkness*5 - 5 + Math.random()*10))) : // bright colors can't be too dark
				60 + Math.min(30,Math.max(0,(15 + darkness*5 - 5 + Math.random()*10)))
				);
		}

		scheme.push({tag:colorTag,color:color});
	}

	if(Math.random()>0.5) {
		scheme = [scheme[1],scheme[0],scheme[2]];
	}

	let schemeColors = [];

	scheme.forEach(color => {
		schemeColors.push(color.color);
	});

	return schemeColors;
};

const generateColorScheme2 = (taggedColors, _darkness) => {
	let scheme = [];
	let hues = [];
	let saturations = [];
	let lightings = [];
	let darkness = _darkness == 0 ? (Math.floor(Math.random()*4) - 2) : _darkness;
	let nonColorUsed = false;

	// Generate base color
	{
		let colorTag = null;
		let goodColors = [];
		
		taggedColors.forEach(taggedColor => {
			if(colorOpposites[taggedColor]) {
				goodColors = goodColors.concat(colorOpposites[taggedColor]);
			}
		});

		if(goodColors.length==0) {
			colorTag = Object.keys(colorToH)[Math.floor(Math.random()*Object.keys(colorToH).length)];
		}
		else {
			colorTag = goodColors[Math.floor(Math.random()*goodColors.length)];
		}

		if(!colorToH[colorTag]) {
			colorTag = Object.keys(colorOpposites)[Math.floor(Math.random()*Object.keys(colorOpposites).length)];
		}

		hues.push(getColorToH(colorToH[colorTag]));
		saturations.push(75 + Math.random()*15);
		lightings.push(75 + Math.min(15,Math.max(0,(8 + darkness*3 - 3 + Math.random()*6))));

		/* if(hues[hues.length-1] > colorToH["ORANGE"][0] && hues[hues.length-1] < colorToH["ORANGE"][1]) {
			saturations[saturations.length-1] = 80 + Math.random()*10;
			lightings[lightings.length-1] = 80 + Math.random()*10;
		} */

		let color = genColorAdv(
			hues[hues.length-1], 
			saturations[saturations.length-1], 
			lightings[lightings.length-1]
			);

		scheme.push({tag:colorTag,color:color});
	}
	
	// Generate secondary color
	{
		if(!nonColorUsed && Math.random()<0.2) {
			color = genColorAdv(
				0, 
				0, 
				93 + Math.random()*3
				);
			nonColorUsed = true;
		}
		else {
			let colorH = hues[hues.length-1] + (Math.random() > 0.5 ? +(30 + Math.random()*30): -(30 + Math.random()*30));
			colorH = colorH > 360 ? colorH - 360 : colorH<0 ? colorH+360:colorH;
			hues.push(colorH);
			saturations.push(80 + Math.random()*10);
			lightings.push(60 + Math.min(15,Math.max(0,(8 + darkness*3 - 3 + Math.random()*6))));

			/* if(saturations[saturations.length-2] >= 80 && saturations[saturations.length-1] >= 80) {
				saturations[saturations.length-1] = 70 + Math.random()*8;
			} */
			
			/* if(lightings[lightings.length-2] > 80) {
				lightings[lightings.length-1] = 70 + (Math.min(25,Math.max(0,(15 + darkness*5 - 5 + Math.random()*10))))/2;
			} */

			/* if(hues[hues.length-1] > colorToH["ORANGE"][0] && hues[hues.length-1] < colorToH["ORANGE"][1]) {
				saturations[saturations.length-1] = 80 + Math.random()*10;
				lightings[lightings.length-1] = 80 + Math.random()*10;
			} */

			color = genColorAdv(
				Math.floor(colorH), 
				saturations[saturations.length-1], 
				lightings[lightings.length-1]
				);
		}

		scheme.push({tag:null,color:color});
	}

	// Generate third color
	{
		let colorTag = null;
		let goodColors = [];

		for(let i=0, keys=Object.keys(colorOpposites); i<keys.length; i++) {
			let colorW = colorOpposites[keys[i]];

			if(colorW && colorW.includes(scheme[0].tag)/*  && colorW.includes(scheme[1].tag) */) {
				goodColors.push(keys[i]);
			}
		}

		if(goodColors.length==0) {
			colorTag = Object.keys(colorToH)[Math.floor(Math.random()*Object.keys(colorToH).length)];
		}
		else {
			colorTag = goodColors[Math.floor(Math.random()*goodColors.length)];
		}

		let color = null;

		if(!nonColorUsed && Math.random()<0.1) {
			color = genColorAdv(
				0, 
				0, 
				93 + Math.random()*3
				);
			nonColorUsed = true;
		}
		else {
			hues.push(getColorToH(colorToH[colorTag]));
			saturations.push(70 + Math.random()*20);
			lightings.push(70 + (Math.min(25,Math.max(0,(15 + darkness*5 - 5 + Math.random()*10))))/2);

			if(hues[hues.length-1] > colorToH["ORANGE"][0] && hues[hues.length-1] < colorToH["ORANGE"][1]) {
				saturations[saturations.length-1] = 80 + Math.random()*10;
				lightings[lightings.length-1] = 80 + Math.random()*10;
			}

			color = genColorAdv(
				hues[hues.length-1], 
				saturations[saturations.length-1], 
				lightings[lightings.length-1]
				);
		}

		scheme.push({tag:colorTag,color:color});
	}

	if(Math.random()>0.5) {
		scheme = [scheme[1],scheme[0],scheme[2]];
	}

	let schemeColors = [];

	scheme.forEach(color => {
		schemeColors.push(color.color);
	});

	return schemeColors;
};

const generateColorScheme3 = (taggedColors, _darkness) => {
	let scheme = [];
	let hues = [];
	let saturations = [];
	let lightings = [];
	let darkness = _darkness == 0 ? (Math.floor(Math.random()*4) - 2) : _darkness;
	let nonColorUsed = false;



	let schemeColors = [];

	scheme.forEach(color => {
		schemeColors.push(color.color);
	});

	return schemeColors;
};

const generateColorMatchingData = (layerElements) => {
	let taggedColors = [];
	let darkness = 0;

	for(let i=0; i<layerElements.length; i++) {
		let layerElement = layerElements[i];
		if(layerElement.layer.name == "Body" && layerElement.element.name == "Body_3_Cacao" ) {
			darkness ++;
		}
		else if(layerElement.layer.name == "Body" && layerElement.element.name == "Body_1_Cream" ) {
			darkness --;
		}
		else if(layerElement.layer.name == "Top") {
			let tags = layerElement.element.name.split("_");
			
			tags.forEach(tag => {
				if(darkColors.includes(tag)) {
					darkness++;
					taggedColors.push(tag);
				}
				if(neutralColors.includes(tag)) {
					taggedColors.push(tag);
				}
				if(brightColors.includes(tag)) {
					darkness--;
					taggedColors.push(tag);
				}
			});
		}
		else if(layerElement.layer.name == "Bottom") {
			let tags = layerElement.element.name.split("_");
			
			tags.forEach(tag => {
				if(darkColors.includes(tag)) {
					darkness++;
					taggedColors.push(tag);
				}
				if(neutralColors.includes(tag)) {
					taggedColors.push(tag);
				}
				if(brightColors.includes(tag)) {
					darkness--;
					taggedColors.push(tag);
				}
			});
		}
		else if(layerElement.layer.name == "Hair") {
			let tags = layerElement.element.name.split("_");
			
			tags.forEach(tag => {
				if(darkColors.includes(tag)) {
					darkness++;
					taggedColors.push(tag);
				}
				if(neutralColors.includes(tag)) {
					taggedColors.push(tag);
				}
				if(brightColors.includes(tag)) {
					darkness--;
					taggedColors.push(tag);
				}
			});
		}
	}

	return {darkness, taggedColors};
};

const colorMatchingExp = (layerConfiguration, layerElements, ctx) => {
	let {darkness, taggedColors} = generateColorMatchingData(layerElements);
	let scheme = generateColorScheme(taggedColors,darkness);
	
    ctx.fillStyle = scheme[0];
	ctx.fillRect(0, 0, format.width, format.height);
	
    ctx.fillStyle = scheme[1];
	ctx.fillRect(0, 0, format.width, format.height*1);
	
    ctx.fillStyle = scheme[2];
	ctx.fillRect(0, 0, format.width, format.height*0.65);
	
    ctx.fillStyle = scheme[0];
	ctx.fillRect(0, 0, format.width, format.height*0.55);

	addText(ctx, darkness + " , " + JSON.stringify(taggedColors),100,100,100);
	addText(ctx, JSON.stringify(scheme),100,250,32);
};

const genBackgroundSimple = (layerConfiguration, layerElements, ctx) => {
	let baseUnit = format.width/16;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0, y: -topDiff/2};
	let end = {x:start.x + baseUnit*(16), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit};

    ctx.fillStyle = genColor();
	ctx.fillRect(0, 0, format.width, format.height);

	for(let i=start.x;i<end.x; i+=baseUnit) {
		let x = i;
		for(let j=start.y;j<end.y; j+=baseUnit) {
			let y = j;

			ctx.fillStyle = genColor();
			ctx.fillRect(x, y, baseUnit+1,baseUnit+1);
		}
	}

    ctx.fillStyle = genColor();
	ctx.fillRect(baseUnit, start.y + baseUnit*1, baseUnit*14, Math.floor(format.height/baseUnit)*baseUnit - baseUnit*1);
	
    /* ctx.fillStyle = genColor();
	ctx.fillRect(baseUnit + baseUnit*0.22, start.y + baseUnit*1 + baseUnit*0.22, baseUnit*14 - baseUnit*0.44, Math.floor(format.height/baseUnit)*baseUnit - baseUnit*1 - baseUnit*0.44); */
}

const genBackground1 = (ctx, scheme) => {
	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};

	let incrementByStart = baseUnit*(6 + Math.floor(Math.random()*4));
	let incrementBy = incrementByStart;
	for(let j=start.y;j<end.y; j+=incrementBy) {
		let y = j;
		let x = start.x;
		incrementBy = Math.max(incrementBy*0.9, incrementByStart*0.25);

		let v2arr = [];

		v2arr.push({x: x,   y: y});
		v2arr.push({x: end.x,   y: y + baseUnit*4});
		v2arr.push({x: end.x,   y: y + baseUnit*4 + incrementBy*0.5});
		v2arr.push({x: x,   y: y + incrementBy*0.5});

		drawShape(ctx, v2arr, scheme[1]);

		v2arr = [];
		let thirdShapeSize = incrementBy/6;
		
		v2arr.push({x: x,   y: y + incrementBy*0.5 - thirdShapeSize/2});
		v2arr.push({x: end.x,   y: y + baseUnit*4 + incrementBy*0.5 - thirdShapeSize/2});
		v2arr.push({x: end.x,   y: y + baseUnit*4 + incrementBy*0.5 + thirdShapeSize/2});
		v2arr.push({x: x,   y: y + incrementBy*0.5 + thirdShapeSize/2});

		drawShape(ctx, v2arr, scheme[2]);
	}
}

const genBackground2 = (ctx, scheme) => {
	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};

	let incrementByStart = baseUnit*(6 + Math.floor(Math.random()*5));
	let incrementBy = incrementByStart;
	let w = (end.x-start.x)/(1);
	for(let j=start.y;j<end.y; j+=incrementBy) {
		let y = j;
		let x = start.x;
		incrementBy = Math.max(incrementBy*0.85, incrementByStart*0.25);

		let v2arr = [];

		v2arr.push({x: x,   y: y});
		let iend = 0;
		let angleHeight = (w/4);
		for(let i=0; (start.x+i*w)<end.x-1; i++) {
			v2arr.push({x:x + w*i + w/2, y:y + angleHeight});
			v2arr.push({x:x + w*i + w, y:y});
			iend = i+1;
		}
		
		v2arr.push({x:x + w*iend, y:y + incrementBy*0.5});
		for(let i=iend; (start.x+i*w)>start.x+1; i--) {
			v2arr.push({x:x + w*i - w/2, y:y + angleHeight  + incrementBy*0.5});
			v2arr.push({x:x + w*i - w, y:y  + incrementBy*0.5});
		}

		drawShape(ctx, v2arr, scheme[1]);

		// Third color
		v2arr = [];
		let thirdShapeSize = incrementBy/6;
		
		v2arr.push({x: x,   y: y + incrementBy*0.5 - thirdShapeSize/2});
		for(let i=0; (start.x+i*w)<end.x-1; i++) {
			v2arr.push({x:x + w*i + w/2, y:y + angleHeight  + incrementBy*0.5 - thirdShapeSize/2});
			v2arr.push({x:x + w*i + w, y:y  + incrementBy*0.5 - thirdShapeSize/2});
			iend = i+1;
		}
		
		v2arr.push({x:x + w*iend, y:y + incrementBy*0.5 + thirdShapeSize/2});
		for(let i=iend; (start.x+i*w)>start.x+1; i--) {
			v2arr.push({x:x + w*i - w/2, y:y + angleHeight + incrementBy*0.5 + thirdShapeSize/2});
			v2arr.push({x:x + w*i - w, y:y  + incrementBy*0.5 + thirdShapeSize/2});
		}

		drawShape(ctx, v2arr, scheme[2]);
	}
}

const genBackground3 = (ctx, scheme) => {

	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};

	let incrementByStart = baseUnit*(6 + Math.floor(Math.random()*5));
	let incrementBy = incrementByStart;
	let w = (end.x-start.x)/(2 + Math.floor(Math.random()*6));
	for(let j=start.y;j<end.y; j+=incrementBy) {
		let y = j;
		let x = start.x;
		incrementBy = Math.max(incrementBy*0.85, incrementByStart*0.25);

		let v2arr = [];

		v2arr.push({x: x,   y: y});
		let iend = 0;
		let angleHeight = (w/4);
		for(let i=0; (start.x+i*w)<end.x-1; i++) {
			v2arr.push({x:x + w*i + w/2, y:y + angleHeight});
			v2arr.push({x:x + w*i + w, y:y});
			iend = i+1;
		}
		
		v2arr.push({x:x + w*iend, y:y + incrementBy*0.5});
		for(let i=iend; (start.x+i*w)>start.x+1; i--) {
			v2arr.push({x:x + w*i - w/2, y:y + angleHeight  + incrementBy*0.5});
			v2arr.push({x:x + w*i - w, y:y  + incrementBy*0.5});
		}

		drawShape(ctx, v2arr, scheme[1]);

		// Third color
		v2arr = [];
		let thirdShapeSize = incrementBy/6;
		
		v2arr.push({x: x,   y: y + incrementBy*0.5 - thirdShapeSize/2});
		for(let i=0; (start.x+i*w)<end.x-1; i++) {
			v2arr.push({x:x + w*i + w/2, y:y + angleHeight  + incrementBy*0.5 - thirdShapeSize/2});
			v2arr.push({x:x + w*i + w, y:y  + incrementBy*0.5 - thirdShapeSize/2});
			iend = i+1;
		}
		
		v2arr.push({x:x + w*iend, y:y + incrementBy*0.5 + thirdShapeSize/2});
		for(let i=iend; (start.x+i*w)>start.x+1; i--) {
			v2arr.push({x:x + w*i - w/2, y:y + angleHeight + incrementBy*0.5 + thirdShapeSize/2});
			v2arr.push({x:x + w*i - w, y:y  + incrementBy*0.5 + thirdShapeSize/2});
		}

		drawShape(ctx, v2arr, scheme[2]);
	}
}

const genBackground4 = (ctx, scheme) => {
	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};

	let w2 = (end.x-start.x)/(Math.random() > 0.5 ? 11 : Math.random() > 0.5 ? 12 : 13);//(12); // 11/12/13 are ok
	let incrementByStart = w2*2;
	let incrementBy = incrementByStart;

	for(let j=start.y, jc=0;j<end.y; j+=incrementBy, jc++) {
		incrementBy = Math.max(incrementByStart/2, incrementBy*0.9);
		let w = incrementBy;
		let w3 = incrementByStart;
		let y = j;
		for(let i=start.x + (jc%2==0 ? 0 : w/2);i<end.x; i+=w) {
			if(Math.random() > 0.5 && Math.random() > (5-jc)/5) {
				continue;
			}

			let x = i;

			let v2arr = [];

			let d1 = 16, d2=8;
			v2arr.push({x:x + w3/d1, y:y + w3/d1});
			v2arr.push({x:x + w3/d1 + (w-w3/d2), y:y + w3/d1});
			v2arr.push({x:x + w3/d1 + (w-w3/d2), y:y + w3/d1 + (incrementBy-w3/d2)});
			v2arr.push({x:x + w3/d1, y:y + w3/d1 + (incrementBy-w3/d2)});

			
			let color = Math.random() > 0.5 && Math.random() > (5-jc)/5 || true ? scheme[1] : scheme[2];

			drawShape(ctx, v2arr, color);
		}
	}
	
	if(true) {
		incrementBy = incrementByStart;
		for(let j=start.y, jc=0;j<end.y; j+=incrementBy, jc++) {
			incrementBy = Math.max(incrementByStart/2, incrementBy*0.9);
			let w = incrementBy;
			let w3 = incrementByStart;
			let y = j;
			for(let i=start.x + (jc%2==0 ? 0 : w/2);i<end.x; i+=w) {
				let x = i;
				let v2arr = [];
				let d1 = 16, d2=8,da3 = w3/8;
				let color;
				
				if(Math.random() > 0.75 && Math.random() > (5-jc)/5) {
					v2arr = [];
					v2arr.push({x:x + w3/d1 + da3, y:y + w3/d1 + da3});
					v2arr.push({x:x + w3/d1 + (w-w3/d2) + da3, y:y + w3/d1 + da3});
					v2arr.push({x:x + w3/d1 + (w-w3/d2) + da3, y:y + w3/d1 + (incrementBy-w3/d2) + da3});
					v2arr.push({x:x + w3/d1 + da3, y:y + w3/d1 + (incrementBy-w3/d2) + da3});
					color = scheme[2];
					drawShape(ctx, v2arr, color);
				}
			}
		}
	}
	
}

const genBackground5 = (ctx, scheme) => {
	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};

	let w = baseUnit*3

	for(let j=start.y, jc=0;j<end.y; j+=w, jc++) {
		let y = j;
		for(let i=start.x + (jc%2==0?w:0);i<end.x; i+=w*2) {
			let x = i;

			{
				let v2arr = [];

				v2arr.push({x:x+w/2, y:y    +w/4});
				v2arr.push({x:x+w, y:y+w/2    +w/4});
				v2arr.push({x:x+w/2, y:y+w    +w/4});
				v2arr.push({x:x, y:y+w/2    +w/4});

				let color = scheme[2];

				drawShape(ctx, v2arr, color);
			}

			{
				let v2arr = [];

				v2arr.push({x:x+w/2, y:y});
				v2arr.push({x:x+w, y:y+w/2});
				v2arr.push({x:x+w/2, y:y+w});
				v2arr.push({x:x, y:y+w/2});

				let color = scheme[1];

				drawShape(ctx, v2arr, color);
			}
		}
	}
}

const genBackground6 = (ctx, scheme) => {
	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};

	let w = baseUnit*3

	let changeMul = 0.15;
	let centerx = start.x + (end.x - start.x)/2;
	let centery = start.y + (end.y - start.y)/2;
	for(let istart=start.x  -baseUnit*12, jstart=start.y  -baseUnit*12, iend=end.x  +baseUnit*12,jend=end.y  +baseUnit*12, jc=0; istart < (start.x + (end.x-start.x)*0.4);jc++) {
		let diffx = iend - istart;
		let diffy = jend - jstart;
		let x =istart;
		let y=jstart;

		/* {
			let v2arr = [];

			v2arr.push({x:start.x, y:start.y});
			v2arr.push({x:end.x, y:start.y});
			v2arr.push({x:end.x, y:end.y});
			v2arr.push({x:start.x, y:end.y});

			drawShape(ctx, v2arr, 'rgba(0,0,0,0.01)');
		} */

		{
			let v2arr = [];

			v2arr.push({x:x+diffx/2, y:y});
			v2arr.push({x:x+diffx, y:y+diffy/2});
			v2arr.push({x:x+diffx/2, y:y+diffy});
			v2arr.push({x:x, y:y+diffy/2});

			let color = jc%6==0 ? scheme[2] : jc%4==0 ? scheme[1] : jc%2==0 ? scheme[0] : Math.random()>0.5 ? scheme[0] : Math.random()>0.5 ? scheme[1] : scheme[2];

			drawShape(ctx, v2arr, color);
		}
		
		istart += (centerx-istart)*changeMul;
		jstart += (centery-jstart)*changeMul;
		iend += (centerx-iend)*changeMul;
		jend += (centery-jend)*changeMul;
	}
}

const getDist = (v1, v2) => {
	var a = v1.x - v2.x;
	var b = v1.y - v2.y;
	var c = Math.sqrt(a * a + b * b);
	return c;
};

const drawShape = (ctx, _v2arr, color) => {
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = 1;
	ctx.beginPath();

	let v2arr = [].concat(_v2arr);
	v2arr.push(v2arr[0]);

	ctx.moveTo(v2arr[0].x, v2arr[0].y);
	for(let i=1; i<v2arr.length; i++) {
		ctx.lineTo(v2arr[i].x, v2arr[i].y);
	}

	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	// mimic brushes
	{
		let brushSize = 24/2;
		
		for(let i=0; i<v2arr.length-1; i++) {
			let xo = v2arr[i].x, yo = v2arr[i].y;
			let xc = v2arr[i].x, yc = v2arr[i].y;
			let xt = v2arr[i+1].x, yt = v2arr[i+1].y;

			let dist = getDist(v2arr[i],v2arr[i+1]);
			let moveTimes = dist/brushSize;

			//ctx.fillStyle = 'red';
			for(let j=0; j<moveTimes;j++) {
				if(j>0) {
					xc += (xt-xo)/moveTimes;
					yc += (yt-yo)/moveTimes;
				}

				ctx.beginPath();
				ctx.filter = `blur(${0.5 + (Math.floor(Math.random()*5))/10}px)`;
				ctx.arc(xc - brushSize*0.1 + Math.random()*brushSize*0.2, yc - brushSize*0.1 + Math.random()*brushSize*0.2, brushSize*0.8 + Math.random()*brushSize*0.4, 0, 2 * Math.PI);
				ctx.fill();
				ctx.stroke();
				ctx.filter = "none";
				ctx.closePath();
			}
		}
		
	}
}

const generateCustomBackground = (layerConfiguration, layerElements, ctx) => {
	//colorMatchingExp(layerConfiguration, layerElements, ctx);

	let {darkness, taggedColors} = generateColorMatchingData(layerElements);
	let scheme = generateColorScheme2(taggedColors,darkness);
	
    ctx.fillStyle = scheme[0];
	ctx.fillRect(0, 0, format.width, format.height);

	let bgs = [
		genBackground1,
		genBackground2,
		genBackground3,
		genBackground4,
		genBackground5,
		genBackground6,
	];

	bgs[Math.floor(Math.random()*bgs.length)](ctx, scheme);

	//genBackground6(ctx,scheme);
	
	addText(ctx, JSON.stringify(scheme),100,250,32);
	ctx.filter = "none";
  };

module.exports = {
	generateCustomBackground,
};