function showcssBuildCode() {
	switch (colour_encode){
		case 'hex':
			$('#showcss-content .code-css').html(
				"<span class='l1'>color</span><span class='l2'>: </span><span class='l3'>#</span><span class='l4'>"+colour_choice.slice(1)+"</span><span class='l2'>;</span>"
			);
			break;
		case 'rgb':
			$('#showcss-content .code-css').html(
				"<span class='l1'>color</span><span class='l2'>: </span><span class='l3'>rgb</span><span class='l2'>(</span><span class='l4'>"+colour_choice.slice(4,-1)+"</span><span class='l2'>);</span>"
			);
			break;
	}
	
}