import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal } from '../actions';
import SwipesModal from '../components/modals/SwipesModal'
import { bindAll } from '../classes/utils'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Modal extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['onModalCallback', 'onKeyUp'])
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    window.addEventListener('keyup', this.onKeyUp);
  }
  componentWillUnmount(){
    window.removeEventListener('keyup', this.onKeyUp)
  }
  onKeyUp(e){
    const { modal } = this.props;
    if(e.keyCode === 27 && modal && modal.shown) {
      this.props.hideModal();
    }
  }

  onModalCallback(res){
    if(this.props.modal.get('callback'))
      this.props.modal.get('callback')(res);
    this.props.hideModal();
  }
  closeModal(e) {
    this.onModalCallback();
  }
  render() {
    const { modal } = this.props;
    const props = modal.get('props') || {};
    let className = "g-modal";
    if(modal.get('shown')){
      className += " g-modal--shown";
    }
    return (
      <div className={className}>
        <div className="g-modal__overlay" onClick={this.closeModal}></div>
        <SwipesModal callback={this.onModalCallback} {...props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.get('modal')
  }
}

const ConnectedModal = connect(mapStateToProps, {
  loadModal: modal.load,
  hideModal: modal.hide

})(Modal)
export default ConnectedModal
