const basePath = process.cwd();
const help = require(`${basePath}/src/help.js`);
const {
	format,
	baseUri,
	description,
	background,
	uniqueDnaTorrance,
	rngSeed,
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

let getRandom = null;

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
	let hval = Math.round(_colorArr[0] + getRandom()*(_colorArr[1] - _colorArr[0]));

	if(hval < 0) {
		hval += 360;
	}

	return hval;
};


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
				ctx.filter = `blur(${0.5 + (Math.floor(getRandom()*5))/10}px)`;
				ctx.arc(xc - brushSize*0.1 + getRandom()*brushSize*0.2, yc - brushSize*0.1 + getRandom()*brushSize*0.2, brushSize*0.8 + getRandom()*brushSize*0.4, 0, 2 * Math.PI);
				ctx.fill();
				ctx.stroke();
				ctx.filter = "none";
				ctx.closePath();
			}
		}
		
	}
}


let darkColors = ["BLACK","OLIVE","PURPLE","BLUE"];
let neutralColors = ["RED","GRAY","DENIM","GREEN","CYAN","ORANGE","TURQ"];
let brightColors = ["WHITE","PINK","YELLOW","LIME","BLONDE"];

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
	"BLONDE": [50,60],

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
	"BLONDE": ["DENIM","CYAN","PURPLE","PINK"],
	
	"ORANGE": ["BLUE","DENIM","CYAN","PURPLE","GREEN"],
	"LIME": ["RED","PURPLE","PINK"],
	"TURQ":["RED","PINK"]
};

