import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { templates } from '../actions'

class TemplateSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (

      <div>Load Template
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    templates: state.templates
  }
}

const ConnectedTemplateSelector = connect(mapStateToProps, {
  
})(TemplateSelector)
export default ConnectedTemplateSelector