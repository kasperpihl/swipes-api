var DefaultPreview = require('./default_preview');
var UserPreview = require('./user_preview');
var WorkflowPreview = require('./workflow_preview');

var Previews = {
	default: DefaultPreview,
	user: UserPreview,
	workflow: WorkflowPreview
};
module.exports = Previews;