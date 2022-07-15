/////////// COLOUR FUNCTIONS SCRIPT ///////////

// apply colour choice updates text boxes, track etc...
function applyColourChoice() {
	applyColourChoiceBase();
	// reposition the colour banner horizontally for desktop (overwritten in media query for <700px)
	$('#colour-banner').css({'left':(20+60*split).toString()+'%'});
	// colour the background of banner with blended colour choice
	$('#colour-banner').css({'background':colour_choice});
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
			if (colour_encode=='rgb') fullSwitchToHex();
			else if (colour_encode=='hex') fullSwitchToRgb();
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
			$('#showcss .code-css').html(
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
			$('#showcss .code-css').html(
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
	$('#gradient #modern-gradient .code-css').html(
		lineargradient
	);
	// for max compatability include all of them.
	$('#gradient #max-comp-gradient .code-css').html(
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
if (cookie_choice == 'reject') {
	$('#cookies').velocity({
		'right':'33px'
	},{
		duration:300,
		easing:"linear",
		delay:2000,
	}).velocity({opacity:0.75,tween:[0.75,0.5]},{
		duration: 400,
		progress: function(elements, percentComplete, remaining, tweenValue, activeCall) {
			$(this).css('transform','translateY(-50%) rotate('+30*(4)*(tweenValue-0.5)+'deg)');
		},
		easing:"easeOutQuad",
	}).velocity({opacity:1,tween:[1,0.75]},{
		duration: 400,
		progress: function(elements, percentComplete, remaining, tweenValue, activeCall) {
			$(this).css('transform','translateY(-50%) rotate('+(30*(1-(4)*(tweenValue-0.75)))+'deg)');
		},
		easing: "easeInOutQuad",
		complete: function(elements, activeCall){
			$(this).css("box-shadow", "0px 0px 80px 20px rgba(22,27,37,0.25)");
		}
	});
}

// if focus leaves colour input text boxes then parse the input
c1.focusout(function(){colourTextInputEntered(c1,c1_picker,0);});
c2.focusout(function(){colourTextInputEntered(c2,c2_picker,1);});

// if key enter (13) is pressed in either colour input box then parse input
function loseFocusOnEnter(e,el){
	if (e.which == 13) {
		// blur loses focus
		el.blur();
		return false;
	}
}
c1.keypress(function (e) {loseFocusOnEnter(e,c1);});
c2.keypress(function (e) {loseFocusOnEnter(e,c2);});

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
spl.keypress(function (e) {loseFocusOnEnter(e,spl);});
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
	sidebar();
	if (burger==true) 
		history.pushState(null, '', urlWithPageParam('http://localhost:5000','home'));
});


// if a sidebar button is clicked
function sidebar_btn(){
	// if sub content not shown and not in transition
	if (sub_content==false && sub_content_transition==false){
		// set flag for transition as about to animate
		sub_content_transition = true;
		// jquery animate main content opacity to 0
		$('#main-content').velocity({opacity: 0}, 200, function(){
			// add classes show-sec to inherit sec styles
			$('body').addClass('show-sec');
			// jquery animate sec content opacity to 1
			$('#sec-content').velocity({opacity: 1}, 200, function(){
				// once finished set sub content flag to true
				sub_content = true;
				// and transition flag to false
				sub_content_transition = false;
			});
		});
	}
}
// if a sidebar button is clicked
$('.sidebar-btn-js').click(function(){
	sidebar_btn();
});

// function to display none to all sec pages
function displayNoneSecContent(){
	$('#showcss').css('display','none');
	$('#gradient').css('display','none');
	$('#about').css('display','none');
	$('#privacy').css('display','none');
	// $('#donate-content').css('display','none');
	$('.sec-active').removeClass('sec-active');
}
function homePage(){
	displayNoneSecContent();
	sidebar();
	history.pushState(null, '', urlWithPageParam('http://localhost:5000','home'));
}
function aboutPage(){
	history.pushState(null, '', urlWithPageParam('http://localhost:5000','about'));
	// set the #about element display block and others display none
	displayNoneSecContent();
	$('#about').css('display','block');
	$('#about-btn').addClass('sec-active');
}
function showcssPage(){
	history.pushState(null, '', urlWithPageParam('http://localhost:5000','showcss'));
	// rebuild colour code snippet (since blended colour_choice can change without updating build code)
	showcssBuildCode();
	// then set the #showcss element display block and others display none
	displayNoneSecContent();
	$('#showcss').css('display','block');
	$('#showcss-btn').addClass('sec-active');
}
function gradientPage(){
	history.pushState(null, '', urlWithPageParam('http://localhost:5000','gradient'));
	// set the #gradient element display block and others display none
	displayNoneSecContent();
	$('#gradient').css('display','block');
	$('#gradient-btn').addClass('sec-active');
}
function privacyPage(){
	history.pushState(null, '', urlWithPageParam('http://localhost:5000','privacy'));
	// set the #privacy element display block and others display none
	displayNoneSecContent();
	$('#privacy').css('display','block');
	$('#privacy-btn').addClass('sec-active');
}
function donatePage(){
	window.location.href = urlRedirectWithParams('http://localhost:5000/coffee');
}
// if showcss button clicked
$('#home-btn').click(function(){homePage();});
$('#showcss-btn').click(function(){showcssPage();});
$('#gradient-btn').click(function(){gradientPage();});
$('#about-btn').click(function(){aboutPage();});
$('#privacy-btn').click(function(){privacyPage();});
$('#donate-btn').click(function(){donatePage();});

$('#cookies-yes').click(function(){
	$('#cookies').velocity({'right':'-40px'},150);
	cookie_choice = 'accept';
	setCookie('users_cookie_choice',cookie_choice,1);
});
$('#cookies-i').click(function(){
	sidebar();
	sidebar_btn();
	privacyPage();
});
$('#cookies-x').click(function(){
	$('#cookies').velocity({'right':'-40px'},150);
	clearAllCookies();
});

function subPageOpenOnLoad(){
	sidebar();
	// check if should immediately direct to page coffee:
	$('body').addClass('show-sec');
	$('body').addClass('sidebar-open');
	$('#sidebar-content').css('opacity',1);
	$('#sec-content').css('opacity',1);
	displayNoneSecContent();
}
switch (page) {
	case 'about':
		subPageOpenOnLoad();
		$('#about').css('display','block');
		$('#about-btn').addClass('sec-active');
		break;
	case 'showcss':
		subPageOpenOnLoad();
		$('#showcss').css('display','block');
		$('#showcss-btn').addClass('sec-active');
		break;
	case 'gradient':
		subPageOpenOnLoad();
		$('#gradient').css('display','block');
		$('#gradient-btn').addClass('sec-active');
		break;
	case 'privacy':
		subPageOpenOnLoad();
		$('#privacy').css('display','block');
		$('#privacy-btn').addClass('sec-active');
		break;
}

// on init refresh the colour fields, and build the css and gradient code snippets
refreshColourFields();
showcssBuildCode();
gradientBuildCode();