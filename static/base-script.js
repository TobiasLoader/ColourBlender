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


// Blend Hex or str RGB colours
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
	$('body, .body-btn').attr('style', bg_styles);
	// colour the sidebar the right hand colour
	$('#sidebar-content').css({'background':cols[1]});
	applyColourChoice();
}

function applyColourChoice() {}
// apply colour choice updates text boxes, track etc...
function applyColourChoiceBase() {
	// depending on colour_encode (hex/rgb) use appropriate blend function
	if (colour_encode=='hex') colour_choice = blendHEX(cols[0],cols[1],split);
	else if (colour_encode=='rgb') colour_choice = blendStrRGB(cols[0],cols[1],split);
	// colour the sub-content-box with blended colour choice
	$('#sub-content-box').css({'background':colour_choice});
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
	$(".sliderbox").velocity({"left":"10px"},200,function () {can_encode_switch = true;});
	// change each stored colour from rgb to hex
	cols = cols.map(rgb => rgbStrToHex(rgb));
}
function fullSwitchToHex(){
	switchToHex();
	// update colour choice from hex to rgb
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
	// velocity sliderbox from hex to rgb
	$(".sliderbox").velocity({"left":"70px"},200,function (){can_encode_switch = true;});
	// change each stored colour from hex to rgb
	cols = cols.map(hex => hexToRgbStr(hex));
}
function fullSwitchToRgb(){
	switchToRgb();
	// update colour choice from hex to rgb
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
		$('body').removeClass("light-mode");
		$('body').addClass("dark-mode");
		// switch out also the clipboard copy svgs
		$('.colour-output img').attr('src','static/assets/dark-clipboard-copy.svg');
	}
	// if dark mode and colour brightness is too dark change text to light
	else if (colour_banner_mode=='dark' && b<183){
		colour_banner_mode = 'light';
		// update the central-content light/dark mode class
		$('body').removeClass("dark-mode");
		$('body').addClass("light-mode");
		// switch out also the clipboard copy svgs
		$('.colour-output img').attr('src','static/assets/light-clipboard-copy.svg');
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
		$('body').removeClass('light-title');
		$('body').addClass('dark-title');
	} else if (b<185){
		$('body').removeClass('dark-title');
		$('body').addClass('light-title');
	}
}
function lightDarkCheckSidebar(){
	// get brightness of RHS colour
	let b = extractBrightnessCol(cols[1]);
	// if bright then make sidebar text dark
	// if dark then make sidebar text light
	if (b>=185){
		$('body').removeClass('light-sidebar');
		$('body').addClass('dark-sidebar');
	} else if (b<185){
		$('body').removeClass('dark-sidebar');
		$('body').addClass('light-sidebar');
	}
}
function belowDarkCheck(){
	// get brightness of blended colour choice
	let b = extractBrightnessCol(colour_choice);
	// if too dark then make special consideration
	if (b<100) $('.code-snippet').css('border','rgb(100,100,100) 1px solid');
	else $('.code-snippet').css('border','none');
}

//////////// CODE SNIPPETS SCRIPT /////////////

function showcssBuildCode(){}
function gradientBuildCode(){}

/////////////// RESIZE SCRIPT /////////////////

// 500ms after last resize action run refreshColourFields()
// this is because the background gradient should strech whole width in mobile
// but only from 20-80% in desktop. So update the colour of pages.
var refreshAfterTime;
window.onresize = function(){
	clearTimeout(refreshAfterTime);
	refreshAfterTime = setTimeout(refreshColourFields, 500);
};

///////// URL Redirect with PARAMETERS ////////

function urlRedirectWithParams(str_url,page){
	var url = new URL(str_url);
	if (colour_encode=='hex'){
		if (cols[0]!='#60c36f') url.searchParams.append('col1',cols[0].substring(1));
		if (cols[1]!='#5382c9') url.searchParams.append('col2',cols[1].substring(1));
	} else if (colour_encode=='rgb'){
		if (cols[0]!='rgb(96,195,111)')
			url.searchParams.append('col1',rgbStrToHex(cols[0]).substring(1));
		if (cols[0]!='rgb(83,130,201)')
			url.searchParams.append('col2',rgbStrToHex(cols[1]).substring(1));
	}
	if(split!=0.5) url.searchParams.append('split',split);
	if(colour_encode!='hex') url.searchParams.append('encode',colour_encode);
	return url.toString();
}
function urlWithPageParam(str_url,page){
	var url = new URL(str_url);
	if (page!=undefined && page!='home' && page!='coffee') url.searchParams.append('page',page);
	return url.toString();
}

//////////////// MAIN SCRIPT //////////////////

// JS self-evidently has loaded so remove hide and no-js-class classes
$('.hide').removeClass('hide');
$('.no-js-class').removeClass('no-js-class');

