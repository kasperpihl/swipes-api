var $ = window.jQuery;
$(document).ready(function(){
	var email = $('li.email');
	var emailCard = $('.email-card');
	var multiSelect = $('.multiple-selection');
	var refreshEmail = $('.refresh');
	var archiveEmail = $('.archive');
	var deleteEmail = $('.delete');
	var createTask = $('.create-task');
	
	email.on('click', function(e) {
		if(e.ctrlKey || e.metaKey) { // multiselect
    		if ($(this).hasClass('selected')) {
			} else {
				$(this).addClass('selected');
				archiveEmail.add(deleteEmail).add(createTask).hide();
				archiveEmail.add(deleteEmail).show();
				emailCard.removeClass('open');
				multiSelect.addClass('open');
				var numSelectedEmails = $('.selected').length;
				var emails = numSelectedEmails > 1 ? ' emails' : ' email';
				$('.items-selected').html('You have selected ' + numSelectedEmails + emails);
				$('.action-icons').removeClass('open');
			}
  		} else { // open email
    		if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				archiveEmail.add(deleteEmail).add(createTask).hide();
				emailCard.removeClass('open');
				$('.action-icons').removeClass('open');
			} else {
				archiveEmail.add(deleteEmail).add(createTask).show();
				email.removeClass('selected');
				$(this).addClass('selected');
				$(this).find('.dot').removeClass('unread');
				emailCard.addClass('open');
				multiSelect.removeClass('open');
				$('.items-selected').html('')
				$('.action-icons').addClass('open');
			}
 		 }
	})
	
	archiveEmail.on('click', function() {
		var numSelectedEmails = $('.selected').length;
		var emails = numSelectedEmails > 1 ? ' emails' : ' email';
		 $('li.email.selected').fadeOut( "slow", function() {
			 emailCard.removeClass('open');
			 archiveEmail.add(deleteEmail).add(createTask).hide();
			 
			 $('.action-noti').addClass('notify').html('<p> ' + numSelectedEmails + emails + ' archived</p>').delay(3000).queue(function() {
				 $('.action-noti').empty().removeClass('notify');
			 });
		});
		
		multiSelect.removeClass('open');
		$('.items-selected').html('');
		$('.action-icons').removeClass('open');
	})
	
	deleteEmail.on('click', function() {
		var numSelectedEmails = $('.selected').length;
		var emails = numSelectedEmails > 1 ? ' emails' : ' email';
		 $('li.email.selected').fadeOut( "slow", function() {
			 emailCard.removeClass('open');
			 archiveEmail.add(deleteEmail).add(createTask).hide();
			 $('.action-noti').addClass('notify').html('<p> ' + numSelectedEmails + emails + ' deleted</p>').delay(3000).queue(function() {
				 $('.action-noti').empty().removeClass('notify');
			 });
		});
		
		multiSelect.removeClass('open');
		$('.items-selected').html('');
		$('.action-icons').removeClass('open');
	})
	
	refreshEmail.on('click', function() {
		$(this).addClass('loading').delay(1000).queue(function() {
			$(this).removeClass('loading');
			$('.new-email').css('display', 'flex');
		})
	})
	
	multiSelect.removeClass('open');
	$('.items-selected').html('')
})


