////////// COLOUR CONVERSION SCRIPT ///////////

/// RGB String: rgb(1,2,3)
/// RGB Array : [1,2,3]
/// HEX String: #010203

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

function hexToRgbStr(hex) {
	return arrayRGBtoStrRGB(hexToRgbArray(hex));
}
function rgbStrToHex(rgb) {
	return rgbArrayToHex(strRGBtoArrayRGB(rgb));
}

function blendHEX(hex1,hex2,split){
	return rgbArrayToHex(blendRGB(hexToRgbArray(hex1),hexToRgbArray(hex2),split));
}
function blendRGB(rgb1_array,rgb2_array,split){
	return Array.from({length: 3}, (_, i) => parseInt(rgb1_array[i]*(1-split)+rgb2_array[i]*split));
}
function blendStrRGB(rgb1_str,rgb2_str,split){
	return arrayRGBtoStrRGB(blendRGB(strRGBtoArrayRGB(rgb1_str),strRGBtoArrayRGB(rgb2_str),split));
}

/////////// COLOUR FUNCTIONS SCRIPT ///////////

function refreshColourFields() {
	var p1 = 20;
	var p2 = 80;
	if (window.innerWidth<700){
		p1 = 0;
		p2 = 100;
	}
	let bg_styles = [
		'background: rgb(50,50,50)',
		'background: -moz-linear-gradient(0deg, '+cols[0]+' '+p1+'%, '+cols[1]+' '+p2+'%)',
		'background: -webkit-linear-gradient(0deg, '+cols[0]+' '+p1+'%, '+cols[1]+' '+p2+'%)',
		'background: linear-gradient(90deg, '+cols[0]+' '+p1+'%, '+cols[1]+' '+p2+'%)',      
		'filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="'+cols[0]+'", endColorstr="'+cols[1]+'", GradientType=1)'
	].join(';');
	$('body').attr('style', bg_styles);
	$('#sidebar-content').css({'background':cols[1]});
	applyColourChoice();
}
function applyColourChoice() {
	if (colour_encode=='hex')
		colour_choice = blendHEX(cols[0],cols[1],split);
	else if (colour_encode=='rgb')
		colour_choice = blendStrRGB(cols[0],cols[1],split);
	$('#colour-banner').css({'left':(20+60*split).toString()+'%'});
	$('#colour-banner').css({'background':colour_choice});
	$('#sub-content-box').css({'background':colour_choice});
	$('#track-diamond').css({
		'background':colour_choice,
		'left':(100*split).toString()+'%',
	});
	$('#colour-result').html(colour_choice);
	$('#split').attr('placeholder',parseInt(100*split));
	$('#splitt').val('');
	for (var i=0; i<2; i+=1){
		$('#col'+(i+1).toString()).attr('placeholder',cols[i]);
		$('#col'+(i+1).toString()).val('');
		if (colour_encode=='rgb') $('#col'+(i+1).toString()+'_picker').val(rgbStrToHex(cols[i]));
		else if (colour_encode=='hex') $('#col'+(i+1).toString()+'_picker').val(cols[i]);
	}
	lightDarkCheckTitle();
	lightDarkCheckSidebar();
	lightDarkCheckBanner();
	belowDarkCheck();
}

function switchToHex(){
	colour_encode = 'hex';
	$('body').removeClass('rgb');
	$('body').addClass('hex');
	$(".sliderbox").animate({"left":"10"},200,function () {can_encode_switch = true;});
	cols = cols.map(rgb => rgbStrToHex(rgb));
	colour_choice = rgbStrToHex(colour_choice);
	showcssBuildCode();
	gradientBuildCode();
}

function switchToRgb(){
	colour_encode = 'rgb';
	$('body').removeClass('hex');
	$('body').addClass('rgb');
	$(".sliderbox").animate({"left":"70"},200,function (){can_encode_switch = true;});
	cols = cols.map(hex => hexToRgbStr(hex));
	colour_choice = hexToRgbStr(colour_choice);
	showcssBuildCode();
	gradientBuildCode();
}

