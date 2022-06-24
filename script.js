var cols =  ['#54cc66','#5382c9'];
var split = 0.5;
var colour_choice = basicBlendHEX(cols[0],cols[1],split);

let c1 = $('#col1');
let c2 = $('#col2');
let c1_picker = $('#col1_picker');
let c2_picker = $('#col2_picker');


let hex_chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

function applyGradient() {
	$('body').css({'background':'linear-gradient(90deg, '+cols[0]+' 20%, '+cols[1]+' 80%)'});
	applyColourChoice();
}
function applyColourChoice() {
	colour_choice = basicBlendHEX(cols[0],cols[1],split);
	$('#colour-banner').css({'left':(20+60*split).toString()+'%'});
	$('#colour-banner').css({'background':colour_choice});
	$('#track-diamond').css({
		'background':colour_choice,
		'left':(100*split).toString()+'%',
	});
	$('#colour-result').html(colour_choice);
	$('#split').val(parseInt(100*split).toString());
}

function verifyFormatHex(hex) {
	if (hex.length==7 && hex[0]=='#'){
		for (var i=1; i<7; i+=1){
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
	} else if (hex.length==6){
		for (var i=0; i<6; i+=1){
			if (!hex_chars.includes(hex[i].toLowerCase())) return false;
		}
	} else {
		return false;
	}
	return true;
}

c1.focusout(function(){
	if (verifyFormatHex(c1.val())){
		cols[0] = c1.val();
		if (cols[0][0]!='#') cols[0] = '#'+cols[0];
		c1.val(cols[0]);
		c1_picker.val(cols[0]);
		applyGradient();
	} else {
		c1.attr('placeholder',cols[0]);
		c1.val('');
	}
});
c2.focusout(function(){
	if (verifyFormatHex(c2.val())){
		cols[1] = c2.val();
		if (cols[1][0]!='#') cols[1] = '#'+cols[1];
		c2_picker.val(cols[1]);
		applyGradient();
	} else {
		c2.attr('placeholder',cols[1]);
		c2.val('');
	}
});
c1_picker.on('input',function(){
	cols[0] = c1_picker.val();
	c1.val(cols[0]);
	applyGradient();
});
c2_picker.on('input',function(){
	cols[1] = c2_picker.val();
	c2.val(cols[1]);
	applyGradient();
});
$('#split').on('input',function(){
	split = $('#split').val()/100;
	applyColourChoice();
});

$('#copy-btn').click(function(){
	navigator.clipboard.writeText(colour_choice);
})

applyGradient();
applyColourChoice();

dragElement(document.getElementById('track-diamond'));
