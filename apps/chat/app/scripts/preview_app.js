// T_K_TODO We should be able to just require a preview_router here and star building
// the preview application for the chat
swipes.onPreview(function(previewObj){
	$("#content").html(JSON.stringify(previewObj));
});