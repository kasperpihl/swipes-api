import React, { Component, PropTypes } from 'react'
import GoalItem from './GoalItem'
import './styles/goals-list.scss'

class GoalsList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const { data } = this.props;
    let rootClass = 'goals-list';

    const listItems = data.map((item, i) => {
      return (
        <GoalItem data={item} key={'goal-list-item-' + i}/>
      )
    })

    return (
      <div className={rootClass}>{listItems}</div>
    )
  }
}

export default GoalsList

const { string } = PropTypes;

GoalsList.propTypes = {

}
