var React = require('react');
var modalStore = require('../stores/ModalStore');

var Modal = React.createClass({
	mixins: [modalStore.connect()],
	componentDidMount: function(){
		this.recalculateContent();
		window.addEventListener('resize', this.recalculateContent);
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize', this.recalculateContent);
	},
	componentDidUpdate: function(){
		this.recalculateContent();
	},
	recalculateContent: function(){
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

		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

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

	},
	render: function() {
		var containerClass = "modal-overlay-container ";
		if(this.state.show)
			containerClass += "shown";

		var backgroundClass = "modal-clickable-background ";
		if(this.state.showBackground)
			backgroundClass += "shown ";
		if(this.state.opaqueBackground)
			backgroundClass += "opaque ";

		var contentClass = "modal-overlay-content ";
		if(this.state.show)
			contentClass += "shown "
		return (
			<div ref="container" className={containerClass}>
				<div ref="background" onClick={this.onClickedBackground} className={backgroundClass}></div>
				<div ref="content" className={contentClass}>
					<Modal.SearchModal />
				</div>
			</div>
		);
	}
});

Modal.SearchModal = React.createClass({
	render: function(){
		return (
			<div style={{background:'red'}} className="search-modal">
				<input type="text" />
			</div>
		);
	}
});

module.exports = Modal;