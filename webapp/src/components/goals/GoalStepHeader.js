import React, { Component, PropTypes } from 'react'
import './styles/goal-step-header.scss'

class GoalStepHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderIndicator(index, completed) {
    let content;
    let className = "step-header__indicator";

    if (completed) {
      content = <i className="material-icons">check_circle</i>;
      className += ' step-header__indicator--completed';
    } else if (!completed && index) {
      content = index;
      className += ' step-header__indicator--index';
    }

    return (
      <div className={className}>
        {content}
      </div>
    )
  }
  renderAssignees(assignees) {
    let img;
    let count: '';

    if (assignees.img) {
      img = assignees.img
    } else {
      img = 'http://www.avatarys.com/var/albums/Cool-Avatars/Facebook-Avatars/500x500-facebook-avatars/cute-fluffy-monster-facebook-avatar-500x500.png?m=1455128230'
    }

    if (assignees.count > 1) {
      count = assignees.count + '+'
    }

    return (
      <div className="step-header__assignees">
        <img src={img} />
        <div className="step-header__assignees__count">{count}</div>
      </div>
    )
  }
  render() {
    const { index, step } = this.props.data;
    let className = 'step-header';

    if (step.active) {
      className += ' step-header--active'
    }

    if (step.completed) {
      className += ' step-header--completed'
    }

    return (
      <div className={className}>
        {this.renderIndicator(index, step.completed)}
        <div className="step-header__content">
          <div className="step-header__title">{step.title}</div>
          <div className="step-header__type">{step.type}</div>
        </div>
        {this.renderAssignees(step.assignees)}
      </div>
    )
  }
}
export default GoalStepHeader

const { string, number, shape, bool } = PropTypes;

GoalStepHeader.propTypes = {
  index: number,
  completed: bool,
  active: bool,
  title: string,
  type: string,
  assignees: shape({
    img: string,
    count: number
  })
}
