import React, { Component, PropTypes } from 'react'
class TemplateHeader extends Component {
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
export default TemplateHeader

TemplateHeader.propTypes = {
  removeThis: PropTypes.string.isRequired
}