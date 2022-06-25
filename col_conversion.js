
/// String: rgb(1,2,3)
/// Array : [1,2,3]

function strRGBtoArrayRGB(rgb_str){
	return rgb_str.slice(4).slice(0, -1).split(',').map(s => parseInt(s));
}
function arrayRGBtoStrRGB(rgb_array){
	return 'rgb('+rgb_array[0].toString()+','+rgb_array[1].toString()+','+rgb_array[2].toString()+')';
}


/// Blend from RGB

function basicBlendHEX(hex1,hex2,split){
	return rgbArrayToHex(basicBlendRGB(hexToRgbArray(hex1),hexToRgbArray(hex2),split));
}
function basicBlendRGB(rgb1_array,rgb2_array,split){
	console.log(rgb1_array,rgb2_array,split);
	return Array.from({length: 3}, (_, i) => parseInt(rgb1_array[i]*(1-split)+rgb2_array[i]*split));
}
function basicBlendStrRGB(rgb1_str,rgb2_str,split){
	return arrayRGBtoStrRGB(basicBlendRGB(strRGBtoArrayRGB(rgb1_str),strRGBtoArrayRGB(rgb2_str),split));
}

//// Blend from RYB

function blendHEX(hex1,hex2,split){
	return rgbToHex(blendRGB(hexToRgb(hex1),hexToRgb(hex2),split));
}

function blendRGB(rgb1,rgb2,split){
	return rybToRGB(blendRYB(rgbToRYB(strRGBtoArrayRGB(rgb1)),rgbToRYB(strRGBtoArrayRGB(rgb2)),split));
}

function blendRYB(ryb1,ryb2,split){
	return Array.from({length: 3}, (_, i) => parseInt(ryb1[i]*(1-split)+ryb2[i]*split));
}

function hexToRgbArray(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)];
}
function rgbArrayToHex(rgb_array) {
	return "#" + ((1 << 24) + (rgb_array[0] << 16) + (rgb_array[1] << 8) + rgb_array[2]).toString(16).slice(1);
}

function hexToRgbStr(hex) {
	return arrayRGBtoStrRGB(hexToRgbArray(hex));
}
function rgbStrToHex(rgb) {
	return rgbArrayToHex(strRGBtoArrayRGB(rgb));
}

// Credit: http://www.deathbysoftware.com/colors/index.html.
function rgbToRYB(rgb_array){
	var r = rgb_array[0];
		g = rgb_array[1];
		b = rgb_array[2];
	// Remove the white from the color
	var w = Math.min(r, g, b);
	r -= w;
	g -= w;
	b -= w;
	var maxG = Math.max(r, g, b);
	// Get the yellow out of the red+green
	var y = Math.min(r, g);
	r -= y;
	g -= y;
	// If this unfortunate conversion combines blue and green, then cut each in half to
	// preserve the value's maximum range.
	if (b > 0 && g > 0){
		b /= 2;
		g /= 2;
	}
	// Redistribute the remaining green.
	y += g;
	b += g;
	// Normalize to values.
	var maxY = Math.max(r, y, b);
	if (maxY > 0) {
		var n = maxG / maxY;
		r *= n;
		y *= n;
		b *= n;
	}
	// Add the white back in.
	r += w;
	y += w;
	b += w;
	return [Math.floor(r), Math.floor(y), Math.floor(b)];
}
	

function rybToRGB(ryb_array){
	var r = ryb_array[0];
		y = ryb_array[1];
		b = ryb_array[2];
	// Remove the whiteness from the color.
	var w = Math.min(r, y, b);
	r -= w;
	y -= w;
	b -= w;
	var maxY = Math.max(r, y, b);
	// Get the green out of the yellow and blue
	var g = Math.min(y, b);
	y -= g;
	b -= g;
	if (b > 0 && g > 0){
		b  *= 2.0;
		g *= 2.0;
	}
	// Redistribute the remaining yellow.
	r += y;
	g += y;
	// Normalize to values.
	var maxG = Math.max(r, g, b);
	if (maxG > 0){
		var n = maxY / maxG;
		r *= n;
		g *= n;
		b *= n;
	}
	// Add the white back in.
	r += w;
	g += w;
	b += w;
	return [Math.floor(r), Math.floor(g), Math.floor(b)];
}
