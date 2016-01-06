var DefaultPreview = require('./default_preview');
var UserPreview = require('./user_preview');
var AppPreview = require('./app_preview');

var Previews = {
	default: DefaultPreview,
	user: UserPreview,
	app: AppPreview
};
module.exports = Previews;