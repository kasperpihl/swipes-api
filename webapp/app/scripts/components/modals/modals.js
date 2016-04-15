var SearchModal = require('./search_modal');
var ListModal = require('./list_modal');
var AlertModal = require('./alert_modal');
var TextareaModal = require('./textarea_modal');
var ScheduleModal = require('./schedule_modal');

var Modals = {
	search: SearchModal,
	list: ListModal,
	alert: AlertModal,
	textarea: TextareaModal,
	schedule: ScheduleModal
};

module.exports = Modals;
