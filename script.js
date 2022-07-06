////////// COLOUR CONVERSION SCRIPT ///////////

/// RGB String: rgb(1,2,3)
/// RGB Array : [1,2,3]
/// HEX String: #010203

// Self explanatory String RGB / Array RGB / HEX conversions
function strRGBtoArrayRGB(rgb_str){
	return rgb_str.slice(4).slice(0, -1).split(',').map(s => parseInt(s));
}
function arrayRGBtoStrRGB(rgb_array){
	return 'rgb('+rgb_array[0].toString()+','+rgb_array[1].toString()+','+rgb_array[2].toString()+')';
}
function hexToRgbArray(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)];
}
function rgbArrayToHex(rgb_array) {
	return "#" + ((1 << 24) + (rgb_array[0] << 16) + (rgb_array[1] << 8) + rgb_array[2]).toString(16).slice(1);
}

// Composition of functions above for HEX <--> RGB conversions
function hexToRgbStr(hex) {
	return arrayRGBtoStrRGB(hexToRgbArray(hex));
}
function rgbStrToHex(rgb) {
	return rgbArrayToHex(strRGBtoArrayRGB(rgb));
}

function blendHEX(hex1,hex2,split){
	return rgbArrayToHex(blendRGB(hexToRgbArray(hex1),hexToRgbArray(hex2),split));
}
function blendStrRGB(rgb1_str,rgb2_str,split){
	return arrayRGBtoStrRGB(blendRGB(strRGBtoArrayRGB(rgb1_str),strRGBtoArrayRGB(rgb2_str),split));
}

// Blend RGB (in array form) - linear interpolation between rgb1 and rgb2 at split round to 2DP.
function blendRGB(rgb1_array,rgb2_array,split){
	return Array.from({length: 3}, (_, i) => parseInt(rgb1_array[i]*(1-Math.round(100*split)/100)+rgb2_array[i]*Math.round(100*split)/100));
}

/////////// COLOUR FUNCTIONS SCRIPT ///////////

function refreshColourFields() {
	// location for start/end of background gradient
	// - for desktop, since track is from 20-80% of screen start at 20, end at 80.
	// - for <700px, stretch the entire width of screen (0 to 100).
	var p1 = 20;
	var p2 = 80;
	if (window.innerWidth<700){
		p1 = 0;
		p2 = 100;
	}
	// list of styles to form the (max compatibility) background linear gradient
	let bg_styles = [
		'background: rgb(50,50,50)',
		'background: -moz-linear-gradient(0deg, '+cols[0]+' '+p1+'%, '+cols[1]+' '+p2+'%)',
		'background: -webkit-linear-gradient(0deg, '+cols[0]+' '+p1+'%, '+cols[1]+' '+p2+'%)',
		'background: linear-gradient(90deg, '+cols[0]+' '+p1+'%, '+cols[1]+' '+p2+'%)',      
		'filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="'+cols[0]+'", endColorstr="'+cols[1]+'", GradientType=1)'
	].join(';');
	$('body').attr('style', bg_styles);
	// colour the sidebar the right hand colour
	$('#sidebar-content').css({'background':cols[1]});
	applyColourChoice();
}
// apply colour choice updates text boxes, track etc...
function applyColourChoice() {
	// depending on colour_encode (hex/rgb) use appropriate blend function
	if (colour_encode=='hex') colour_choice = blendHEX(cols[0],cols[1],split);
	else if (colour_encode=='rgb') colour_choice = blendStrRGB(cols[0],cols[1],split);
	// reposition the colour banner horizontally for desktop (overwritten in media query for <700px)
	$('#colour-banner').css({'left':(20+60*split).toString()+'%'});
	// colour the background of banner with blended colour choice
	$('#colour-banner').css({'background':colour_choice});
	// colour the sub-content-box with blended colour choice
	$('#sub-content-box').css({'background':colour_choice});
	// update the track diamond with new colour/split
	$('#track-diamond').css({
		'background':colour_choice,
		'left':(100*split).toString()+'%',
	});
	// update the html in the colour result with new blended colour choice
	$('#colour-result').html(colour_choice);
	// each colour input text box, make the text placeholder so disappears on click
	for (var i=0; i<2; i+=1){
		$('#col'+(i+1).toString()).attr('placeholder',cols[i]);
		$('#col'+(i+1).toString()).val('');
		// the colour pickers accept their vals only in the hex format
		if (colour_encode=='rgb') $('#col'+(i+1).toString()+'_picker').val(rgbStrToHex(cols[i]));
		else if (colour_encode=='hex') $('#col'+(i+1).toString()+'_picker').val(cols[i]);
	}
	// make the split input text a placeholder so disappears on click
	$('#split').attr('placeholder',Math.round(100*split));
	$('#split').val('');
	// checks brightness of LHS colour if should switch title text to light/dark
	lightDarkCheckTitle();
	// checks brightness of blended colour_choice if should switch banner text to light/dark
	lightDarkCheckBanner();
	// checks brightness of RHS colour if should switch sidebar text to light/dark
	lightDarkCheckSidebar();
	// if colour is too dark then make special consideration
	belowDarkCheck();
}

