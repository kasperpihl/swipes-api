import React, { Component, PropTypes } from 'react'
import GoalsListItem from './GoalsListItem.js'

class GoalsList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderList(){

  }
  render() {
    return (
      <div className="goals-list">
        {this.renderList()}
      </div>
    )
  }
}

export default GoalsList
