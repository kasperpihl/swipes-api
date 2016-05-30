if (window.process && window.process.versions.electron) {
  // Geting events from the oauth popup
  require('./oauth-electron-handler');
  // Reflux extension for easier handling data/localstorage etc.
  require('reflux-model-extension');
  var injectTapEventPlugin = require("react-tap-event-plugin");
  injectTapEventPlugin();

  var Router = require('./router');

  Router.start();
} else {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var DownloadPage = require('./components/downloadPage');

  ReactDOM.render(<DownloadPage />, document.body);
}
