
	var $ = window.jQuery;
$(document).ready(function(){
	parent.postMessage(JSON.stringify({ok:true}), "http://localhost:9000");
	
	var email = $('li.email');
	var emailCard = $('.email-card');
	var textEditor = $('.text-editor');
	var replyToEmail = $('.reply');
	var newEmailFAB = $('.new-email-fab');
	
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
				$('.email-list').addClass('move-aside-mob');
			}
		}
	})
	
	swipes.navigation.onPop(function(){
        email.removeClass('selected');
		archiveEmail.add(deleteEmail).add(createTask).hide();
		emailCard.removeClass('open');
		$('.action-icons').removeClass('open');
		$('.email-list').removeClass('move-aside-mob');
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
		
		multiSelect.removeClass('open');
		$('.items-selected').html('');
	})
	
	replyToEmail.on('click', function(e) {
		var emailFrom = $('.email-card').find('.from').text();
		var getSubject = $('.reply-prev-email').find('.headline').text();
		var deleteEmailAddress = '<i class="material-icons delete-email-address">close</i>';

		$('.destination-fields').find('span.email').html(emailFrom + deleteEmailAddress);
		$('.destination-fields').find('span.subject').html('Re:' + getSubject);
		$('.destination-fields').removeClass('hidden');
		$('.reply-wrap').removeClass('hidden');
		$('.reply-prev-email').addClass('active');
		
		var deleteSingleEmailAddress = $('.delete-email-address');
		
		deleteSingleEmailAddress.on('click', function() {
			$(this).parent().remove();
		})
		
		$('.getImg').on('click', function(e) {
			event.preventDefault(); 
			$('#selectedFile').click();
		})
	})
	
	textEditor.one('click', function() {
		textEditor.html('');
	})
	
	newEmailFAB.on('click', function() {
		$('.new-email-wrapper').addClass('scale-in')
		$('.new-email-bgc').addClass('scale-in')
	})
	
	document.onpaste = function(event){
		var items = (event.clipboardData || event.originalEvent.clipboardData).items;
		console.log(JSON.stringify(items)); // will give you the mime types
		for (index in items) {
			var item = items[index];
			if (item.kind === 'file') {
				var blob = item.getAsFile();
				var reader = new FileReader();
				reader.onload = function(event){
						console.log(event.target.result); // data url!
						$('.text-editor').append('<img src="' + event.target.result + '" />');
					};
				reader.readAsDataURL(blob);
			}
		}
	}
})