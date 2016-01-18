var Reflux = require('reflux');
var PreviewAppActions = require('../actions/PreviewAppActions');
var Previews = require('../components/previews/previews');
var WorkflowStore = require('./WorkflowStore');

var PreviewAppStore = Reflux.createStore({
	listenables: [ PreviewAppActions ],
	onLoadPreview: function (item) {
		var workflow = WorkflowStore.get(item.workflowId);

		this.set('obj', item, {trigger:false});

		if (workflow && workflow.preview_view_url) {
			this.set("workflow", workflow, {trigger:false});
			this.set("url", workflow.preview_view_url);
		}	else {
			this.unset("workflow");
			this.unset("url");

			var preview = Previews.default;

			if(item.workflowId === "AUSER"){
				preview = Previews.user;
			}
			if(item.workflowId === "AWORKFLOW"){
				preview = Previews.workflow;
			}
			if(item.workflowId === 'ACHANNEL'){
				preview = Previews.channel;
			}

			this.set('localPreview', preview);
		}
	}


});
module.exports = PreviewAppStore;
