var col1 =  '#54cc66';
var col2 =  '#5382c9';
var split = 0.5;
var colour_choice = basicBlendHEX(col1,col2,split);

function applyGradient() {
	$('body').css({'background':'linear-gradient(90deg, '+col1+' 20%, '+col2+' 80%)'});
	$('#col1').html(col1);
	$('#col2').html(col2);
}
function applyColourChoice() {
	colour_choice = basicBlendHEX(col1,col2,split);
	$('#colour-banner').css({'left':(20+60*split).toString()+'%'});
	$('#colour-banner').css({'background':colour_choice});
	$('#track-diamond').css({
		'background':colour_choice,
		'left':(100*split).toString()+'%',
	});
	$('#colour-result').html(colour_choice);
	$('#split').val(parseInt(100*split).toString());
}

applyGradient();
applyColourChoice();

dragElement(document.getElementById('track-diamond'));