// on switch change from RGB to HEX
function switchToHex(){
	colour_encode = 'hex';
	// body should have appropriate hex/rgb class
	$('body').removeClass('rgb');
	$('body').addClass('hex');
	// animate sliderbox from rgb to hex
	$(".sliderbox").animate({"left":"10"},200,function () {can_encode_switch = true;});
	// change each stored colour from rgb to hex
	cols = cols.map(rgb => rgbStrToHex(rgb));
	colour_choice = rgbStrToHex(colour_choice);
	// update css and gradient code snippets
	showcssBuildCode();
	gradientBuildCode();
}

function switchToRgb(){
	colour_encode = 'rgb';
	// body should have appropriate hex/rgb class
	$('body').removeClass('hex');
	$('body').addClass('rgb');
	// animate sliderbox from hex to rgb
	$(".sliderbox").animate({"left":"70"},200,function (){can_encode_switch = true;});
	// change each stored colour from hex to rgb
	cols = cols.map(hex => hexToRgbStr(hex));
	colour_choice = hexToRgbStr(colour_choice);
	// update css and gradient code snippets
	showcssBuildCode();
	gradientBuildCode();
}

// return brightness value of hex colour
function extractBrightnessHEX(hex){
	var rgb = parseInt(hex.substring(1), 16);   // convert rrggbb to decimal
	var r = (rgb >> 16) & 0xff;  // extract red
	var g = (rgb >>  8) & 0xff;  // extract green
	var b = (rgb >>  0) & 0xff;  // extract blue
	return extractBrightnessRGBArray([r,g,b]);
}
// return brightness value of rgb colour
function extractBrightnessRGBArray(rgb_array){
	return 0.2126 * rgb_array[0] + 0.7152 * rgb_array[1] + 0.0722 * rgb_array[2]; // per ITU-R BT.709
}
// return brightness value of a colour
function extractBrightnessCol(col){
	if (colour_encode=='hex')
		return extractBrightnessHEX(col);
	else if (colour_encode=='rgb')
		return extractBrightnessRGBArray(strRGBtoArrayRGB(col));
	return 0;
}

function lightDarkCheckBanner(){
	// get brightness of blended colour choice
	let b = extractBrightnessCol(colour_choice);
	// if light mode and colour brightness is too bright change text to dark
	if (colour_banner_mode=='light' && b>187){
		colour_banner_mode = 'dark';
		// update the central-content light/dark mode class
		$('#central-content').removeClass("light-mode");
		$('#central-content').addClass("dark-mode");
		// switch out also the clipboard copy svgs
		$('.colour-output img').attr('src','assets/dark-clipboard-copy.svg');
	}
	// if dark mode and colour brightness is too dark change text to light
	else if (colour_banner_mode=='dark' && b<183){
		colour_banner_mode = 'light';
		// update the central-content light/dark mode class
		$('#central-content').removeClass("dark-mode");
		$('#central-content').addClass("light-mode");
		// switch out also the clipboard copy svgs
		$('.colour-output img').attr('src','assets/light-clipboard-copy.svg');
	}
	// note discrepency in 187/183 brightness breakpoints.
	// this is to prevent rapid flickering since the linear interpolation between
	// some pairs of colours doesn't follow a monotone increasing/decreasing
	// brightness, and instead has local minimums/maximums. So a greater change
	// to be achieved before switching light/dark mode if hovering around ~183/187
}

