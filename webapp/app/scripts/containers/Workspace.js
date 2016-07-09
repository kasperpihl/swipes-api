import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'

class Workspace extends Component {
  constructor(props) {
    super(props)
    this.state = {}
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
    fullscreen: state.main.isFullscreen
  }
}

const ConnectedWorkspace = connect(mapStateToProps, {
  onDoing: actions.doStuff
})(Workspace)
export default ConnectedWorkspace

import React, { Component, PropTypes } from 'react'