const generateColorScheme3 = (taggedColors, _darkness) => {
	let scheme = [];
	let hues = [];
	let saturations = [];
	let lightings = [];
	let darkness = _darkness == 0 ? (Math.floor(getRandom()*4) - 2) : _darkness;

	// Generate base color
	{
		let colorTag = null;
		let goodColors = [];
		//let hue = null, sat = null, lig = null;
		
		// Search for opposite colors
		taggedColors.forEach(taggedColor => {
			if(colorOpposites[taggedColor]) {
				goodColors = goodColors.concat(colorOpposites[taggedColor]);
			}
		});

		//Pick an opposite color or a random one
		if(goodColors.length==0) {
			colorTag = Object.keys(colorToH)[Math.floor(getRandom()*Object.keys(colorToH).length)];
		}
		else {
			colorTag = goodColors[Math.floor(getRandom()*goodColors.length)];
		}

		// If the opposite color is unknown, get a random one, shouldn't happen
		if(!colorToH[colorTag]) {
			colorTag = Object.keys(colorOpposites)[Math.floor(getRandom()*Object.keys(colorOpposites).length)];
		} 

		hues.push(getColorToH(colorToH[colorTag]));
		saturations.push(75 + getRandom()*20);
		lightings.push(Math.max(90,Math.min(100,93 + getRandom()*4 + darkness)));

		let color = genColorAdv(
			hues[hues.length-1], 
			saturations[saturations.length-1], 
			lightings[lightings.length-1]
			);

		scheme.push({tag:colorTag,color:color});
	}

	// Get secondary color
	{
		// Yellow backgrounds look awful with yellowish secondary colors, so anything remotely yellow goes backwards to orange or red for a secondary color
		// On the other hand, anything after yellow looks awful going back
		let colorH = hues[hues.length-1] < 60 ? (hues[hues.length-1] - (20 + getRandom()*10)) : 
			(hues[hues.length-1] + (20 + getRandom()*10));
		colorH = colorH > 360 ? colorH - 360 : colorH<0 ? colorH+360:colorH;
		hues.push(colorH);

		saturations.push(saturations[saturations.length-1] >= 85 ? saturations[saturations.length-1] - 5: saturations[saturations.length-1]+5);
		lightings.push(lightings[lightings.length-1] >= 98 ? lightings[lightings.length-1]-10 : lightings[lightings.length-1]-15);

		let color = genColorAdv(
			hues[hues.length-1], 
			saturations[saturations.length-1], 
			lightings[lightings.length-1]
			);

		scheme.push({tag:null,color:color});
	}

	// Get highlight color
	{
		let killSaturation = false;
		let prevH = hues[hues.length-1];
		let prevHMid = (hues[hues.length-1] + hues[hues.length-2]) / 2
		prevHMid = Math.abs(hues[hues.length-1] - hues[hues.length-2]) > 180 ? prevHMid - 180 : prevHMid;
		let colorH;

		// OPTIONS: Opposite, -+90, -+45, -+15
		// 210-270 - NO OPPOSITES
		/* if(prevHMid >= 210 && prevHMid <= 270) {
			let possibleColors = [
				// prevHMid + (getRandom() > 0.5 ? + (170 + getRandom()*20) : - (170 + getRandom()*20)),
				prevHMid + (getRandom() > 0.5 ? + (80 + getRandom()*20) : - (80 + getRandom()*20)),
				prevHMid + (getRandom() > 0.5 ? + (40 + getRandom()*20) : - (40 + getRandom()*20)),
				prevHMid + (getRandom() > 0.5 ? + (10 + getRandom()*20) : - (10 + getRandom()*20))
			];
			colorH = possibleColors[Math.floor(getRandom()*possibleColors.length)];
		} */
		/* if((prevHMid >= 0 && prevHMid <= 40) || prevHMid >= 340 && prevHMid <= 360) {
			let possibleColors = [
				prevHMid + (getRandom() > 0.5 ? + (170 + getRandom()*20) : - (170 + getRandom()*20)),
				prevHMid + (getRandom() > 0.5 ? - (80 + getRandom()*20) : - (80 + getRandom()*20)),
				prevHMid + (getRandom() > 0.5 ? - (40 + getRandom()*20) : - (40 + getRandom()*20)),
				prevHMid + (getRandom() > 0.5 ? - (10 + getRandom()*20) : - (10 + getRandom()*20))
			];
			colorH = possibleColors[Math.floor(getRandom()*possibleColors.length)];
		} */

		if(!colorH) {
			let possibleColors = [
				prevHMid + (getRandom() > 0.5 ? + (170 + getRandom()*20) : - (170 + getRandom()*20)),
				prevHMid + (getRandom() > 0.5 ? + (80 + getRandom()*20) : - (80 + getRandom()*20)),
				prevHMid + (getRandom() > 0.5 ? + (40 + getRandom()*20) : - (40 + getRandom()*20)),
				prevHMid + (getRandom() > 0.5 ? + (10 + getRandom()*20) : - (10 + getRandom()*20))
			];
			colorH = possibleColors[Math.floor(getRandom()*possibleColors.length)];
		}
		
		if((colorH >= 20 && colorH <= 80) || (colorH >= 360+20 && colorH <= 360+80)) {
			colorH = getRandom() > 0.5 ? colorH - 40 : colorH - 40;
			//killSaturation = true;
		}
		
		if((colorH >= 80 && colorH <= 140) || (colorH >= 360+80 && colorH <= 360+140)) {
			colorH = getRandom() > 0.5 ? colorH + 40 : colorH + 40;
			//killSaturation = true;
		}

		if((colorH >= 40 && colorH <= 200) || (colorH >= 360+40 && colorH <= 360+200)) {
			killSaturation = true;
		}

		colorH = colorH > 360 ? colorH - 360 : colorH<0 ? colorH+360:colorH;
		hues.push(colorH);

		saturations.push(saturations[saturations.length-1]-(killSaturation ? 20 : 5));
		lightings.push(lightings[lightings.length-1]-10-(killSaturation ? 5 : 0));

		let color = genColorAdv(
			hues[hues.length-1], 
			saturations[saturations.length-1] + 10, 
			lightings[lightings.length-1]
			);

		scheme.push({tag:null,color:color});
	}

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
		if(layerElement.layer.name == "Top") {
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

const genBackground1 = (ctx, scheme, glitch) => {
	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};
	glitch = glitch || 0;
	glitch = glitch/2;

	let incrementByStart = baseUnit*(6 + Math.floor(getRandom()*4));
	let incrementBy = incrementByStart;
	for(let j=start.y;j<end.y; j+=incrementBy) {
		let y = j;
		let x = start.x;
		incrementBy = Math.max(incrementBy*0.9, incrementByStart*0.25);

		let v2arr = [];

		v2arr.push({x: x,   y: y});
		if(getRandom() > glitch)  v2arr.push({x: end.x,   y: y + baseUnit*4});
		if(getRandom() > glitch)  v2arr.push({x: end.x,   y: y + baseUnit*4 + incrementBy*0.5});
		v2arr.push({x: x,   y: y + incrementBy*0.5});

		drawShape(ctx, v2arr, scheme[1]);

		v2arr = [];
		let thirdShapeSize = incrementBy/6;
		
		v2arr.push({x: x,   y: y + incrementBy*0.5 - thirdShapeSize/2});
		if(getRandom() > glitch)  v2arr.push({x: end.x,   y: y + baseUnit*4 + incrementBy*0.5 - thirdShapeSize/2});
		if(getRandom() > glitch)  v2arr.push({x: end.x,   y: y + baseUnit*4 + incrementBy*0.5 + thirdShapeSize/2});
		v2arr.push({x: x,   y: y + incrementBy*0.5 + thirdShapeSize/2});

		drawShape(ctx, v2arr, scheme[2]);
	}
}

const genBackground2 = (ctx, scheme, glitch) => {
	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};
	glitch = glitch || 0;
	glitch = glitch/2;

	let incrementByStart = baseUnit*(6 + Math.floor(getRandom()*5));
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
			if(getRandom() < glitch)  v2arr.push({x:x + w*i + w*0.25, y:y + angleHeight});
			v2arr.push({x:x + w*i + w/2, y:y + angleHeight});
			if(getRandom() < glitch)  v2arr.push({x:x + w*i + w*0.75, y:y});
			v2arr.push({x:x + w*i + w, y:y});
			iend = i+1;
		}
		
		v2arr.push({x:x + w*iend, y:y + incrementBy*0.5});
		for(let i=iend; (start.x+i*w)>start.x+1; i--) {
			if(getRandom() < glitch)  v2arr.push({x:x + w*i - w*0.25, y:y + angleHeight  + incrementBy*0.5});
			v2arr.push({x:x + w*i - w/2, y:y + angleHeight  + incrementBy*0.5});
			if(getRandom() < glitch)  v2arr.push({x:x + w*i - w*0.75, y:y  + incrementBy*0.5});
			v2arr.push({x:x + w*i - w, y:y  + incrementBy*0.5});
		}

		drawShape(ctx, v2arr, scheme[1]);

		// Third color
		v2arr = [];
		let thirdShapeSize = incrementBy/12;
		
		v2arr.push({x: x,   y: y + incrementBy*0.5 - thirdShapeSize/2});
		for(let i=0; (start.x+i*w)<end.x-1; i++) {
			//if(getRandom() < glitch)  
			v2arr.push({x:x + w*i + w/2, y:y + angleHeight  + incrementBy*0.5 - thirdShapeSize/2});
			//if(getRandom() < glitch)  
			v2arr.push({x:x + w*i + w, y:y  + incrementBy*0.5 - thirdShapeSize/2});
			iend = i+1;
		}
		
		v2arr.push({x:x + w*iend, y:y + incrementBy*0.5 + thirdShapeSize/2});
		for(let i=iend; (start.x+i*w)>start.x+1; i--) {
			//if(getRandom() < glitch)  
			v2arr.push({x:x + w*i - w/2, y:y + angleHeight + incrementBy*0.5 + thirdShapeSize/2});
			//if(getRandom() < glitch)  
			v2arr.push({x:x + w*i - w, y:y  + incrementBy*0.5 + thirdShapeSize/2});
		}

		drawShape(ctx, v2arr, scheme[2]);

		
	}

	/* incrementByStart = baseUnit*(9 + Math.floor(getRandom()*2));
	for(let j=start.y;j<end.y; j+=incrementBy) {
		let y = j + baseUnit/2;
		let x = start.x;
		incrementBy = Math.max(incrementBy*0.85, incrementByStart*0.25);

		let v2arr = [];

		v2arr.push({x: x,   y: y});
		let iend = 0;
		let angleHeight = (w/4);

		if(glitch >0 && (getRandom() < glitch*2)) {
			// Third color
			v2arr = [];
			let thirdShapeSize = getRandom() > 0.5 ? incrementBy/3 : incrementBy/2;
			
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

			drawShape(ctx, v2arr, scheme[0]);
		}
	} */
}

