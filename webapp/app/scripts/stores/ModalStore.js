var Reflux = require('reflux');
var modalActions = require('../actions/ModalActions');

var ModalStore = Reflux.createStore({
	listenables: [modalActions],
	onLoadModal: function(modal){
		this.set("modalView", modal);
	},
	onHide: function(){
		console.log("hiding");
		this.unset("modalView");
	},
	defaults: {
		show: true,
		showBackground: true,
		opaqueBackground: true,
		left: "50%",
		top: "150px",
		centerX: true,
		centerY: false
	},

	init: function() {
		this.manualLoadData();
		console.log('ModalStore initialized');
		// This funciton will be called when the store will be first initialized
		//this.set("shown", true);
	}

});

module.exports = ModalStore;
