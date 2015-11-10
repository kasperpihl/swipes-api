$('.hover-full').mouseenter(function() {
	var borderColor = $(this).css('border-color');
	$(this).css('background-color', borderColor);	
	$(this).css('color', 'white');
	console.log(borderColor)
}).mouseleave(function() {
	var borderColor = $(this).css('border-color');
	$(this).css('background-color', 'transparent');
	$(this).css('color', borderColor);
})

$('.hover-lighten').mouseenter(function() {
	var bgColor = $(this).css('background-color');
	var bgColorRGBA = $(this).css('background-color').replace(')', ', 0.75)').replace('rgb', 'rgba');
	$(this).css('background-color', bgColorRGBA)
}).mouseleave(function() {
	var bgColor = $(this).css('background-color');
	var bgColorRGBA = bgColor.split(',');
	var backTo = bgColorRGBA.slice(0,3);
	var changeTo = backTo.toString();
	var backToRGB = changeTo.replace('rgba', 'rgb');
	var fullRGB = backToRGB + ')';
	$(this).css('background-color', fullRGB);
})