function lightDarkCheckTitle(){
	// get brightness of LHS colour
	let b = extractBrightnessCol(cols[0]);
	// if bright then make title text dark
	// if dark then make title text light
	if (b>=185){
		$('#title').removeClass('light-title');
		$('#title').addClass('dark-title');
	} else if (b<185){
		$('#title').removeClass('dark-title');
		$('#title').addClass('light-title');
	}
}
function lightDarkCheckSidebar(){
	// get brightness of RHS colour
	let b = extractBrightnessCol(cols[1]);
	// if bright then make sidebar text dark
	// if dark then make sidebar text light
	if (b>=185){
		$('#sidebar').removeClass('light-sidebar');
		$('#sidebar').addClass('dark-sidebar');
	} else if (b<185){
		$('#sidebar').removeClass('dark-sidebar');
		$('#sidebar').addClass('light-sidebar');
	}
}
function belowDarkCheck(){
	// get brightness of blended colour choice
	let b = extractBrightnessCol(colour_choice);
	// if too dark then make special consideration
	if (b<100) $('.code-snippet').css('border','rgb(100,100,100) 1px solid');
	else $('.code-snippet').css('border','none');
}

// the admissable hex chars (ie. base-16 digits)
let hex_chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

// verify the text typed into hex input box can be resolved to hex
function verifyFormatHex(hex) {
	// There are 4 configurations I consider
	// - (#) + (6 base-16 chars)
	// - (6 base-16 chars)
	// - (#) + (3 base-16 chars)
	// - (3 base-16 chars)
	
	// return valid hex in standard: (#) + (6 base-16 chars)
	
	if (hex.length==7 && hex[0]=='#'){
		for (var i=1; i<7; i+=1){
			// if any of the chars aren't a hex char then reject
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
		// otherwise return the valid hex code
		return hex;
	} else if (hex.length==6){
		for (var i=0; i<6; i+=1){
			// if any of the chars aren't a hex char then reject
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
		// otherwise return the valid hex code in standard form
		return '#'+hex;
	} else if (hex.length==4 && hex[0]=='#'){
		for (var i=1; i<4; i+=1){
			// if any of the chars aren't a hex char then reject
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
		// otherwise return the valid hex code in standard form
		return '#'+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
	} else if (hex.length==3){
		for (var i=0; i<3; i+=1){
			// if any of the chars aren't a hex char then reject
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
		// otherwise return the valid hex code in standard form
		return '#'+hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	} else {
		// if input doesn't fit any pattern the reject
		return false;
	}
}

// verify the text typed into rgb input box can be resolved to rgb
function verifyFormatRGB(rgbstr) {
	// composition of functions to:
	// - remove whitespace and commas, replace by standard &
	// - remove all characters that aren't numbers or &
	// - split on &'s
	// - filter the elements of resulting array to remove empty strings
	// - parse all remaining elements to ints
	// - filter the elements for undefined and out of range 0-255
	let rgb = rgbstr.replace(/(\s+)|(,)/g, '&').replace(/[^0-9,&]/g,'').split('&').filter(s => (s!='')).map(s => parseInt(s)).filter(i => (i!=undefined && i>=0 && i<=255));
	// then if an array of 3 remains then we have extracted valid red, green and blue values.
	if (rgb.length == 3){
		// return standard form for string rgb: rgb(0-255,0-255,0-255)
		return 'rgb('+rgb[0].toString()+','+rgb[1].toString()+','+rgb[2].toString()+')';
	} else {
		// otherwise reject
		return false;
	}
}

// verify whether the input is valid with current encoding
function verifyFormatCol(colstr){
	if (colour_encode=='hex') return verifyFormatHex(colstr);
	else if (colour_encode=='rgb') return verifyFormatRGB(colstr);
	else return false;
}
// verify whether the input is valid with the other encoding
// - we do this in case the first fails but the other encoding matches,
// - we can then automatically switch the correct encoding so input is valid
function verifyOtherFormatCol(colstr){
	if (colour_encode=='rgb') return verifyFormatHex(colstr);
	else if (colour_encode=='hex') return verifyFormatRGB(colstr);
	else return false;
}

// function executed when colour input is entered
function colourTextInputEntered(el,el_picker,i){
	// tries to validated the colour with current encoding
	let veri_col = verifyFormatCol(el.val());
	if (veri_col){
		// if succeeds then update the corresponding colour
		cols[i] = veri_col;
		// then refresh the page with new colour
		refreshColourFields();
	} else {
		// if fails then check if validated with other encoding
		let other_veri_col = verifyOtherFormatCol(el.val());
		if (other_veri_col) {
			// if it is then switch to new encoding
			if (colour_encode=='rgb') switchToHex();
			else if (colour_encode=='hex') switchToRgb();
			// then update corresponding colour
			cols[i] = other_veri_col;
			// and refresh the page with new colour
			refreshColourFields();
		}
		else {
			// if both validation fail the return back to previous valid colour
			el.attr('placeholder',cols[i]);
			el.val('');
		}
	}
}

// function to be executed when number input split is entered
function numberSplitInputEntered(el){
	// attempt to parse the string to int
	let valentered = parseInt(el.val());
	// if valid int and in range 0-100
	if (valentered!=undefined && valentered>=0 && valentered<=100){
		// then update value split
		split = valentered/100;
		// update colours on page with applyColourChoice()
		applyColourChoice();
		// and make newly input text placeholder
		el.attr('placeholder',Math.round(split*100));
		el.val('');
	} else {
		// otherwise return to previous valid number split
		el.attr('placeholder',Math.round(split*100));
		el.val('');
	}
}

//////////// CODE SNIPPETS SCRIPT /////////////

// echo <span> html for code snippets
function echoHTML(pairs){
	s = "";
	// where p is of the form [style_class,text]
	// so 'text' is rendered to code snippet with css class 'style_class'
	for (var p of pairs){
		s += "<span class='"+p[0]+"'>"+p[1]+"</span>";
	}
	return s;
}

// build code snippet for the show css page
function showcssBuildCode() {
	// different cases for rgb/hex
	// note colour_choice.slice(1) for hex discards first char
	// 	eg. #ffffff --> ffffff
	// note colour_choice.slice(4,-1) for rgb discards 'rgb(' and ')'
	// 	eg. rgb(1,11,111) --> 1,11,111
	switch (colour_encode){
		case 'hex':
			$('#showcss-content .code-css').html(
				echoHTML([
					['l1','color'],
					['l2',': '],
					['l3','#'],
					['l4',colour_choice.slice(1)],
					['l2',';']
				])
			);
			break;
		case 'rgb':
			$('#showcss-content .code-css').html(
				echoHTML([
					['l1','color'],
					['l2',': '],
					['l3','rgb'],
					['l2','('],
					['l4',colour_choice.slice(4,-1)],
					['l2',');']
				])
			);
			break;
	}
}

// build both code snippets for the gradient css page
function gradientBuildCode() {
	var solid;
	var mozlineargradient;
	var webkitlineargradient;
	var lineargradient;
	var filter;
	// build the relevant line of code for each of the above properties (if hex/rgb)
	switch (colour_encode){
		case 'hex':
			solid = echoHTML([
				['l1','background'],
				['l2',': '],
				['l3','#'],
				['l4',cols[0].slice(1)],
				['l2',';']
			]);
			mozlineargradient = echoHTML([
				['l1','background'],
				['l2',': '],
				['l3','-moz-linear-gradient'],
				['l2','('],
				['l5','0deg'],
				['l2',', '],
				['l3','#'],
				['l4',cols[0].slice(1)],
				['l5',' 0%'],
				['l2',', '],
				['l3','#'],
				['l4',cols[1].slice(1)],
				['l5',' 100%'],
				['l2',');']
			]);
			webkitlineargradient = echoHTML([
				['l1','background'],
				['l2',': '],
				['l3','-webkit-linear-gradient'],
				['l2','('],
				['l5','0deg'],
				['l2',', '],
				['l3','#'],
				['l4',cols[0].slice(1)],
				['l5',' 0%'],
				['l2',', '],
				['l3','#'],
				['l4',cols[1].slice(1)],
				['l5',' 100%'],
				['l2',');']
			]);
			lineargradient = echoHTML([
				['l1','background'],
				['l2',': '],
				['l3','linear-gradient'],
				['l2','('],
				['l5','90deg'],
				['l2',', '],
				['l3','#'],
				['l4',cols[0].slice(1)],
				['l5',' 0%'],
				['l2',', '],
				['l3','#'],
				['l4',cols[1].slice(1)],
				['l5',' 100%'],
				['l2',');']
			]);
			filter = echoHTML([
				['l1','filter'],
				['l2',': '],
				['l3','progid:DXImageTransform.Microsoft.gradient'],
				['l2','(startColorstr="'],
				['l3','#'],
				['l4',cols[0].slice(1)],
				['l2','", endColorstr="'],
				['l3','#'],
				['l4',cols[1].slice(1)],
				['l2','", GradientType='],
				['l5','1'],
				['l2',');'],
			]);
			break;
		case 'rgb':
			solid = echoHTML([
				['l1','background'],
				['l2',': '],
				['l3','rgb'],
				['l2','('],
				['l4',colour_choice.slice(4,-1)],
				['l2',');']
			]);
			mozlineargradient = echoHTML([
				['l1','background'],
				['l2',': '],
				['l3','-moz-linear-gradient'],
				['l2','('],
				['l5','0deg'],
				['l2',', '],
				['l3','rgba'],
				['l2','('],
				['l4',cols[0].slice(4,-1)+',1'],
				['l2',') '],
				['l5','0%'],
				['l2',', '],
				['l3','rgba'],
				['l2','('],
				['l4',cols[1].slice(4,-1)+',1'],
				['l2',') '],
				['l5','100%'],
				['l2',');']
			]);
			webkitlineargradient = echoHTML([
				['l1','background'],
				['l2',': '],
				['l3','-webkit-linear-gradient'],
				['l2','('],
				['l5','0deg'],
				['l2',', '],
				['l3','rgba'],
				['l2','('],
				['l4',cols[0].slice(4,-1)+',1'],
				['l2',') '],
				['l5','0%'],
				['l2',', '],
				['l3','rgba'],
				['l2','('],
				['l4',cols[1].slice(4,-1)+',1'],
				['l2',') '],
				['l5','100%'],
				['l2',');']
			]);
			lineargradient = echoHTML([
				['l1','background'],
				['l2',': '],
				['l3','linear-gradient'],
				['l2','('],
				['l5','90deg'],
				['l2',', '],
				['l3','rgba'],
				['l2','('],
				['l4',cols[0].slice(4,-1)+',1'],
				['l2',') '],
				['l5','0%'],
				['l2',', '],
				['l3','rgba'],
				['l2','('],
				['l4',cols[1].slice(4,-1)+',1'],
				['l2',') '],
				['l5','100%'],
				['l2',');']
			]);
			filter = echoHTML([
				['l1','filter'],
				['l2',': '],
				['l3','progid:DXImageTransform.Microsoft.gradient'],
				['l2','(startColorstr="'],
				['l3','#'],
				['l4',rgbStrToHex(cols[0]).slice(1)],
				['l2','", endColorstr="'],
				['l3','#'],
				['l4',rgbStrToHex(cols[1]).slice(1)],
				['l2','", GradientType='],
				['l5','1'],
				['l2',');'],
			]);
			break;
	}
	// for the modern gradient code snippet include only linear-gradient
	$('#gradient-content #modern-gradient .code-css').html(
		lineargradient
	);
	// for max compatability include all of them.
	$('#gradient-content #max-comp-gradient .code-css').html(
		[
			solid,
			mozlineargradient,
			webkitlineargradient,
			lineargradient,
			filter
		].join('<br>')
	);
}

//////////////// DRAG SCRIPT //////////////////

// adapted from w3schools
// pass node of element to be dragged into dragElement on init
// this function is applied to elements: #colour-banner and #track-diamond 
function dragElement(elmnt) {
	// drag offset is offset from where clicked to center of element
	var clickdragoffset = 0;
	elmnt.onmousedown = dragMouseDown;
	// if starting a drag on the element
	function dragMouseDown(e) {
		// only allow drag if desktop version with track
		if (window.innerWidth>=700){
			// check the target is correct
			e = e || window.event;
			if(e.target !== this)
			return;
			// determine the drag offset (which is then maintained throughout drag)
			clickdragoffset = e.clientX-$(window).width()*(0.2+split*0.6);
			// define the callbacks for continuing to drag and release drag
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
			// add moving classes to both colour-banner and track-diamond when only one of the 
			// two elements is dragged - so they both follow same behaviour when either dragged
			// (gives illusion they are connected in some way)
			$('#colour-banner').addClass('moving');
			$('#track-diamond').addClass('moving');
		}
	}
	// during drag
	function elementDrag(e) {
		// prevent click traversing dom any further
		e.preventDefault();
		// calculate the new split (based off linear interpolation inside 20-80% where track start/end)
		let p = (e.clientX-clickdragoffset-0.2*$(window).width())/(0.6*$(window).width());
		// if below 0 then fix to 0
		if (p<0) p=0;
		// if above 1 then fix to 1
		if (p>1) p=1;
		// update split to be p
		split = p;
		// update location of element
		elmnt.style.left = 100*split+'%';
		// and apply colour choices
		applyColourChoice();
	}
	// when drag finished
	function closeDragElement() {
		// remove moving class from colour-banner and track-diamond elements
		$('#colour-banner').removeClass('moving');
		$('#track-diamond').removeClass('moving');
		// reset drag offset
		clickdragoffset = 0;
		// round split to be a whole percentage
		split = Math.round(100*split)/100;
		// update location of element
		elmnt.style.left = 100*split+'%';
		// and apply colour choices
		applyColourChoice();
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

// pass track-diamond and colour-banner to dragElement
dragElement(document.getElementById('track-diamond'));
dragElement(document.getElementById('colour-banner'));

/////////////// RESIZE SCRIPT /////////////////

// 500ms after last resize action run refreshColourFields()
// this is because the background gradient should strech whole width in mobile
// but only from 20-80% in desktop. So update the colour of pages.
var refreshAfterTime;
window.onresize = function(){
	clearTimeout(refreshAfterTime);
	refreshAfterTime = setTimeout(refreshColourFields, 500);
};

/////////////// COOKIES SCRIPT /////////////////

function setCookie(name,value,days=0) {
	if (name=='users_cookie_choice' || getCookie('users_cookie_choice')=='accept'){
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	}
}
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(name) {   
	document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function clearAllCookies(){
	document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

//////////////// MAIN SCRIPT //////////////////

// JS self-evidently has loaded so remove hide and no-js-class classes
$('.hide').removeClass('hide');
$('.no-js-class').removeClass('no-js-class');

// define cols, split and hex/rgb encoding on init page load
var cols =  ['#60c36f','#5382c9'];
var split = 0.5;
var colour_encode = 'hex';

// can switch encoding (or is there an animation ongoing)
var can_encode_switch = true;

// blended colour_choice between cols[0] and cols[1] at split.
// starts undefined, is defined in applyColourChoice();
var colour_choice;

// commonly accessed html elements below
let c1 = $('#col1');
let c2 = $('#col2');
let c1_picker = $('#col1_picker');
let c2_picker = $('#col2_picker');
let spl = $('#split')

// init banner text colour
var colour_banner_mode = 'light';

// flags for if burger has been clicked and if in transition
var burger = false;
var burger_transition = false;

// flags for if sub content is out and if in transition
var sub_content = false;
var sub_content_transition = false;

// cookie accepted policy
var cookie_choice;
if (getCookie('users_cookie_choice')==null) cookie_choice = 'reject';
else cookie_choice = getCookie('users_cookie_choice');

// slide cookie popup from the right
if (cookie_choice == 'reject') $('#cookies').delay(1000).animate({'right':'33px'},300);

// if focus leaves colour input text boxes then parse the input
c1.focusout(function(){colourTextInputEntered(c1,c1_picker,0);});
c2.focusout(function(){colourTextInputEntered(c2,c2_picker,1);});

// if key enter (13) is pressed in either colour input box then parse input
c1.keypress(function (e) {
	if (e.which == 13) {
		colourTextInputEntered(c1,c1_picker,0);
		// blur loses focus
		c1.blur();
		return false;
	}
});
c2.keypress(function (e) {
	if (e.which == 13) {
		colourTextInputEntered(c2,c2_picker,1);
		// blur loses focus
		c2.blur();
		return false;
	}
});

// double click on either colour input text box sets value with current colour
// (so that the colour code can be edited/copied etc...)
c1.dblclick(function() {c1.val(cols[0]);});
c2.dblclick(function() {c2.val(cols[1]);});

// if input colour picker for either colour
c1_picker.on('input',function(){
	// if hex, since colour picker has hex values then set cols[0] to be picker value
	if (colour_encode=='hex') cols[0] = c1_picker.val();
	// if rgb, then must convert picker value to rgb first 
	else if (colour_encode=='rgb') cols[0] = hexToRgbStr(c1_picker.val());
	// then update text input
	c1.val(cols[0]);
	// and refresh colour fields
	refreshColourFields();
});
// same comments above on func below (this is RHS colour)
c2_picker.on('input',function(){
	if (colour_encode=='hex') cols[1] = c2_picker.val();
	else if (colour_encode=='rgb') cols[1] = hexToRgbStr(c2_picker.val());
	c2.val(cols[1]);
	refreshColourFields();
});

// if lost focus on split number input then parse input
spl.focusout(function(){numberSplitInputEntered(spl);});
// if enter (key 13) pressed parse input
spl.keypress(function (e) {
	if (e.which == 13) {
		numberSplitInputEntered(spl);
		spl.blur();
		return false;
	}
});
// if double click then make split the value (for ability to edit)
spl.dblclick(function() {spl.val(split*100);});

// copy to clipboard function, parameters
//  - selector for element containing text to copy,
//  - selector for btn that triggers event
//  - selector for element of corresponding tooltip span
//  - boolean for whether to replace semi colons with newlines
function copyToClipboard(copyfrom,btn,tooltipspan,semicolontonewline){
		$(btn).click(function(){
			if (!semicolontonewline) navigator.clipboard.writeText($(copyfrom).text());
			else navigator.clipboard.writeText($(copyfrom).text().replace(/;/g,';\n'));
			$(tooltipspan).html('Copied!');
		});
		$(btn).mouseleave(function(){$(tooltipspan).html('Copy to Clipboard');});
}

// copy to clipboard in 4 places in site.
// - on banner for blended colour code
// - on css page for blended colour code
// - on gradient for standard linear gradient
// - on gradient for max compatability gradient
copyToClipboard('#colour-result','#copy-btn','#copy-btn .tooltiptext span',false);
copyToClipboard('#css-colour .code-css','#copy-css-btn','#copy-css-btn .tooltiptext span',false);
copyToClipboard('#modern-gradient .code-css','#copy-gradient-btn','#copy-gradient-btn .tooltiptext span',false);
copyToClipboard('#max-comp-gradient .code-css','#copy-gradient-max-comp-btn','#copy-gradient-max-comp-btn .tooltiptext span',true);

// if click burger
$('#burger').click(function(){
	if (burger_transition==false && sub_content_transition==false){
		// so long as other transitions aren't occuring
		// if burger has already been clicked and sub content is open
		if (burger && sub_content){
			// jquery animate opacity to 0 the sec content
			$('#sec-content').animate({opacity: 0}, 200, function(){
				// when done remove show-sec classes (since no longer shown)
				$('#central-content').removeClass('show-sec');
				$('#sidebar').removeClass('show-sec');
				// then bring main content back to full opacity
				$('#main-content').animate({opacity: 1}, 200,function(){
					sub_content = false;
				});
			});
		}
		// burger line rotation and opacity variables
		var rot_deg = 40;
		var opac = 0;
		if (burger==true){
			rot_deg = 0;
			opac = 1;
		}
		burger_transition = true;
		
		// toggle sidebar opacity with jquery animate
		$('#sidebar-inner').animate({opacity: 1-opac}, 300);
		
		// if burger not clicked before then add class sidebar open
		if (!burger) $('#sidebar').addClass('sidebar-open');
		// toggle opacity of sidebar content
		$('#sidebar-content').animate({opacity: 1-opac}, 300, function(){
			// if clicked before then remove sidebar open (since just closed sidebar)
			if (burger) $('#sidebar').removeClass('sidebar-open');
		});
		
		// rotate top burger line to rot_deg (defined as 40 or 0 depending on opening or closing)
		$('#burger-line1').animate({deg: rot_deg}, {
			duration:400,
			step: function(now) {
				// by using this css transform of translating up/down at same time as rotating
				$('#burger-line1').css({
					transform: 'translate(-20px, '+(12*(now/40)-13).toString()+'px) rotate(' + now + 'deg)'
				});
			}
		});
		// if not clicked burger before then fade middle line to 0
		// otherwise animate to 1 (delay to wait once rotation of other two lines sufficiently advanced such that the lines don't appear to intersect)
		if (!burger)
			$('#burger-line2').animate({opacity: opac}, 200);
		else
			$('#burger-line2').stop(true, true).delay(200).animate({opacity: opac}, 200);
		// rotate bottom burger line to -rot_deg (defined to be -40 or 0 depending on opening or closing)
		$('#burger-line3').animate({deg: -rot_deg}, {
			duration: 400,
			step: function(now) {
				// by using this css transform of translating up/down at same time as rotating
				$('#burger-line3').css({
					transform: 'translate(-20px, '+(12*(now/40)-13).toString()+'px) rotate(' + now + 'deg)'
				});
			},
		}).promise().done(function () {
			// once burger transition is complete set transition flag to false
			burger_transition = false;
			// and toggle burger flag (so burger flag is mod 2)
			burger = !burger;
		});
	}
});

// on mouse up (similar to release from click) on the hex/rgb switch
$("#hexrgb-switch").on("mouseup", ()=>{
	// if we can switch encoding (ie. no ongoing transitions)
	if (can_encode_switch){
		switch (colour_encode) {
			case "hex": 
				// switch to rgb
				can_encode_switch = false;
				switchToRgb();
				// refresh page colours
				refreshColourFields();
				break;
			case "rgb":
				// switch to hex
				can_encode_switch = false;
				switchToHex();
				// refresh page colours
				refreshColourFields();
				break;
		}
	}
});

// if a sidebar button is clicked
$('.sidebar-btn').click(function(){
	// if sub content not shown and not in transition
	if (sub_content==false && sub_content_transition==false){
		// set flag for transition as about to animate
		sub_content_transition = true;
		// jquery animate main content opacity to 0
		$('#main-content').animate({opacity: 0}, 200, function(){
			// add classes show-sec to inherit sec styles
			$('#central-content').addClass('show-sec');
			$('#sidebar').addClass('show-sec');
			// jquery animate sec content opacity to 1
			$('#sec-content').animate({opacity: 1}, 200, function(){
				// once finished set sub content flag to true
				sub_content = true;
				// and transition flag to false
				sub_content_transition = false;
			});
		});
	}
});

// function to display none to all sec pages
function displayNoneSecContent(){
	$('#showcss-content').css('display','none');
	$('#gradient-content').css('display','none');
	$('#about-content').css('display','none');
	$('#privacy-content').css('display','none');
	$('#donate-content').css('display','none');
}

// if showcss button clicked
$('#showcss-btn').click(function(){
	// rebuild colour code snippet (since blended colour_choice can change without updating build code)
	showcssBuildCode();
	// then set the #showcss-content element display block and others display none
	displayNoneSecContent();
	$('#showcss-content').css('display','block');
});
$('#gradient-btn').click(function(){
	// set the #gradient-content element display block and others display none
	displayNoneSecContent();
	$('#gradient-content').css('display','block');
});
$('#about-btn').click(function(){
	// set the #about-content element display block and others display none
	displayNoneSecContent();
	$('#about-content').css('display','block');
});
$('#privacy-btn').click(function(){
	// set the #privacy-content element display block and others display none
	displayNoneSecContent();
	$('#privacy-content').css('display','block');
});
$('#donate-btn').click(function(){
	// set the #privacy-content element display block and others display none
	displayNoneSecContent();
	$('#donate-content').css('display','block');
});

$('.cookies-choice').click(function(){ 
	$('#cookies').animate({'right':'-40px'},150);
});
$('#cookies-yes').click(function(){
	cookie_choice = 'accept';
	setCookie('users_cookie_choice',cookie_choice,1);
});
$('#cookies-x').click(function(){ 
	clearAllCookies();
});

// on init refresh the colour fields, and build the css and gradient code snippets
refreshColourFields();
showcssBuildCode();
gradientBuildCode();