const genBackground3 = (ctx, scheme, glitch) => {
	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};
	glitch = glitch || 0;
	glitch = glitch/2;

	let incrementByStart = baseUnit*(8 + Math.floor(getRandom()*3));
	let incrementBy = incrementByStart;
	let w = (end.x-start.x)/(2 + Math.floor(getRandom()*6));
	for(let j=start.y + incrementBy*0.65;j<end.y; j+=incrementBy) {
		let y = j;
		let x = start.x;
		incrementBy = Math.max(incrementBy*0.85, incrementByStart*0.25);

		let v2arr = [];

		v2arr.push({x: x,   y: y});
		let iend = 0;
		let angleHeight = (w/4);
		for(let i=0; (start.x+i*w)<end.x-1; i++) {
			if(getRandom() > glitch)  v2arr.push({x:x + w*i + w/2, y:y + angleHeight});
			v2arr.push({x:x + w*i + w, y:y});
			iend = i+1;
		}
		
		v2arr.push({x:x + w*iend, y:y + incrementBy*0.5});
		for(let i=iend; (start.x+i*w)>start.x+1; i--) {
			if(getRandom() > glitch)  v2arr.push({x:x + w*i - w/2, y:y + angleHeight  + incrementBy*0.5});
			v2arr.push({x:x + w*i - w, y:y  + incrementBy*0.5});
		}

		drawShape(ctx, v2arr, scheme[1]);

		// Third color
		v2arr = [];
		let thirdShapeSize = incrementBy/12;
		
		v2arr.push({x: x,   y: y + incrementBy*0.5 - thirdShapeSize/2});
		for(let i=0; (start.x+i*w)<end.x-1; i++) {
			if(getRandom() > glitch)  v2arr.push({x:x + w*i + w/2, y:y + angleHeight  + incrementBy*0.5 - thirdShapeSize/2});
			v2arr.push({x:x + w*i + w, y:y  + incrementBy*0.5 - thirdShapeSize/2});
			iend = i+1;
		}
		
		v2arr.push({x:x + w*iend, y:y + incrementBy*0.5 + thirdShapeSize/2});
		for(let i=iend; (start.x+i*w)>start.x+1; i--) {
			if(getRandom() > glitch)  v2arr.push({x:x + w*i - w/2, y:y + angleHeight + incrementBy*0.5 + thirdShapeSize/2});
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

	let w2 = (end.x-start.x)/(getRandom() > 0.5 ? 11 : getRandom() > 0.5 ? 12 : 13);//(12); // 11/12/13 are ok
	let incrementByStart = w2*2;
	let incrementBy = incrementByStart;

	for(let j=start.y, jc=0;j<end.y; j+=incrementBy, jc++) {
		incrementBy = Math.max(incrementByStart/2, incrementBy*0.95);
		let w = incrementBy;
		let w3 = incrementByStart;
		let y = j;
		for(let i=start.x + (jc%2==0 ? 0 : w/2);i<end.x; i+=w) {
			if(getRandom() > 0.5 && getRandom() > (5-jc)/5) {

				let x = i;

				let v2arr = [];

				let d1 = 16, d2=8;
				let color = getRandom() > 0.5 ? scheme[1] : scheme[2];
				v2arr = [];
				v2arr.push({x:x + w3/d1, y:y + w3/d1});
				v2arr.push({x:x + w3/d1 + (w-w3/d2), y:y + w3/d1});
				drawShape(ctx, v2arr, color);
				v2arr = [];
				v2arr.push({x:x + w3/d1 + (w-w3/d2), y:y + w3/d1});
				v2arr.push({x:x + w3/d1 + (w-w3/d2), y:y + w3/d1 + (incrementBy-w3/d2)});
				drawShape(ctx, v2arr, color);
				v2arr = [];
				v2arr.push({x:x + w3/d1 + (w-w3/d2), y:y + w3/d1 + (incrementBy-w3/d2)});
				v2arr.push({x:x + w3/d1, y:y + w3/d1 + (incrementBy-w3/d2)});
				drawShape(ctx, v2arr, color);
				v2arr = [];
				v2arr.push({x:x + w3/d1, y:y + w3/d1 + (incrementBy-w3/d2)});
				v2arr.push({x:x + w3/d1, y:y + w3/d1});
				drawShape(ctx, v2arr, color);

				continue;
			}

			let x = i;

			let v2arr = [];

			let d1 = 16, d2=8;
			v2arr.push({x:x + w3/d1, y:y + w3/d1});
			v2arr.push({x:x + w3/d1 + (w-w3/d2), y:y + w3/d1});
			v2arr.push({x:x + w3/d1 + (w-w3/d2), y:y + w3/d1 + (incrementBy-w3/d2)});
			v2arr.push({x:x + w3/d1, y:y + w3/d1 + (incrementBy-w3/d2)});

			
			let color = scheme[1];

			drawShape(ctx, v2arr, color);
		}
	}
	
	/* if(true) {
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
				
				if(getRandom() > 0.75 && getRandom() > (5-jc)/5) {
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
	} */
	
}

const genBackground5 = (ctx, scheme, glitch) => {
	let baseUnit = format.width/16;
	let diffNegStart = baseUnit*4;
	let topDiff = (baseUnit-(format.height%baseUnit));
	let start = {x: 0 -(diffNegStart), y: -(topDiff/2) -(diffNegStart)};
	let end = {x:start.x + baseUnit*(16) +(diffNegStart*2), y:start.y+ Math.ceil(format.height/baseUnit)*baseUnit +(diffNegStart*2)};
	glitch = glitch || 0;
	glitch = glitch/2;

	let w = baseUnit*3

	for(let j=start.y, jc=0;j<end.y; j+=w, jc++) {
		let y = j;
		for(let i=start.x + (jc%2==0?w:0);i<end.x; i+=w*2) {
			let x = i;

			if(getRandom() < glitch/2) {
				continue;
			}

			{
				let v2arr = [];

				let divw = w/6;

				if(getRandom() < glitch) {
					divw*=2;
				}

				v2arr.push({x:x+w/2, y:y    +divw});
				if(getRandom() > glitch)  v2arr.push({x:x+w, y:y+w/2    +divw});
				v2arr.push({x:x+w/2, y:y+w    +divw});
				v2arr.push({x:x, y:y+w/2    +divw});

				let color = scheme[2];

				drawShape(ctx, v2arr, color);
			}

			{
				let v2arr = [];

				v2arr.push({x:x+w/2, y:y});
				v2arr.push({x:x+w, y:y+w/2});
				if(getRandom() > glitch)  v2arr.push({x:x+w/2, y:y+w});
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

			let color = jc%6==0 ? scheme[2] : jc%4==0 ? scheme[1] : jc%2==0 ? scheme[0] : getRandom()>0.5 ? scheme[0] : getRandom()>0.5 ? scheme[1] : scheme[2];

			drawShape(ctx, v2arr, color);
		}
		
		istart += (centerx-istart)*changeMul;
		jstart += (centery-jstart)*changeMul;
		iend += (centerx-iend)*changeMul;
		jend += (centery-jend)*changeMul;
	}
}

const genBackground7 = (ctx, scheme, glitch) => {
	

	let reversedScheme = [scheme[1], scheme[0], scheme[2]];
	let newScheme;

	if(getRandom() > 0.5 ) {
		newScheme = scheme;
	}
	else {
		newScheme = reversedScheme;
		ctx.fillStyle = newScheme[0];
		ctx.fillRect(0, 0, format.width, format.height);
	}

	let randomNum = getRandom();
	if(randomNum > 0.8) {
		genBackground1(ctx,newScheme, glitch); // This is really cool
		genBackground2(ctx,newScheme, glitch);
		genBackground3(ctx,reversedScheme, glitch);
		genBackground4(ctx,reversedScheme, glitch);
		//genBackground5(ctx,newScheme);
	}
	else if(randomNum > 0.6) {
		genBackground1(ctx,newScheme, glitch); // This is really cool
		genBackground2(ctx,newScheme, glitch);
		genBackground3(ctx,reversedScheme, glitch);
		//genBackground4(ctx,newScheme);
		genBackground5(ctx,reversedScheme, (glitch +1)/2);
	}
	else if(randomNum > 0.4) {
		/* genBackground1(ctx,newScheme); // This is really cool
		//genBackground2(ctx,scheme);
		//genBackground3(ctx,scheme);
		genBackground4(ctx,newScheme); */
		genBackground6(ctx,reversedScheme, glitch);
		genBackground1(ctx,reversedScheme, glitch);
		genBackground1(ctx,reversedScheme, glitch);
		genBackground1(ctx,reversedScheme, glitch);
		genBackground2(ctx,scheme, glitch);
		genBackground2(ctx,scheme, glitch);
		genBackground2(ctx,reversedScheme, glitch);
		genBackground3(ctx,scheme, glitch);
		genBackground3(ctx,scheme, glitch);
		genBackground3(ctx,reversedScheme, glitch);
		//genBackground4(ctx,newScheme);
		//genBackground3(ctx,newScheme);
	}
	else if(randomNum > 0.2) {
		
		genBackground6(ctx,newScheme, glitch);
		genBackground4(ctx,reversedScheme, glitch);
		genBackground5(ctx,reversedScheme,  (glitch +1)/2);
	}
	else {
		genBackground3(ctx,newScheme, glitch);
		genBackground4(ctx,reversedScheme, glitch);
	}
}

const generateCustomBackground = (layerConfiguration, layerElements, ctx, editionNum) => {
	getRandom = rngSeed ? help.newPrngStream(rngSeed + editionNum).random : Math.random;
	let {darkness, taggedColors} = generateColorMatchingData(layerElements);
	let scheme = generateColorScheme3(taggedColors,darkness);
	let glitchiness = getRandom() > 0.15 ? 0 : getRandom(); // 0.25
	
    ctx.fillStyle = scheme[0];
	ctx.fillRect(0, 0, format.width, format.height);

	/* let bgs = [
		genBackground1, // linear lines // BAD
		genBackground2, // arrow down // BAD
		genBackground3, // zigzag // BAD
		genBackground4, // floating squares // Need reimagining
		genBackground5, // shaded squares // Great, could use more shapes
		genBackground6, // big diamond // Need reimagining
	]; */

	let bgs = [
		genBackground1, // linear lines // BAD
		genBackground1, // linear lines // BAD
		genBackground2, // arrow down // BAD
		genBackground2, // arrow down // BAD
		genBackground3, // zigzag // BAD
		genBackground3, // zigzag // BAD
		//genBackground4, // floating squares // Need reimagining
		genBackground5, // shaded squares // Great, could use more shapes
		genBackground5, // shaded squares // Great, could use more shapes
		//genBackground6, // big diamond // Need reimagining
		genBackground7
	];

	bgs[Math.floor(getRandom()*bgs.length)](ctx, scheme, glitchiness);
	// 4 is fucked, needs a lot less randomness
	// 6 is not that good
	//genBackground4(ctx,scheme);
	//genBackground5(ctx,scheme);
	//genBackground7(ctx,scheme, glitchiness);
	//genBackground5(ctx,scheme, glitchiness);

	/* genBackground1(ctx,scheme); // This is really cool
	genBackground2(ctx,scheme);
	genBackground3(ctx,scheme);
	genBackground4(ctx,scheme);
	genBackground5(ctx,scheme); */

	//addText(ctx, JSON.stringify(scheme),100,250,32);
	ctx.filter = "none";
  };

module.exports = {
	generateCustomBackground,
};