// Make the DIV element draggable:
function dragElement(elmnt) {
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
	e = e || window.event;
	e.preventDefault();
	// get the mouse cursor position at startup:
	document.onmouseup = closeDragElement;
	// call a function whenever the cursor moves:
	document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
	e.preventDefault();
	// calculate the new split:
	let p = (e.clientX-0.2*$(window).width())/(0.6*$(window).width());
	if (p<0) p=0;
	if (p>1) p=1;
	split = p;
	elmnt.style.left = 100*split+'%';
	applyColourChoice();
  }

  function closeDragElement() {
	// stop moving when mouse button is released:
	document.onmouseup = null;
	document.onmousemove = null;
  }
}