// On preview is called everytime a new preview is selected. This style allows us to reuse the iframe without loading it again.
swipes.onPreview(function(previewObj){
	$("#content").html(JSON.stringify(previewObj));
});