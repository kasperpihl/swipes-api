var Reflux = require('reflux');
var OverlayActions = require('../actions/OverlayActions');
var Overlays = require('../components/overlays/overlays');
var OverlayStore = Reflux.createStore({
	listenables: [OverlayActions],
	reset:function(){
		this._reset();
	},
	onLoadOverlay: function(overlay, options, callback){
		var overlayObj = Overlays[overlay];
		if(!overlayObj)
			return callback(false, "overlay_not_found");
		options = options || {};
		if(typeof options === 'function'){
			callback = options;
			options = {};
		}

		this.reset();

		this.set("overlayCallback", callback, {trigger: false});
		this.set("overlayView", overlayObj);
		
	},
	onHide: function(){
		this.unset("overlayView");
	}
});

module.exports = OverlayStore;
