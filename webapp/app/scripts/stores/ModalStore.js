var Reflux = require('reflux');
var modalActions = require('../actions/ModalActions');
var Modals = require('../components/modals/modals');
var ModalStore = Reflux.createStore({
	listenables: [modalActions],
	persistNot: [ 'modalView', 'modalData', 'modalCallback'],
	reset:function(){
		this._reset();
	},
	defaults: {
		opaqueBackground: true,
		left: "50%",
		top: "50%",
		centerX: true,
		centerY: true
	},
	getModalOptions: function(modal){
		// Set custom options for modal here
		// Defaults are set above
		var options = {};
		if(modal === "search"){
			options.top = "15%";
			options.centerY = false;
		}
		return options;
	},
	onLoadModal: function(modal, options, callback){
		var modalObj = Modals[modal];
		if(!modalObj)
			return callback(false, "modal_not_found");
		options = options || {};
		if(typeof options === 'function'){
			callback = options;
			options = {};
		}

		this.reset();

		var modalOptions = this.getModalOptions(modal);
		if(typeof modalOptions.opaqueBackground !== 'undefined')
			this.set("opaqueBackground", modalOptions.opaqueBackground, {trigger:false, persist: false});
		if(typeof modalOptions.left !== 'undefined')
			this.set("left", modalOptions.left, {trigger:false, persist: false});
		if(typeof modalOptions.top !== 'undefined')
			this.set("top", modalOptions.top, {trigger:false, persist: false});
		if(typeof modalOptions.centerX !== 'undefined')
			this.set("centerX", modalOptions.centerX, {trigger:false, persist: false});
		if(typeof modalOptions.centerY !== 'undefined')
			this.set("centerY", modalOptions.centerY, {trigger:false, persist: false});

		
		this.set("modalData", options, {trigger: false});
		this.set("modalCallback", callback, {trigger: false});
		this.set("modalView", modalObj);
		
	},
	onHide: function(){
		this.unset("modalView");
	}
});

module.exports = ModalStore;
