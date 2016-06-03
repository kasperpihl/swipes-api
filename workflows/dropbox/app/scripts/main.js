var fileViewer = document.getElementById('react-file-viewer');
var pageHeader = document.getElementById('page-header');

if (fileViewer.children.length > 0) {
  pageHeader.setAttribute('style', 'z-index: 1 !important');
} else {
  pageHeader.removeAttribute('style');
}

// Mixpanel
// window.nodeRequire = require;
// var {ipcRenderer} = nodeRequire('electron');
// var sendEvent = function (name) {
//   ipcRenderer.sendToHost('mixpanel', {
//     manifest_id: 'dropbox',
//     action: name
//   });
// }
// var downloadButton = document.getElementById('download-action-button');
//
// downloadButton.removeEventListener('click', sendEvent, false);
// downloadButton.addEventListener('click', sendEvent.bind(this, 'download'), false);
// downloadButton.removeEventListener('click', sendEvent, false);
// downloadButton.addEventListener('click', sendEvent.bind(this, 'download'), false);
// downloadButton.removeEventListener('click', sendEvent, false);
// downloadButton.addEventListener('click', sendEvent.bind(this, 'download'), false);
