import React, { Component, PropTypes } from 'react'
import './styles/goal-step-header.scss'
import * as Icons from '../icons'

class StepHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.clickedHeader = this.clickedHeader.bind(this);
  }
  componentDidMount() {
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="step-header__icon"/>;
    }
  }
  renderIndicator(index, completed) {
    let content;
    let className = 'step-header__indicator';

    if (completed) {
      className += ' step-header__indicator--completed';
      content = this.renderIcon('CheckmarkIcon');
    } else if (!completed && index) {
      className += ' step-header__indicator--index';
      content = index;
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

    if (step.completed) {
      className += ' step-header--completed'
    }

    return (
      <div className={className} onClick={this.clickedHeader}>
        {this.renderIndicator(index, step.completed)}
        <div className="step-header__title">{step.title}</div>
        {this.renderAssignees(step.assignees)}
      </div>
    )
  }
}
export default StepHeader

const { string, number, shape, bool, func } = PropTypes;

StepHeader.propTypes = {
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
