var fileViewer = document.getElementById('react-file-viewer');
var pageHeader = document.getElementById('page-header');

if (fileViewer && pageHeader) {
  if (fileViewer.children.length > 0) {
    pageHeader.setAttribute('style', 'z-index: 1 !important');
  } else {
    pageHeader.removeAttribute('style');
  }
}

var browseHeader = document.getElementById('browse-header');
var sendEvent = window.sendEvent; // that is defined in the preload script
var downloadActionButtonClick = function (e) {
  sendEvent('download');
}

// Disconnect and delete the observer if exists
if (window.swipesObserver) {
  window.swipesObserver.disconnect();
  window.swipesObserver = null;
}

// create an observer instance
window.swipesObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var downloadActionButton = document.getElementById('download_action_button');

    if (downloadActionButton) {
      downloadActionButton.removeEventListener('click', downloadActionButtonClick, false);
      downloadActionButton.addEventListener('click', downloadActionButtonClick, false);
    }
  });
});

// configuration of the observer:
var config = {childList: true, subtree: true};

// pass in the target node, as well as the observer options
swipesObserver.observe(browseHeader, config);
