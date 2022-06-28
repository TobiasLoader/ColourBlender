// Make the DIV element draggable:
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
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}