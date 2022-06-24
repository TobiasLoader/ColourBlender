
function applyGradient() {
	$('body').css({'background':'linear-gradient(90deg, '+cols[0]+' 20%, '+cols[1]+' 80%)'});
	$('#sidebar-content').css({'background':cols[1]});
	applyColourChoice();
}
function applyColourChoice() {
	colour_choice = basicBlendHEX(cols[0],cols[1],split);
	$('#colour-banner').css({'left':(20+60*split).toString()+'%'});
	$('#colour-banner').css({'background':colour_choice});
	$('#sub-content-box').css({'background':colour_choice});
	$('#track-diamond').css({
		'background':colour_choice,
		'left':(100*split).toString()+'%',
	});
	$('#colour-result').html(colour_choice);
	$('#split').val(parseInt(100*split).toString());
	lightDarkCheckTitle();
	lightDarkCheckSidebar();
	lightDarkCheckBanner();
}


function extractBrightnessHEX(hex){
	var rgb = parseInt(hex.substring(1), 16);   // convert rrggbb to decimal
	var r = (rgb >> 16) & 0xff;  // extract red
	var g = (rgb >>  8) & 0xff;  // extract green
	var b = (rgb >>  0) & 0xff;  // extract blue
	return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
}
function extractBrightnessRGB(rgb){
	return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // per ITU-R BT.709
}

function lightDarkCheckBanner(){
	let b = extractBrightnessHEX(colour_choice);
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

function lightDarkCheckTitle(){
	let b = extractBrightnessHEX(cols[0]);
	if (b>=185){
		$('#title').removeClass('light-title');
		$('#title').addClass('dark-title');
	} else if (b<185){
		$('#title').removeClass('dark-title');
		$('#title').addClass('light-title');
	}
}
function lightDarkCheckSidebar(){
	let b = extractBrightnessHEX(cols[1]);
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

function colourTextInputEntered(el,el_picker,i){
	let vhex = verifyFormatHex(el.val());
	if (vhex){
		cols[i] = vhex;
		if (cols[i][0]!='#') cols[i] = '#'+cols[i];
		el.val(cols[i]);
		el_picker.val(cols[i]);
		applyGradient();
	} else {
		el.attr('placeholder',cols[i]);
		el.val('');
	}
}

