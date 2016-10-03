import React, { Component, PropTypes } from 'react'
class GoalsList extends Component {
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
export default GoalsList

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
GoalsList.propTypes = {
  removeThis: string.isRequired
}