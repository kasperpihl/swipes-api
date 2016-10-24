import React, { Component, PropTypes } from 'react'
import { modal } from '../../actions'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import CreatePattern from './CreatePattern'

class HOCCreatePattern extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  openModal() {
    const { loadModal } = this.props;

    console.log(loadModal);
  }
  render() {
    return (
      <div onClick={this.openModal}>dada</div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const ConnectedHOCCreatePattern = connect(mapStateToProps, {
  loadModal: modal.load
})(HOCCreatePattern)
export default ConnectedHOCCreatePattern
