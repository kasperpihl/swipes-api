require('reflux-model-extension');
var React = require('react');
var ReactDOM = require('react-dom');
var mainStore = require('./stores/MainStore');
var TaskList = require('./components/task_list');
ReactDOM.render(<TaskList />, document.getElementById('content'));

swipes.onReady(function(){
	mainStore.start();
	swipes.service('jira').request('issue.transitionIssue', {issueKey: 'SWIP-29', transition: "21"}, function(res, err){
		console.log('transitioned', res, err);
	})
})