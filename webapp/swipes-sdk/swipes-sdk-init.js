window.swipes = new SwipesAppSDK();
if(parent){
	swipes._client.setListener(parent);
}
// Make listener work on iOS webview
if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.api) swipes._client.setListener(window.webkit.messageHandlers.api);