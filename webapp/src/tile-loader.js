//import SwipesAppSDK from './classes/sdk/swipes-sdk-tile'

// Make listener work on iOS webview
if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.api) window.parent = window.webkit.messageHandlers.api;
window.workspaceSendFunction = window.workspaceSendFunction || function(data){
  console.log('received some shit', data);
};
window.swipes = new SwipesAppSDK(workspaceSendFunction);


import './components/global-styles/reset.scss'