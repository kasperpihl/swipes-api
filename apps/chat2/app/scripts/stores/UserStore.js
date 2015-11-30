var Reflux = require('reflux');
var _ = require('underscore');
var moment = require('moment');
var chatActions = require('../actions/ChatActions');
var data = [{"channel_id":"CJEBYCG1Z","id":"42311234-509f-47f1-84dd-353fb3372feb","text":"hey","ts":"1446812277.674051","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"2:17pm"},{"channel_id":"CJEBYCG1Z","id":"76b045d4-d4a4-4614-8aa0-6584cff6feba","text":"Is this getting marked","ts":"1446812282.552504","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"2:18pm"},{"channel_id":"CJEBYCG1Z","id":"8806f0f5-6cc4-46e7-a70c-0190d54d76a4","text":"hey","ts":"1447263815.909261","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"7:43pm"},{"channel_id":"CJEBYCG1Z","id":"e261e0ce-9857-4c1f-a238-5d9e2d936702","text":"test","ts":"1447426131.380367","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"4:48pm"},{"channel_id":"CJEBYCG1Z","id":"23fc1be2-9eac-456e-886f-31d4ea90c375","text":"hello","ts":"1447765941.025685","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"3:12pm"},{"channel_id":"CJEBYCG1Z","id":"21060f34-c9ea-442c-b515-dc769ada7cb6","text":"test again","ts":"1447776368.780814","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"6:06pm"},{"channel_id":"CJEBYCG1Z","id":"28035d41-1e85-4c1e-a0a4-5896c8996428","text":"one more try","ts":"1447776665.279647","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"6:11pm"},{"channel_id":"CJEBYCG1Z","id":"119d83c0-e0bb-46ba-8ddb-e19c0715f6dc","text":"hehe","ts":"1447777247.033336","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"6:20pm"},{"channel_id":"CJEBYCG1Z","id":"fb017122-9e6c-4703-aec4-5f3cd428e923","text":"test","ts":"1447843390.369503","user_id":"UWPTM4N9M","channelId":"CJEBYCG1Z","timeStr":"12:43pm"},{"channel_id":"CJEBYCG1Z","id":"e1ae7033-e284-4395-b293-27780e45a492","text":"test","ts":"1447866696.039425","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"7:11pm"},{"channel_id":"CJEBYCG1Z","id":"09287c3a-b6dc-4dcb-964e-f1d2d4f96cd4","text":"another test","ts":"1447867302.474513","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"7:21pm"},{"channel_id":"CJEBYCG1Z","id":"9f494406-6a17-4f52-aef9-f42183e2f186","text":"test 2","ts":"1447867366.285809","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"7:22pm"},{"channel_id":"CJEBYCG1Z","id":"a0f8b52f-4876-481e-bb98-31f4ed533796","text":"test 3","ts":"1447867413.867409","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"7:23pm"},{"channel_id":"CJEBYCG1Z","id":"0cfd4079-be0d-464f-ac23-d1db3b246624","text":"test 4","ts":"1447867517.151550","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"7:25pm"},{"channel_id":"CJEBYCG1Z","id":"9d65aa73-13d8-4425-9c35-a481fa50f403","text":"test 5","ts":"1447867858.721340","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"7:30pm"},{"channel_id":"CJEBYCG1Z","id":"04e6285b-e0cf-4e22-9f9c-4fa6a9d206e8","text":"test 6","ts":"1447867985.995354","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"7:33pm"},{"channel_id":"CJEBYCG1Z","id":"dbea06e8-2491-44c7-8c9b-30bae314e09b","text":"test 7","ts":"1447868014.566736","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"7:33pm"},{"channel_id":"CJEBYCG1Z","id":"812f0e88-c3db-419d-ab9e-47019017ab47","text":"test 8 ","ts":"1447868180.160637","user_id":"USNDZDT1T","channelId":"CJEBYCG1Z","timeStr":"7:36pm"},{"channel_id":"CJEBYCG1Z","id":"0d0b8c6c-3b6a-47e5-9c43-866923129239","text":"bla","ts":"1448286440.304706","user_id":"UWPTM4N9M","channelId":"CJEBYCG1Z","timeStr":"3:47pm"},{"channel_id":"CJEBYCG1Z","id":"e394528b-5b75-4ea6-a9fc-6d9debc92d6f","text":"ga","ts":"1448286446.996054","user_id":"UWPTM4N9M","channelId":"CJEBYCG1Z","timeStr":"3:47pm"},{"channel_id":"CJEBYCG1Z","id":"f459380f-37e1-4b8b-834e-ed777104ccd0","text":"hey","ts":"1448365731.130713","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"1:48pm"},{"channel_id":"CJEBYCG1Z","id":"47c94d10-a2f3-4ee6-8714-2be8c2bf85f0","text":"hey","ts":"1448365734.377670","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"1:48pm"},{"channel_id":"CJEBYCG1Z","id":"3b84f99e-22ab-454d-b269-f4969164aa05","text":"do you hear me?","ts":"1448365767.927271","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"1:49pm"},{"channel_id":"CJEBYCG1Z","id":"e1d06b74-2dca-458d-a52b-e7fbbae82d56","text":"Yes I hear you","ts":"1448365785.637827","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"1:49pm"},{"channel_id":"CJEBYCG1Z","id":"66a16199-ef7a-451b-95b6-cab55cba37ff","text":"Lol","ts":"1448372185.992803","user_id":"U51S3JQGX","channelId":"CJEBYCG1Z","timeStr":"3:36pm"},{"channel_id":"CJEBYCG1Z","id":"4b3d3fa7-a613-4851-87ee-2148e1122032","text":"Hey","ts":"1448443054.269110","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"11:17am"},{"channel_id":"CJEBYCG1Z","id":"425bbe65-570e-408f-b79d-5aa4a6765c53","text":"test","ts":"1448467726.419998","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"6:08pm"},{"channel_id":"CJEBYCG1Z","id":"64d28e2d-c5eb-42b4-b8e3-2b76f1271334","text":"hey","ts":"1448468644.468563","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"6:24pm"},{"channel_id":"CJEBYCG1Z","id":"66688307-e1dc-4e9c-b518-ce01edba253b","text":"hey","ts":"1448468906.417626","user_id":"UAD4XVDQJ","channelId":"CJEBYCG1Z","timeStr":"6:28pm"}];
var TimeUtility = require('../utilities/time_util');

var ChatStore = Reflux.createStore({
	listenables: [chatActions],
	sortedSections: [],
	onSendMessage: function(message){
		
	},
	sortMessages: function(){
		var groups = _.groupBy(this.messages, function(model, i){
			console.log(model.get("email"));
			var date = new Date(parseInt(model.ts)*1000);
			return moment(date).startOf('day').unix();
		});
		sortedKeys = _.keys(groups).sort()
		var sortedSections = [];
		for(var i = 0 ; i < sortedKeys.length ; i++){
			var key = sortedKeys[i];
			schedule = new Date(parseInt(key)*1000);
			var title = TimeUtility.dayStringForDate(schedule);
			sortedSections.push({"title": title, "messages": groups[key]});
		}
		this.sortedSections = sortedSections;

		this.trigger(sortedSections);
		
	},
	getInitialState: function(){
		
		return this.sortedSections;
	},
	init: function() {
		this.messages = data;
		this.sortMessages();
		console.log('ChatStore initialized');
		// This funciton will be called when the store will be first initialized
	}

});

module.exports = ChatStore;