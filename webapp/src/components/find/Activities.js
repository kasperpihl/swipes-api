import React, { Component, PropTypes } from 'react'
class Activities extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderActivities(){
    
  }
  render() {
    return (
      <div></div>
    )
  }
}
export default Activities

Activities.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.object)
}