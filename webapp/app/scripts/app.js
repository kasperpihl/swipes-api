// Reflux extension for easier handling data/localstorage etc.
require('reflux-model-extension');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var Router = require('./router');
var Bridge = require('./stores/BridgeStore');

Router.start();