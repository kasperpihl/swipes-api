import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'

class TemplateSelector extends Component {
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

TemplateSelector.propTypes = {
  removeThis: PropTypes.string.isRequired
}

const ConnectedTemplateSelector = connect(mapStateToProps, {
  onDoing: actions.doStuff
})(TemplateSelector)
export default ConnectedTemplateSelector