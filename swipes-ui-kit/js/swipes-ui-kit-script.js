$(document).ready(function() {
	// Set the width and the height of the floating-label container for label positioning
	var sizeW = $('.floating-label').children('input').width();
	var sizeH = $('.floating-label').children('input').height();
	$('.floating-label').css('width', sizeW);	
	$('.floating-label').css('height', sizeH);
})

// Floating the label
$('.floating-input').on('click', function() {
	$(this).next('label').addClass('active');
})

// Remove active class from floating label if nothing typed in the input
$(document).mouseup(function (e) {
   var container = $('#email');

   if (!container.is(e.target) && container.has(e.target).length === 0) {
      
		var valueOfCont = container.val();
		if (valueOfCont.length > 0) {
			
		} else {
			$('label').removeClass('active');
		}
		
   } else {
		
	}
});

// button.primary hover
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

// button.outline hover
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