function extractBrightnessHEX(hex){
	var rgb = parseInt(hex.substring(1), 16);   // convert rrggbb to decimal
	var r = (rgb >> 16) & 0xff;  // extract red
	var g = (rgb >>  8) & 0xff;  // extract green
	var b = (rgb >>  0) & 0xff;  // extract blue
	return extractBrightnessRGBArray([r,g,b]);
}
function extractBrightnessRGBArray(rgb_array){
	return 0.2126 * rgb_array[0] + 0.7152 * rgb_array[1] + 0.0722 * rgb_array[2]; // per ITU-R BT.709
}
function extractBrightnessCol(col){
	if (colour_encode=='hex')
		return extractBrightnessHEX(col);
	else if (colour_encode=='rgb')
		return extractBrightnessRGBArray(strRGBtoArrayRGB(col));
	return 0;
}

function lightDarkCheckBanner(){
	let b = extractBrightnessCol(colour_choice);
	if (colour_banner_mode=='light' && b>187){
		$('#central-content').removeClass("light-mode");
		$('#central-content').addClass("dark-mode");
		colour_banner_mode = 'dark';
		$('.colour-output img').attr('src','assets/dark-clipboard-copy.svg');
	}
	else if (colour_banner_mode=='dark' && b<183){
		$('#central-content').removeClass("dark-mode");
		$('#central-content').addClass("light-mode");
		colour_banner_mode = 'light';
		$('.colour-output img').attr('src','assets/light-clipboard-copy.svg');
	}
}

function belowDarkCheck(){
	let b = extractBrightnessCol(colour_choice);
	if (b<100){
		$('.code-snippet').css('border','rgb(100,100,100) 1px solid');
	} else {
		$('.code-snippet').css('border','none');
	}
}

function lightDarkCheckTitle(){
	let b = extractBrightnessCol(cols[0]);
	if (b>=185){
		$('#title').removeClass('light-title');
		$('#title').addClass('dark-title');
	} else if (b<185){
		$('#title').removeClass('dark-title');
		$('#title').addClass('light-title');
	}
}
function lightDarkCheckSidebar(){
	let b = extractBrightnessCol(cols[1]);
	if (b>=185){
		$('#sidebar').removeClass('light-sidebar');
		$('#sidebar').addClass('dark-sidebar');
	} else if (b<185){
		$('#sidebar').removeClass('dark-sidebar');
		$('#sidebar').addClass('light-sidebar');
	}
}

