import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal } from '../../actions'
import { bindAll } from '../../classes/utils'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class CreatePattern extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['openModal']);
  }
  openModal() {
    const { loadModal } = this.props;

    console.log(loadModal);
  }
  render() {
    return (
      <div onClick={this.openModal}>
        KRIS
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

const ConnectedCreatePattern = connect(mapStateToProps, {
  loadModal: modal.load
})(CreatePattern)
export default ConnectedCreatePattern
