import React, { Component, PropTypes } from 'react'
import GoalListItem from './GoalListItem.js'

class GoalList extends Component {
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

export default GoalList
