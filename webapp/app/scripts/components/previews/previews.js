var DefaultPreview = require('./default_preview');
var UserPreview = require('./user_preview');
var ChannelPreview = require('./channel_preview');
var AppPreview = require('./app_preview');

var Previews = {
	default: DefaultPreview,
	user: UserPreview,
	channel: ChannelPreview,
	app: AppPreview
};
module.exports = Previews;