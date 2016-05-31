var fileViewer = document.getElementById('react-file-viewer');
var pageHeader = document.getElementById('page-header');

if (fileViewer.children.length > 0) {
  pageHeader.setAttribute('style', 'z-index: 1 !important');
} else {
  pageHeader.removeAttribute('style');
}
