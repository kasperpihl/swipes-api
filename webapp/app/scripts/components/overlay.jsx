var React = require('react');
var overlayStore = require('../stores/OverlayStore');
var overlayActions = require('../actions/OverlayActions');
var Overlay = React.createClass({
	mixins: [overlayStore.connect()],

	onClickedBackground: function(){
		if(this.state.overlayCallback)
			this.state.overlayCallback(null);
		overlayActions.hide();
	},
	onOverlayCallback: function(res){
		if(this.state.overlayCallback)
			this.state.overlayCallback(res);
		overlayActions.hide();
	},
	renderOverlay:function(){
		var Overlay = this.state.overlayView;
		return <Overlay data={{options: this.state.overlayData, callback: this.onOverlayCallback}}/>;
				
	},
	render: function() {
		if(!this.state.overlayView){
			return <div/>;
		}
		return (
			<div ref="container" className="overlay-background">

				<div ref="content" className="overlay-content">
					{this.renderOverlay()}
				</div>
			</div>
		);
	}
});

module.exports = Overlay;
