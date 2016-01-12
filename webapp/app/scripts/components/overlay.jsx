var React = require('react');
var overlayStore = require('../stores/OverlayStore');
var overlayActions = require('../actions/OverlayActions');
var Overlay = React.createClass({
	mixins: [overlayStore.connect()],

	onOverlayCallback: function(res){
		if(this.state.overlayCallback)
			this.state.overlayCallback(res);
		overlayActions.hide();
	},
	onCloseClick: function(){
		overlayActions.hide();
	},
	renderOverlay:function(){
		var Overlay = this.state.overlayView;
		return <Overlay data={{options: this.state.overlayData, callback: this.onOverlayCallback}}/>;
				
	},
	renderTitle: function(){
		var title = 'Overlay'
		if(this.state.overlayData && this.state.overlayData.title)
			title = this.state.overlayData.title;
		return <h3 className='title'>{title}</h3>;
	},
	render: function() {
		if(!this.state.overlayView){
			return <div/>;
		}

		
		return (
			<div ref="container" className="overlay-background">
				<a onClick={this.onCloseClick} className="close-button">X</a>
				{this.renderTitle()}
				<div ref="content" className="overlay-content">
					{this.renderOverlay()}
				</div>
			</div>
		);
	}
});

module.exports = Overlay;