function verifyFormatHex(hex) {
	if (hex.length==7 && hex[0]=='#'){
		for (var i=1; i<7; i+=1){
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
		return hex;
	} else if (hex.length==6){
		for (var i=0; i<6; i+=1){
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
		return '#'+hex;
	} else if (hex.length==4 && hex[0]=='#'){
		for (var i=1; i<4; i+=1){
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
		return '#'+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
	} else if (hex.length==3){
		for (var i=0; i<3; i+=1){
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
		return '#'+hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	} else {
		return false;
	}
}

function verifyFormatRGB(rgbstr) {
	let rgb = rgbstr.replace(/(\s+)|(,)/g, '&').replace(/[^0-9,&]/g,'').split('&').filter(s => (s!='')).map(s => parseInt(s)).filter(i => (i!=undefined && i>=0 && i<= 255));
	if (rgb.length == 3){
		return 'rgb('+rgb[0].toString()+','+rgb[1].toString()+','+rgb[2].toString()+')';
	} else {
		return false;
	}
}

function verifyFormatCol(colstr){
	if (colour_encode=='hex')
		return verifyFormatHex(colstr);
	else if (colour_encode=='rgb')
		return verifyFormatRGB(colstr);
	else return false;
}
function verifyOtherFormatCol(colstr){
	if (colour_encode=='rgb')
		return verifyFormatHex(colstr);
	else if (colour_encode=='hex')
		return verifyFormatRGB(colstr);
	else return false;
}

function colourTextInputEntered(el,el_picker,i){
	let veri_col = verifyFormatCol(el.val());
	if (veri_col){
		cols[i] = veri_col;
		refreshColourFields();
	} else {
		let other_veri_col = verifyOtherFormatCol(el.val());
		if (other_veri_col) {
			if (colour_encode=='rgb') switchToHex();
			else if (colour_encode=='hex') switchToRgb();
			cols[i] = other_veri_col;
			refreshColourFields();
		}
		else {
			el.attr('placeholder',cols[i]);
			el.val('');
		}
	}
}

function numberSplitInputEntered(el){
	let valentered = parseInt(el.val());
	if (valentered!=undefined && valentered>=0 && valentered<=100){
		split = valentered/100;
		applyColourChoice();
		el.attr('placeholder',parseInt(split*100));
		el.val('');
	} else {
		el.attr('placeholder',parseInt(split*100));
		el.val('');
	}
}

//////////// CODE SNIPPETS SCRIPT /////////////

function echoHTML(pairs){
	s = "";
	for (var p of pairs){
		s += "<span class='"+p[0]+"'>"+p[1]+"</span>";
	}
	return s;
}

function showcssBuildCode() {
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

function gradientBuildCode() {
	var solid;
	var mozlineargradient;
	var webkitlineargradient;
	var lineargradient;
	var filter;
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
	$('#gradient-content #modern-gradient .code-css').html(
		lineargradient
	);
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

function dragElement(elmnt) {
	var clickdragoffset = 0;
	elmnt.onmousedown = dragMouseDown;
	function dragMouseDown(e) {
		e = e || window.event;
		if(e.target !== this)
		return;
		// e.preventDefault();
		clickdragoffset = e.clientX-$(window).width()*(0.2+split*0.6);
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
		$('#colour-banner').addClass('moving');
		$('#track-diamond').addClass('moving');
	}
	function elementDrag(e) {
		e.preventDefault();
		// calculate the new split:
		let p = (e.clientX-clickdragoffset-0.2*$(window).width())/(0.6*$(window).width());
		if (p<0) p=0;
		if (p>1) p=1;
		split = p;
		elmnt.style.left = 100*split+'%';
		applyColourChoice();
	}
	function closeDragElement() {
		$('#colour-banner').removeClass('moving');
		$('#track-diamond').removeClass('moving');
		clickdragoffset = 0;
		split = parseInt(100*split)/100;
		elmnt.style.left = 100*split+'%';
		applyColourChoice();
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

dragElement(document.getElementById('track-diamond'));
dragElement(document.getElementById('colour-banner'));

/////////////// RESIZE SCRIPT /////////////////

var refreshAfterTime;
window.onresize = function(){
	clearTimeout(refreshAfterTime);
	refreshAfterTime = setTimeout(refreshColourFields, 500);
};

//////////////// MAIN SCRIPT //////////////////

$('.hide').removeClass('hide');
$('.no-js-class').removeClass('no-js-class');

var cols =  ['#60c36f','#5382c9'];
var split = 0.5;
var colour_encode = 'hex';
var can_encode_switch = true;

var colour_choice;

let c1 = $('#col1');
let c2 = $('#col2');
let c1_picker = $('#col1_picker');
let c2_picker = $('#col2_picker');

let spl = $('#split')

var colour_banner_mode = 'light';

let hex_chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

var burger = false;
var burger_transition = false;

var sub_content = false;
var sub_content_transition = false;

c1.focusout(function(){colourTextInputEntered(c1,c1_picker,0);});
c2.focusout(function(){colourTextInputEntered(c2,c2_picker,1);});

c1.keypress(function (e) {
	if (e.which == 13) {
		colourTextInputEntered(c1,c1_picker,0);
		c1.blur();
		return false;
	}
});
c2.keypress(function (e) {
	if (e.which == 13) {
		colourTextInputEntered(c2,c2_picker,1);
		c2.blur();
		return false;
	}
});

c1.dblclick(function() {c1.val(cols[0]);});
c2.dblclick(function() {c2.val(cols[1]);});

c1_picker.on('input',function(){
	if (colour_encode=='hex') cols[0] = c1_picker.val();
	else if (colour_encode=='rgb') cols[0] = hexToRgbStr(c1_picker.val());
	c1.val(cols[0]);
	refreshColourFields();
});
c2_picker.on('input',function(){
	if (colour_encode=='hex') cols[1] = c2_picker.val();
	else if (colour_encode=='rgb') cols[1] = hexToRgbStr(c2_picker.val());
	c2.val(cols[1]);
	refreshColourFields();
});

spl.focusout(function(){numberSplitInputEntered(spl);});
spl.keypress(function (e) {
	if (e.which == 13) {
		numberSplitInputEntered(spl);
		spl.blur();
		return false;
	}
});
spl.dblclick(function() {spl.val(split*100);});


$('#copy-btn').click(function(){
	navigator.clipboard.writeText(colour_choice);
	$('#copy-btn .tooltiptext span').html('Copied!');
});
$('#copy-btn').mouseleave(function(){$('#copy-btn .tooltiptext span').html('Copy to Clipboard');});

$('#copy-css-btn').click(function(){
	navigator.clipboard.writeText($('#css-colour .code-css').text());
	$('#copy-css-btn .tooltiptext span').html('Copied!');
});
$('#copy-css-btn').mouseleave(function(){$('#copy-css-btn .tooltiptext span').html('Copy to Clipboard');});

$('#copy-gradient-btn').click(function(){
	navigator.clipboard.writeText($('#modern-gradient .code-css').text());
	$('#copy-gradient-btn .tooltiptext span').html('Copied!');
});
$('#copy-gradient-btn').mouseleave(function(){$('#copy-gradient-btn .tooltiptext span').html('Copy to Clipboard');});

$('#copy-gradient-max-comp-btn').click(function(){
	navigator.clipboard.writeText($('#max-comp-gradient .code-css').text().replace(/;/g,';\n'));
	$('#copy-gradient-max-comp-btn .tooltiptext span').html('Copied!');
});
$('#copy-gradient-max-comp-btn').mouseleave(function(){$('#copy-gradient-max-comp-btn .tooltiptext span').html('Copy to Clipboard');});

$('#burger').click(function(){
	if (burger_transition==false && sub_content_transition==false){
		if (burger && sub_content){
			$('#sec-content').animate({opacity: 0}, 200, function(){
				$('#central-content').removeClass('show-sec');
				$('#sidebar').removeClass('show-sec');
				$('#main-content').animate({opacity: 1}, 200,function(){
					sub_content = false;
				});
			});
		}			
		var rot_deg = 40;
		var opac = 0;
		if (burger==true){
			rot_deg = 0;
			opac = 1;
		}
		burger_transition = true;
		
		$('#sidebar-inner').animate({opacity: 1-opac}, 300);


		if (!burger) $('#sidebar').addClass('sidebar-open');
		$('#sidebar-content').animate({opacity: 1-opac}, 300, function(){
			if (burger) $('#sidebar').removeClass('sidebar-open');
		});
		
		$('#burger-line1').animate({deg: rot_deg}, {
			duration:400,
			step: function(now) {
				$('#burger-line1').css({
					transform: 'translate(-20px, '+(12*(now/40)-13).toString()+'px) rotate(' + now + 'deg)'
				});
			}
		});
		if (!burger)
			$('#burger-line2').animate({opacity: opac}, 200);
		else
			$('#burger-line2').stop(true, true).delay(200).animate({opacity: opac}, 200);
		$('#burger-line3').animate({deg: -rot_deg}, {
			duration: 400,
			step: function(now) {
				$('#burger-line3').css({
					transform: 'translate(-20px, '+(12*(now/40)-13).toString()+'px) rotate(' + now + 'deg)'
				});
			},
		}).promise().done(function () {
			burger_transition = false;
			burger = !burger;
		});
	}
});


$("#hexrgb-switch").on("mouseup", ()=>{
	if (can_encode_switch){
		switch (colour_encode) {
			case "hex": 
				can_encode_switch = false;
				switchToRgb();
				refreshColourFields();
				break;
			case "rgb":
				can_encode_switch = false;
				switchToHex();
				refreshColourFields();
				break;
		}
	}
});

$('#showcss-btn, #gradient-btn, #info-btn').click(function(){
	if (sub_content==false && sub_content_transition==false){
		sub_content_transition = true;
		$('#main-content').animate({opacity: 0}, 200, function(){
			$('#central-content').addClass('show-sec');
			$('#sidebar').addClass('show-sec');
			$('#sec-content').animate({opacity: 1}, 200, function(){
				sub_content = true;
				sub_content_transition = false;
			});
		});
	}
});

$('#showcss-btn').click(function(){
	showcssBuildCode();
	$('#showcss-content').css('display','block');
	$('#gradient-content').css('display','none');
	$('#info-content').css('display','none');
});
$('#gradient-btn').click(function(){
	$('#showcss-content').css('display','none');
	$('#gradient-content').css('display','block');
	$('#info-content').css('display','none');
});
$('#info-btn').click(function(){
	$('#showcss-content').css('display','none');
	$('#gradient-content').css('display','none');
	$('#info-content').css('display','block');
});

refreshColourFields();
showcssBuildCode();
gradientBuildCode();