var Reflux = require('reflux');
var topbarActions = require('../actions/TopbarActions');
var notificationActions = require('../actions/NotificationActions');
var modalActions = require('../actions/ModalActions');
var WorkflowStore = require('./WorkflowStore');
var TopbarStore = Reflux.createStore({
	listenables: [ topbarActions ],
	onLoadWorkflowModal:function(){
		swipes.api.request('workflows.list').then(function(res){
			console.log(res);
			modalActions.loadModal("list", {"title": "Add a workflow", "emptyText": "We're working on adding more workflows.", "rows": res.data }, function(row){
				if(row){
					swipes.api.request("users.addWorkflow", {"manifest_id": row.manifest_id}, function(res,error){
						if(res && res.ok){
							amplitude.logEvent('Engagement - Added Workflow', {'Workflow': row.manifest_id});
							mixpanel.track('Added Card', {'Card': row.manifest_id});
						}
						console.log("res from app", res);
					})
				}
			});
		}).catch(function(err){

		});

	},
	onSendFeedback: function() {
		modalActions.loadModal('textarea', {'title': 'Send us your feedback', 'placeholder': 'Write what you are thinking'}, function(res) {
			if (res) {
				var feedbackMessage = res;
				swipes.api.request('feedback.add', {'feedback': res}).then(function(res) {
					if(res.ok) {
						mixpanel.track('Feedback Sent');
						modalActions.loadModal('alert', {'title': 'Thank you', 'message': 'We appreciate you taking time to send us your thoughts on Swipes!'})
					} else {
						console.log(res.err);
						return;
					}
				}).catch(function(err) {
					console.log(err);
				})
			}
		})
	},
	onSetNotifications: function() {
		notificationActions.setNotifications();
	}
});

module.exports = TopbarStore;
