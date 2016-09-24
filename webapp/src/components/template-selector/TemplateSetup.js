import React, { Component, PropTypes } from 'react'
class TemplateSetup extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
      </div>
    )
  }
}
export default TemplateSetup

TemplateSetup.propTypes = {
  removeThis: PropTypes.string.isRequired
}