var Reflux = require('reflux');

var ModalStore = Reflux.createStore({
	defaults: {
		show: true,
		showBackground: true,
		opaqueBackground: true,
		left: "50%",
		top: "50%",
		centerX: true,
		centerY: true
	},
	init: function() {
		this.manualLoadData();
		console.log('ModalStore initialized');
		// This funciton will be called when the store will be first initialized
		//this.set("shown", true);
	}

});

module.exports = ModalStore;
