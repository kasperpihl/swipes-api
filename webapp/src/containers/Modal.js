import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal } from '../actions';
import SwipesModal from '../components/modals/SwipesModal'
import { bindAll } from '../classes/utils'

class Modal extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['onModalCallback', 'onKeyUp'])
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
    if(this.props.modal.callback)
      this.props.modal.callback(res);
    this.props.hideModal();
  }
  render() {
    const { shown, data } = this.props.modal;

    return (
      <SwipesModal shown={shown} callback={this.onModalCallback} data={data}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.get('modal')
  }
}

const ConnectedModal = connect(mapStateToProps, {
  loadModal: modal.loadModal,
  hideModal: modal.hideModal

})(Modal)
export default ConnectedModal
