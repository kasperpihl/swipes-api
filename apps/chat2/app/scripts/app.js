var Router = require('./router');

Router.start();
window.webSocket = io.connect("http://localhost:5000", {
	query: 'token=' + token
});
webSocket.on('message', function(data) {
	console.log(data);
});