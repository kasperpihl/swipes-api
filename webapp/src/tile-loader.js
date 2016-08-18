import SwipesAppSDK from './classes/sdk/swipes-sdk-tile'

// Make listener work on iOS webview
if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.api) window.parent = window.webkit.messageHandlers.api;
window.workspaceSendFunction = window.workspaceSendFunction || function(data){
  console.log('received some shit', data);
};

// workspaceSendFunction is defined in the preload
window.swipes = new SwipesAppSDK(window.workspaceSendFunction);

swipes.com.lock(); // Lock until init from the workspace, this will queue all calls and fire them once ready (init calls unlock);
swipes.com.addListener('init', function(data) {
  if(data.token) {
    this.api.setToken(data.token);
  }
  if(data.info){
    this.info = data.info;
  }
  // Now let's unlock the communicator since the connection from the workspace is ready
  if(this.com.isLocked()){
    this.com.unlock();
  }
}.bind(swipes));


import './components/global-styles/reset.scss'