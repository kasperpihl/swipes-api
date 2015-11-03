var $ = window.jQuery;
$(document).ready(function(){
	parent.postMessage(JSON.stringify({ok:true}), "http://localhost:9000");
	
	$('.profile').on('click', function() {
		$('.profile-dropdown').toggleClass('active');
	})
	
	$('.an-email').on('click', function() {
		$('.email-view').toggleClass('open');
		$('.email-list').toggleClass('open');
		$(this).toggleClass('open');
		$('.email-one').toggleClass('open');
	})
})


