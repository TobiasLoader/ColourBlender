function echoHTMLColourCSS(){
	
}

function echoHTML(pairs){
	s = "";
	for (var p of pairs){
		s += "<span class='"+p[0]+"'>"+p[1]+"</span>";
	}
	return s;
}

function showcssBuildCode() {
	switch (colour_encode){
		case 'hex':
			$('#showcss-content .code-css').html(
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
			$('#showcss-content .code-css').html(
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

function gradientBuildCode() {
	switch (colour_encode){
		case 'hex':
			$('#gradient-content #modern-gradient .code-css').html(
				echoHTML([
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
				])
			);
			$('#gradient-content #max-comp-gradient .code-css').html(
				echoHTML([
					['l1','background'],
					['l2',': '],
					['l3','#'],
					['l4',cols[0].slice(1)],
					['l2',';']
				]) + '<br>' +
				echoHTML([
					['l1','background'],
					['l2',': '],
					['l3','-moz-linear-gradient'],
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
				]) + '<br>' +
				echoHTML([
					['l1','background'],
					['l2',': '],
					['l3','-webkit-linear-gradient'],
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
				]) + '<br>' +
				echoHTML([
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
				]) + '<br>' +
				echoHTML([
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
				])
			);
			break;
		case 'rgb':
			$('#gradient-content #modern-gradient .code-css').html(
				echoHTML([
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
				])
			);
			$('#gradient-content #max-comp-gradient .code-css').html(
				echoHTML([
					['l1','background'],
					['l2',': '],
					['l3','rgb'],
					['l2','('],
					['l4',colour_choice.slice(4,-1)],
					['l2',');']
				]) + '<br>' +
				echoHTML([
					['l1','background'],
					['l2',': '],
					['l3','-moz-linear-gradient'],
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
				]) + '<br>' +
				echoHTML([
					['l1','background'],
					['l2',': '],
					['l3','-webkit-linear-gradient'],
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
				]) + '<br>' +
				echoHTML([
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
				]) + '<br>' +
				echoHTML([
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
				])
			);
			break;
	}
}
