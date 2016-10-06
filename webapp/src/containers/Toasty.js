import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Toasty extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return (
      <div>
      </div>
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
Toasty.propTypes = {
  //removeThis: PropTypes.string.isRequired
}


const ConnectedToasty = connect(mapStateToProps, {
  onDoing: actions.doStuff
})(Toasty)
export default ConnectedToasty