var $ = window.jQuery;
$(document).ready(function(){
	parent.postMessage(JSON.stringify({ok:true}), "http://localhost:9000");
	
	var email = $('li.email');
	var emailCard = $('.email-card');
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
			}
  		} else { // open email
    		if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				archiveEmail.add(deleteEmail).add(createTask).hide();
				emailCard.removeClass('open');
			} else {
				archiveEmail.add(deleteEmail).add(createTask).show();
				email.removeClass('selected');
				$(this).addClass('selected');
				$(this).find('.dot').removeClass('unread');
				emailCard.addClass('open');
			}
 		 }
	})
	
	archiveEmail.on('click', function() {
		var numSelectedEmails = $('.selected').length;
		 $('li.email.selected').fadeOut( "slow", function() {
			 emailCard.removeClass('open');
			 archiveEmail.add(deleteEmail).add(createTask).hide();
			 $('.action-noti').addClass('notify').html('<p> ' + numSelectedEmails + ' emails archived</p>').delay(3000).queue(function() {
				 $('.action-noti').empty().removeClass('notify');
			 });
		});
	})
	
	deleteEmail.on('click', function() {
		var numSelectedEmails = $('.selected').length;
		 $('li.email.selected').fadeOut( "slow", function() {
			 emailCard.removeClass('open');
			 archiveEmail.add(deleteEmail).add(createTask).hide();
			 $('.action-noti').addClass('notify').html('<p> ' + numSelectedEmails + ' emails deleted</p>').delay(3000).queue(function() {
				 $('.action-noti').empty().removeClass('notify');
			 });
		});
	})
	
	refreshEmail.on('click', function() {
		$(this).addClass('loading').delay(1000).queue(function() {
			$(this).removeClass('loading');
			$('.new-email').css('display', 'flex');
		})
	})
})


