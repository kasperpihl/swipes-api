import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class Field extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="className"></div>
    )
  }
}

function mapStateToProps(state) {
  return {
    main: state.get('main')
  }
}

import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
const { string } = PropTypes;
Field.propTypes = {
  //removeThis: PropTypes.string.isRequired
}

const ConnectedField = connect(mapStateToProps, {
  onDoing: actions.doStuff
})(Field)
export default ConnectedField
