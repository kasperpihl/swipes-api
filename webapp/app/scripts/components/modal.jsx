var React = require('react');
var modalStore = require('../stores/ModalStore');
var modalActions = require('../actions/ModalActions');
var Modal = React.createClass({
	mixins: [modalStore.connect()],
	componentDidMount: function(){
		this.recalculateContent();
		window.addEventListener('resize', this.recalculateContent);
		/*setTimeout(function(){
			modalActions.loadModal(SearchModal, {top:"20%", centerY:false});
		}, 500);*/
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize', this.recalculateContent);
	},
	componentDidUpdate: function(){
		this.recalculateContent();
	},

	recalculateContent: function(){
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		
		var $contentEl = $(this.refs.content);
		var contentWidth = $contentEl.outerWidth();
		var contentHeight = $contentEl.outerHeight();
		var marginLeft = 0, marginTop = 0;
		if(this.state.centerX){
			marginLeft = -contentWidth / 2;
		}
		if(this.state.centerY){
			marginTop = -contentHeight / 2;
		}

		var cssProps = {
			"bottom": "auto",
			"right": "auto",
			"top": this.state.top,
			"left": this.state.left
		};

		

		if(this.state.left !== null){
			var actualLeft = parseInt(this.state.left, 10);
			if(typeof this.state.left === 'string' && this.state.left.indexOf("%") !== -1)
				actualLeft = parseInt(windowWidth / 100 * actualLeft, 10);
			if((actualLeft + marginLeft) < 0){
				cssProps["left"] = 0;
				marginLeft = 0;
			}
			if((actualLeft + contentWidth + marginLeft) > windowWidth){
				cssProps["left"] = "auto";
				cssProps["right"] = 0;
				marginLeft = 0;
			}
		}
		if(this.state.top !== null){
			var actualTop = parseInt(this.state.top, 10);
			if(typeof this.state.top === 'string' && this.state.top.indexOf("%") !== -1)
				actualTop = parseInt(windowHeight / 100 * actualTop, 10);
			if((actualTop + marginTop) < 0){
				cssProps["top"] = 0;
				marginTop = 0;
			}
			if((actualTop + contentHeight + marginTop) > windowHeight){
				cssProps["top"] = "auto";
				cssProps["bottom"] = 0;
				marginTop = 0;
			}
		}

		cssProps["marginLeft"] = marginLeft;
			cssProps["marginTop"] = marginTop;

			$contentEl.css(cssProps);
	},
	onClickedBackground: function(){
		if(this.state.modalCallback)
			this.state.modalCallback(null);
		modalActions.hide();
	},
	onModalCallback: function(res){
		if(this.state.modalCallback)
			this.state.modalCallback(res);
		modalActions.hide();
	},
	render: function() {
		var Modal = "div";

		var containerClass = "modal-overlay-container ";

		if(this.state.modalView){
			containerClass += "shown ";
			Modal = this.state.modalView;
		}

		var backgroundClass = "modal-clickable-background ";
		if(this.state.opaqueBackground)
			backgroundClass += "opaque ";

		var contentClass = "modal-overlay-content shown";

		return (
			<div ref="container" className={containerClass}>
				<div ref="background" onClick={this.onClickedBackground} className={backgroundClass}></div>
                {/* Had to make modal-overlay-content clickable because it's 100% w&h for responsive reasons */}
				<div ref="content" className={contentClass} onClick={this.onClickedBackground} >
					<Modal data={{options: this.state.modalData, callback: this.onModalCallback}}/>
				</div>
			</div>
		);
	}
});

module.exports = Modal;
