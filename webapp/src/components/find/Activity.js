import React, { Component, PropTypes } from 'react'
class Activity extends Component {
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
export default Activity

Activity.propTypes = {
  removeThis: PropTypes.string.isRequired
}