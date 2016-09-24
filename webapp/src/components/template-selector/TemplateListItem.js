import React, { Component, PropTypes } from 'react'
class TemplateListItem extends Component {
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
export default TemplateListItem

TemplateListItem.propTypes = {
  removeThis: PropTypes.string.isRequired
}