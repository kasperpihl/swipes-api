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
  renderAssigneeTooltip(names) {
    if (names.length <= 1) {
      return;
    }

    const nameList = names.map( (name, i) => {
      return <div className="step-header__tooltip-item" key={'tooltip-item-' + i}>{name.name}</div>
    })

    return (
      <div className="step-header__tooltip">
        {nameList}
      </div>
    )
  }
  renderAssignees(assignees) {
    if (assignees.length < 1) {
      return;
    } else {
      let profileImg = "http://www.avatarys.com/var/albums/Cool-Avatars/Facebook-Avatars/500x500-facebook-avatars/cute-fluffy-monster-facebook-avatar-500x500.png?m=1455128230";
      let assigneesCount = assignees.length - 1;
      let assigneesCountEl = '';
      let assigneeNames = assignees.filter( (assignee) => (assignee.name));
      const profilesOnly = assignees.filter( (assignee) => (assignee.profile_pic));

      if (profilesOnly.length) {
        profileImg = profilesOnly[0].profile_pic;
      }

      if (assigneesCount > 0) {
        assigneesCountEl = <div className="step-header__assignee-count">{'+' + assigneesCount}</div>
      }

      return (
        <div className="step-header__assignees">
          <div className="step-header__assignee"><img src={profileImg}/></div>
          {assigneesCountEl}
          {this.renderAssigneeTooltip(assigneeNames)}
        </div>
      )
    }
  }
  clickedHeader(e){
    const { onClick, index } = this.props;
    if(onClick && !window.getSelection().toString().length){
      onClick(index);
      e.preventDefault();
      e.stopPropagation();
    }
  }
  render() {
    let { active, isLast, index, step } = this.props;
    step = step.toJS();

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
