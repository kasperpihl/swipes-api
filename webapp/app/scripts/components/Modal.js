import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal } from '../actions';
import modals from './modals'

class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    this.recalculateContent = this.recalculateContent.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }
  componentDidMount() {
    this.recalculateContent();
    window.addEventListener('resize', this.recalculateContent);
    window.addEventListener('keyup', this.onKeyUp);
    setTimeout(function(){
      this.props.loadModal("list");
    }.bind(this), 500);
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.recalculateContent);
    window.removeEventListener('keyup', this.onKeyUp)
  }
  componentDidUpdate(){
    this.recalculateContent();
  }
  onKeyUp(e){
    if(e.keyCode === 27) {
      this.props.hideModal();
    }
  }
  recalculateContent(){
    let windowWidth = $(window).width();
    let windowHeight = $(window).height();

    let $contentEl = $(this.refs.content);
    let contentWidth = $contentEl.outerWidth();
    let contentHeight = $contentEl.outerHeight();
    let marginLeft = 0, marginTop = 0;
    if(this.props.modal.centerX){
      marginLeft = -contentWidth / 2;
    }
    if(this.props.modal.centerY){
      marginTop = -contentHeight / 2;
    }
    var cssProps = {
      "bottom": "auto",
      "right": "auto",
      "top": this.props.modal.top,
      "left": this.props.modal.left
    };



    if(this.props.modal.left !== null){
      var actualLeft = parseInt(this.props.modal.left, 10);
      if(typeof this.props.modal.left === 'string' && this.props.modal.left.indexOf("%") !== -1)
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
    if(this.props.modal.top !== null){
      var actualTop = parseInt(this.props.modal.top, 10);
      if(typeof this.props.modal.top === 'string' && this.props.modal.top.indexOf("%") !== -1)
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
  }
  onClickedBackground(){
    console.log('clicked background', this.props.modal.callback);
    if(this.props.modal.callback)
      this.props.modal.callback(null);
    this.props.hideModal();
  }
  onModalCallback(res){
    if(this.props.modal.callback)
      this.props.modal.callback(res);
    this.props.hideModal();
  }
  render() {
    let Modal = modals[this.props.modal.viewName];

    var containerClass = "modal-overlay-container ";
    if(Modal){
      containerClass += "shown ";
    }
    else{
      Modal = "div"
    }

    var backgroundClass = "modal-clickable-background ";
    if(this.props.modal.opaqueBackground){
      backgroundClass += "opaque ";
    }

    var contentClass = "modal-overlay-content shown";

    return (
      <div ref="container" className={containerClass}>
        <div ref="background" onClick={this.onClickedBackground.bind(this)} className={backgroundClass}></div>
        <div ref="content" className={contentClass}>
          <Modal data={{options: this.props.modal.data, callback: this.onModalCallback.bind(this)}}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal
  }
}

const ConnectedModal = connect(mapStateToProps, {
  loadModal: modal.loadModal,
  hideModal: modal.hideModal

})(Modal)
export default ConnectedModal
