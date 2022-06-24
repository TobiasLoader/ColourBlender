
/// Blend from RGB

function basicBlendHEX(hex1,hex2,split){
	return rgbToHex(basicBlendRGB(hexToRgb(hex1),hexToRgb(hex2),split));
}
function basicBlendRGB(rgb1,rgb2,split){
	return Array.from({length: 3}, (_, i) => parseInt(rgb1[i]*(1-split)+rgb2[i]*split));

}


//// Blend from RYB

function blendHEX(hex1,hex2,split){
	return rgbToHex(blendRGB(hexToRgb(hex1),hexToRgb(hex2),split));
}

function blendRGB(rgb1,rgb2,split){
	return rybToRGB(blendRYB(rgbToRYB(rgb1),rgbToRYB(rgb2),split));
}

function blendRYB(ryb1,ryb2,split){
	return Array.from({length: 3}, (_, i) => parseInt(ryb1[i]*(1-split)+ryb2[i]*split));
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)];
}
function rgbToHex(rgb) {
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

// Credit: http://www.deathbysoftware.com/colors/index.html.
function rgbToRYB(rgb){
	var r = rgb[0];
		g = rgb[1];
		b = rgb[2];
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
	

function rybToRGB(ryb){
	var r = ryb[0];
		y = ryb[1];
		b = ryb[2];
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
