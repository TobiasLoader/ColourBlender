
function refreshColourFields() {
	// $('body').css({'background':'linear-gradient(90deg, '+cols[0]+' 20%, '+cols[1]+' 80%)'});
	let bg_styles = [
		'background: rgb(50,50,50)',
		'background: -moz-linear-gradient(0deg, '+cols[0]+' 20%, '+cols[1]+' 80%)',
		'background: -webkit-linear-gradient(0deg, '+cols[0]+' 20%, '+cols[1]+' 80%)',
		'background: linear-gradient(90deg, '+cols[0]+' 20%, '+cols[1]+' 80%)',      
		'filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="'+cols[0]+'", endColorstr="'+cols[1]+'", GradientType=1)'
	].join(';');
	$('body').attr('style', bg_styles);
	$('#sidebar-content').css({'background':cols[1]});
	applyColourChoice();
	$('.hide').removeClass('hide');
}
function applyColourChoice() {
	if (colour_encode=='hex')
		colour_choice = basicBlendHEX(cols[0],cols[1],split);
	else if (colour_encode=='rgb')
		colour_choice = basicBlendStrRGB(cols[0],cols[1],split);
	$('#colour-banner').css({'left':(20+60*split).toString()+'%'});
	$('#colour-banner').css({'background':colour_choice});
	$('#sub-content-box').css({'background':colour_choice});
	$('#track-diamond').css({
		'background':colour_choice,
		'left':(100*split).toString()+'%',
	});
	$('#colour-result').html(colour_choice);
	$('#split').val(parseInt(100*split).toString());
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
	$('#txt-hex').css({opacity:1});
	$('#txt-rgb').css({opacity:0.5});
	$('.colour-input input').css('font-size','20px');
	$('#colour-result').css('font-size','15px');
	$('.text-box').css({'width':'60%','left':'20%','letter-spacing':'1px'});
	$('body').removeClass('rgb');
	$('body').addClass('hex');
	$("#hexrgb-switch .off").css('opacity', '0');
	$("#hexrgb-switch .on").css('opacity', '1');
	$(".sliderbox").animate({"left":"10"},200,function () {can_encode_switch = true;});
	cols = cols.map(rgb => rgbStrToHex(rgb));
	colour_choice = rgbStrToHex(colour_choice);
	showcssBuildCode();
	gradientBuildCode();
}

function switchToRgb(){
	colour_encode = 'rgb';
	$('#txt-hex').css({opacity:0.5});
	$('#txt-rgb').css({opacity:1});
	$('.colour-input input').css('font-size','15px');
	$('#colour-result').css('font-size','13px');
	$('.text-box').css({'width':'70%','left':'15%','letter-spacing':'0'});
	$('body').removeClass('hex');
	$('body').addClass('rgb');
	$("#hexrgb-switch .on").css('opacity', '0');
	$("#hexrgb-switch .off").css('opacity', '1');
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
		$('.colour-output img').attr('src','dark-clipboard-copy.svg');
	}
	else if (colour_banner_mode=='dark' && b<183){
		$('#central-content').removeClass("dark-mode");
		$('#central-content').addClass("light-mode");
		colour_banner_mode = 'light';
		$('.colour-output img').attr('src','light-clipboard-copy.svg');
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

