import React, { Component, PropTypes } from 'react'
class TemplateList extends Component {
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
export default TemplateList

TemplateList.propTypes = {
  removeThis: PropTypes.string.isRequired
}