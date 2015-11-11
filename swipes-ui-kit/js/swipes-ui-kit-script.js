$(document).ready(function() {
	// Set the width and the height of the floating-label container for label positioning
	var floatSizeW = $('.swipes-floating-label').children('input').width();
	var floatSizeH = $('.swipes-floating-label').children('input').height();
	$('.swipes-floating-label').css('width', floatSizeW);	
	$('.swipes-floating-label').css('height', floatSizeH);
	
	
	// Dropdown
	var swipesDropdown = $('.swipes-dropdown');
	var swipesDropdownInit = $('.swipes-dropdown').find('.init').text();
	var swipesDropdownFirst = swipesDropdown.find('.selected').text();
	
	if (swipesDropdownInit.length > 0) {
		
	} else {
		$('.init').html(swipesDropdownFirst);
	}
	
	swipesDropdown.on('click', '.init', function() {
		$(this).closest('ul').children('li:not(.init)').toggle();
	});

	var allOptions = swipesDropdown.children('li:not(.init)');
	
	swipesDropdown.on('click', 'li:not(.init)', function() {
		allOptions.removeClass('selected');
		$(this).addClass('selected');
		$("ul").children('.init').html($(this).html());
		allOptions.toggle();
	});
})

$('.swipes-floating-input').on('focus', function() {
	$(this).next('label').addClass('active');
})

$('.swipes-floating-input').on('blur', function() {
	var floatingInputVal = $('.swipes-floating-input').val();
	if(floatingInputVal.length > 0) {
		
	} else {
		$(this).next('label').removeClass('active');
	}
})

$('.swipes-slider').mouseup(function() {
	$(this).blur();
	var sliderVal = $(this).val();
	$(this).parent().append('<div class="swipes-ripple-range"></div>');
	$(this).siblings('.swipes-ripple-range').css('left', 'calc(' + sliderVal + '% - 30px)').delay(310).queue(function(){
		$(this).remove().dequeue();
	});
})

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

$('.swipes-checkbox').on('click', function() {
	var $el = $( this ).find(".swipes-input-checkbox");
	$el.click();
})

$('.swipes-input-checkbox').change(function() {
	if( $(this).is(':checked')) {
		$(this).parent().addClass('checked');
	} else {
		$(this).parent().removeClass('checked');
	}
})

$('.swipes-radio').on('click', function() {

	var $el = $(this).find(".swipes-input-radio");
	var name = $el.attr("name")

	$(".swipes-input-radio[name='" + name + "']").each(function(){
		$(this).prop("checked",false);
		$(this).parent().removeClass("checked");
	})
	
	$(this).addClass('checked');
	$el.prop("checked", true);
})