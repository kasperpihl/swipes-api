import React, { Component, PropTypes } from 'react'
import './styles/goal-step-header.scss'
import { CheckmarkIcon } from '../icons'

class GoalStepHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.clickedHeader = this.clickedHeader.bind(this);
  }
  componentDidMount() {
  }
  renderIndicator(index, completed) {
    let content;
    let className = "step-header__indicator";

    if (completed) {
      content = <CheckmarkIcon />;
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
  clickedHeader(){
    const { onClick } = this.props;
    const { index } = this.props.data;
    if(onClick && !window.getSelection().toString().length){
      onClick(index);
    }
  }
  render() {
    const { active, isLast } = this.props;
    const { index, step } = this.props.data;
    let className = 'step-header';

    if (active) {
      className += ' step-header--active'
    }
    if(isLast){
      className += ' step-header--last'
    }

    if (step.completed) {
      className += ' step-header--completed'
    }

    return (
      <div className={className} onClick={this.clickedHeader}>
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

const { string, number, shape, bool, func } = PropTypes;

GoalStepHeader.propTypes = {
  active: bool,
  onClick: func,
  index: number,
  step: shape({
    completed: bool,
    title: string,
    type: string,
    assignees: shape({
      img: string,
      count: number
    })
  })

}
