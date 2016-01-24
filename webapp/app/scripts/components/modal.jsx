var React = require('react');
var modalStore = require('../stores/ModalStore');
var modalActions = require('../actions/ModalActions');
var Modal = React.createClass({
	mixins: [modalStore.connect('modal')],
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
		if(this.state.modal.centerX){
			marginLeft = -contentWidth / 2;
		}
		if(this.state.modal.centerY){
			marginTop = -contentHeight / 2;
		}
		var cssProps = {
			"bottom": "auto",
			"right": "auto",
			"top": this.state.modal.top,
			"left": this.state.modal.left
		};

		

		if(this.state.modal.left !== null){
			var actualLeft = parseInt(this.state.modal.left, 10);
			if(typeof this.state.modal.left === 'string' && this.state.modal.left.indexOf("%") !== -1)
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
		if(this.state.modal.top !== null){
			var actualTop = parseInt(this.state.modal.top, 10);
			if(typeof this.state.modal.top === 'string' && this.state.modal.top.indexOf("%") !== -1)
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
		console.log('clicked background', this.state.modal.modalCallback);
		if(this.state.modal.modalCallback)
			this.state.modal.modalCallback(null);
		modalActions.hide();
	},
	onModalCallback: function(res){
		if(this.state.modal.modalCallback)
			this.state.modal.modalCallback(res);
		modalActions.hide();
	},
	render: function() {
		var Modal = "div";

		var containerClass = "modal-overlay-container ";

		if(this.state.modal.modalView){
			containerClass += "shown ";
			Modal = this.state.modal.modalView;
		}

		var backgroundClass = "modal-clickable-background ";
		if(this.state.modal.opaqueBackground)
			backgroundClass += "opaque ";

		var contentClass = "modal-overlay-content shown";

		return (
			<div ref="container" className={containerClass}>
				<div ref="background" onClick={this.onClickedBackground} className={backgroundClass}></div>
				<div ref="content" className={contentClass} >
					<Modal data={{options: this.state.modal.modalData, callback: this.onModalCallback}}/>
				</div>
			</div>
		);
	}
});

module.exports = Modal;
