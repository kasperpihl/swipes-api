var ListModal = require('./list_modal');
var AlertModal = require('./alert_modal');
var TextareaModal = require('./textarea_modal');
var ScheduleModal = require('./schedule_modal');
var LightboxModal = require('./lightbox_modal');

var Modals = {
	list: ListModal,
	alert: AlertModal,
	textarea: TextareaModal,
	schedule: ScheduleModal,
	lightbox: LightboxModal
};

module.exports = Modals;
