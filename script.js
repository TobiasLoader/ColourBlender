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
	$('#copy-btn .tooltiptext p').html('Copied!');
});
$('#copy-btn').mouseleave(function(){$('#copy-btn .tooltiptext p').html('Copy to Clipboard');});

$('#copy-css-btn').click(function(){
	navigator.clipboard.writeText($('#css-colour .code-css').text());
	$('#copy-css-btn .tooltiptext p').html('Copied!');
});
$('#copy-css-btn').mouseleave(function(){$('#copy-css-btn .tooltiptext p').html('Copy to Clipboard');});

$('#copy-gradient-btn').click(function(){
	navigator.clipboard.writeText($('#modern-gradient .code-css').text());
	$('#copy-gradient-btn .tooltiptext p').html('Copied!');
});
$('#copy-gradient-btn').mouseleave(function(){$('#copy-gradient-btn .tooltiptext p').html('Copy to Clipboard');});

$('#copy-gradient-max-comp-btn').click(function(){
	navigator.clipboard.writeText($('#max-comp-gradient .code-css').text());
	$('#copy-gradient-max-comp-btn .tooltiptext p').html('Copied!');
});
$('#copy-gradient-max-comp-btn').mouseleave(function(){$('#copy-gradient-max-comp-btn .tooltiptext p').html('Copy to Clipboard');});

$('#burger').click(function(){
	if (burger_transition==false && sub_content_transition==false){
		if (burger && sub_content){
			$('#sec-content').animate({opacity: 0}, 200, function(){
				$('#sec-content').css('display','none');
				$('#showcss-content').css('display','none');
				$('#gradient-content').css('display','none');
				$('#info-content').css('display','none');
				$('#main-content').css('display','block');
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
		if (!burger)
			$('#sidebar-content').css('display','block');
		$('#sidebar-content').animate({opacity: 1-opac}, 300, function(){
			if (burger) $('#sidebar-content').css('display','none');
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
			$('#main-content').css('display','none');
			$('#sec-content').css('display','block');
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
dragElement(document.getElementById('track-diamond'));
dragElement(document.getElementById('colour-banner'));
