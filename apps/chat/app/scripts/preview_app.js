// T_K_TODO We should be able to just require a preview_router here and star building
// the preview application for the chat

swipes.onReady(function () {
  console.log("all running", swipes.info);
  $("#content").html(JSON.stringify(swipes.info.previewObj));
})
