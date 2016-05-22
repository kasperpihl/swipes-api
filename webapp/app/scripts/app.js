// Geting events from the oauth popup
require('./oauth-electron-handler');
// Reflux extension for easier handling data/localstorage etc.
require('reflux-model-extension');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var Router = require('./router');

Router.start();
