// Insert dependencies, SwipesSDK and other scripts right after head
if(!window.apiHost)
  window.apiHost = 'http://localhost:5000';
var _defUrlDir = apiHost + '/apps/app-loader/';


document.write('<script src="' + _defUrlDir + 'jquery.min.js"></script>\r\n');
document.write('<script src="' + _defUrlDir + 'underscore.min.js"></script>\r\n');
document.write('<script src="' + _defUrlDir + 'q.min.js"></script>\r\n');
document.write('<script src="' + _defUrlDir + 'swipes-api-connector.js"></script>\r\n');
document.write('<script src="' + _defUrlDir + 'swipes-app-sdk.js"></script>\r\n');
document.write('<link type="text/css" rel="stylesheet" href="' + _defUrlDir + 'swipes-ui-kit/ui-kit-main.css"/>\r\n');
document.write('<script src="' + _defUrlDir + 'swipes-ui-kit/ui-kit-main.js"></script>\r\n');

document.write('<script>window.swipes = new SwipesAppSDK("' + apiHost + '");</script>');