// define cols, split and hex/rgb encoding on init page load
var colour_encode = flask_data.encode;
var cols = ['#'+flask_data.col1,'#'+flask_data.col2];
var split = flask_data.split;

// can switch encoding (or is there an animation ongoing)
var can_encode_switch = true;

if (colour_encode=='rgb') {
	colour_encode = 'hex';
	switchToRgb();
}

// blended colour_choice between cols[0] and cols[1] at split.
// starts undefined, is defined in applyColourChoice();
var colour_choice;

// init banner text colour
var colour_banner_mode = 'light';

// flags for if burger has been clicked and if in transition
var burger = false;
var burger_transition = false;

// flags for if sub content is out and if in transition
var sub_content = false;
var sub_content_transition = false;

// which page we are on
let page = flask_data.page;

function hexrgbToggle(){
	console.log(cols);
	// if we can switch encoding (ie. no ongoing transitions)
	if (can_encode_switch){
		switch (colour_encode) {
			case "hex": 
				// switch to rgb
				can_encode_switch = false;
				fullSwitchToRgb();
				// refresh page colours
				refreshColourFields();
				break;
			case "rgb":
				// switch to hex
				can_encode_switch = false;
				fullSwitchToHex();
				// refresh page colours
				refreshColourFields();
				break;
		}
	}
}
// on mouse up (similar to release from click) on the hex/rgb switch
$("#hexrgb-switch").on("mouseup", hexrgbToggle);

// if clicked to open/close sidebar
function sidebar(){
	if (burger_transition==false && sub_content_transition==false){
		// so long as other transitions aren't occuring
		// if burger has already been clicked and sub content is open
		if (burger && sub_content){
			// jquery animate opacity to 0 the sec content
			$('#sec-content').velocity({opacity: 0}, 200, function(){
				// when done remove show-sec classes (since no longer shown)
				$('body').removeClass('show-sec');
				// then bring main content back to full opacity
				$('#main-content').velocity({opacity: 1}, 200,function(){
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
		$('#sidebar-inner').velocity({opacity: 1-opac}, 300);
		
		// if burger not clicked before then add class sidebar open
		if (!burger) $('body').addClass('sidebar-open');
		// toggle opacity of sidebar content
		$('#sidebar-content').velocity({opacity: 1-opac}, 300, function(){
			// if clicked before then remove sidebar open (since just closed sidebar)
			if (burger) {
				displayNoneSecContent();
				$('body').removeClass('sidebar-open');
			}
		});
		
		// rotate top burger line to rot_deg (defined as 40 or 0 depending on opening or closing)
		$('#burger-line1').velocity({deg: rot_deg,tween:[rot_deg,40-rot_deg]}, {
			duration:400,
			progress: function(elements, percentComplete, remaining, tweenValue, activeCall) {
				// by using this css transform of translating up/down at same time as rotating
				$('#burger-line1').css({
					transform: 'translate(-20px, '+(12*(tweenValue/40)-13).toString()+'px) rotate(' + tweenValue + 'deg)'
				});
			}
		});
		// if not clicked burger before then fade middle line to 0
		// otherwise animate to 1 (delay to wait once rotation of other two lines sufficiently advanced such that the lines don't appear to intersect)
		if (!burger)
			$('#burger-line2').velocity({opacity: opac}, 200);
		else
			$('#burger-line2').velocity("stop", true).velocity({opacity: opac}, {duration:200,delay:200});
		// rotate bottom burger line to -rot_deg (defined to be -40 or 0 depending on opening or closing)
		$('#burger-line3').velocity({deg: -rot_deg,tween:[-rot_deg,rot_deg-40]}, {
			duration: 400,
			progress: function(elements, percentComplete, remaining, tweenValue, activeCall) {
				// by using this css transform of translating up/down at same time as rotating
				$('#burger-line3').css({
					transform: 'translate(-20px, '+(12*(tweenValue/40)-13).toString()+'px) rotate(' + tweenValue + 'deg)'
				});
			},
			complete:function(elements, activeCall){
				// once burger transition is complete set transition flag to false
				burger_transition = false;
				// and toggle burger flag (so burger flag is mod 2)
				burger = !burger;
			}
		});
	}
}

// if back arrow on mobile sec content clicked
$('#sec-back-arrow').click(function(){
	// if sub content shown and not in transition
	if (sub_content==true && sub_content_transition==false){
		// set flag for transition as about to animate
		sub_content_transition = true;
		// jquery animate sec content opacity to 0
		$('#sec-content').velocity({opacity: 0}, 200, function(){
			// jquery animate main content opacity to 1
			$('#main-content').velocity({opacity: 1}, 200, function(){
				// add classes show-sec to inherit sec styles
				$('body').removeClass('show-sec');
				// once finished set sub content flag to false
				sub_content = false;
				// and transition flag to false
				sub_content_transition = false;
			});
			
		});
		
	}
});