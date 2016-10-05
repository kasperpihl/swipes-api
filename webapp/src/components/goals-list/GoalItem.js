import React, { Component, PropTypes } from 'react'
import './styles/goal-item.scss'

class GoalItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const { img, title, status } = this.props.data;
    let rootClass = 'goal';

    return (
      <div className={rootClass}>
        <div className="goal__image">
          <img src={img} />
        </div>
        <div className="goal__content">
          <div className="goal__title">{title}</div>
          <div className="goal__progress"></div>
          <div className="goal__label">{status.label}</div>
        </div>
      </div>
    )
  }
}

export default GoalItem

const { string } = PropTypes;

GoalItem.propTypes = {
  // removeThis: string.isRequired
}
