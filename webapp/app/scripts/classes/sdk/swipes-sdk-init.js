import SwipesAppSDK from './swipes-sdk-tile'

window.swipes = new SwipesAppSDK();

// Make listener work on iOS webview
if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.api) window.parent = window.webkit.messageHandlers.api;