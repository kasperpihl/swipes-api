import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { overlay } from '../../actions'

import PureRenderMixin from 'react-addons-pure-render-mixin';

class Store extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return (
      <div>
        I will become a store soon
      </div>
    )
  }
}

import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
const { string } = PropTypes;
Store.propTypes = {
}


function mapStateToProps(state) {
  return {
  }
}

const ConnectedStore = connect(mapStateToProps, {
  popOverlay: overlay.pop
})(Store)
export default ConnectedStore