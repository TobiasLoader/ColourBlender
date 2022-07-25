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
// apply colour choice updates text boxes, track etc...
function applyColourChoice() {
	applyColourChoiceBase();
}

//////////////// MAIN SCRIPT //////////////////

// flags for if burger has been clicked and if in transition
var burger = false;
var burger_transition = false;

// flags for if sub content is out and if in transition
var sub_content = false;
var sub_content_transition = false;

// if click burger
$('#burger').click(function(){
	homePage();
});

function homePage(){
	window.location.href = urlWithPageParam(urlRedirectWithParams(window.location.origin),'home');
}
function aboutPage(){
	window.location.href = urlWithPageParam(urlRedirectWithParams(window.location.origin),'about');
}
function showcssPage(){
	window.location.href = urlWithPageParam(urlRedirectWithParams(window.location.origin),'showcss');
}
function gradientPage(){
	window.location.href = urlWithPageParam(urlRedirectWithParams(window.location.origin),'gradient');
}
function privacyPage(){
	window.location.href = urlWithPageParam(urlRedirectWithParams(window.location.origin),'privacy');
}
function donatePage(){
	history.pushState(null, '', urlWithPageParam(window.location.origin,'coffee'));
	sidebar_btn();
	$('#donate-content').css('display','block');
	$('#donate-btn').addClass('sec-active');
}
// if showcss button clicked
$('#home-btn').click(function(){homePage();});
$('#showcss-btn').click(function(){showcssPage();});
$('#gradient-btn').click(function(){gradientPage();});
$('#about-btn').click(function(){aboutPage();});
$('#privacy-btn').click(function(){privacyPage();});
$('#donate-btn').click(function(){donatePage();});

function updateTipAmount(newtip){
	tip_amount = parseFloat(newtip).toFixed(2);
	$('#choose-custom-amount-input').val(tip_amount);
	$('#display-tip').text('£'+tip_amount.toString());
}
function removeTipActive(){
	$('#onefifty-donate, #twofifty-donate, #threefifty-donate').removeClass('active');
	configuredTipActive();
}
function configuredTipActive(){
	$('#choose-custom-amount-txt-container').css('display','flex');
	$('#choose-custom-amount-row').css('display','none');
}
$('#onefifty-donate, #twofifty-donate, #threefifty-donate').click(function(){
	removeTipActive();
});
$('#onefifty-donate').click(function(){
	updateTipAmount(1.50);
	$(this).addClass('active');
});
$('#twofifty-donate').click(function(){
	updateTipAmount(2.50);
	$(this).addClass('active');
});
$('#threefifty-donate').click(function(){
	updateTipAmount(3.50);
	$(this).addClass('active');
});

$('#choose-custom-amount-txt').click(function(){
	removeTipActive();
	$('#choose-custom-amount-txt-container').css('display','none');
	$('#choose-custom-amount-row').css('display','flex');
})

$('#choose-custom-amount-input').focusout(function(){
	updateTipAmount($(this).val());
});
$('#choose-custom-amount-input').keypress(function (e) {loseFocusOnEnter(e,$(this));});

$('#donate-button').click(function(){
	$('#choose-amount-section').css('display','none');
	$('#payment-system').css('display','block');
	updateStripeTip();
});

$('#back-to-tip').click(function(){
	$('#choose-amount-section').css('display','block');
	$('#payment-system').css('display','none');
});

// on init refresh the colour fields, and build the css and gradient code snippets
refreshColourFields();

sidebar();
sub_content = true;
// check if should immediately direct to page coffee:
$('body').addClass('show-sec');
$('body').addClass('sidebar-open');
$('#sidebar-content').css('opacity',1);
$('#sec-content').css('opacity',1);
$('#donate-content').css('display','block');
$('#donate-btn').addClass('sec-active');