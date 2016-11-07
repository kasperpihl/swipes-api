import React, { Component, PropTypes } from 'react'
import Assigning from '../assigning/Assigning'
import { AssignIcon } from '../icons'

import './styles/workflow-steplist-item.scss'

class WorkflowStepListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.clickedAssign = this.clickedAssign.bind(this)
  }
  componentDidMount() {
  }
  clickedAssign(e){
    this.props.clickedAssign(e, this.props.index);
  }
  renderAssigneeTooltip(names) {
    if (names.length <= 1) {
      return;
    }

    const nameList = names.map( (name, i) => {
      return <div className="workflow__step-item__tooltip-item" key={'tooltip-item-' + i}>{name.name}</div>
    })

    return (
      <div className="workflow__step-item__tooltip">
        {nameList}
      </div>
    )
  }
  renderAssigning(assignees) {
    if (assignees.length < 1) {

      return (
        <div className="workflow__step-item__icons" onClick={this.clickedAssign}>
          <AssignIcon className="workflow__step-item__icon workflow__step-item__icon--assign" />
        </div>
      )
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
        assigneesCountEl = <div className="workflow__step-item__assignee-count">{'+' + assigneesCount}</div>
      }

      return (
        <div className="workflow__step-item__assignees">
          <div className="workflow__step-item__assignee"><img src={profileImg}/></div>
          {assigneesCountEl}
          {this.renderAssigneeTooltip(assigneeNames)}
        </div>
      )
    }
  }
  render() {

    let rootClass = 'workflow__step-item';
    const { title, type, index, assignees } = this.props;

    return (
      <div className={rootClass}>
        <div className={`${rootClass}__number`}>{index + 1}</div>
        <div className={`${rootClass}__content`}>
          <div className={`${rootClass}__title`}>{title}</div>
          <div className={`${rootClass}__type`}>{type}</div>
        </div>
        <div className={`${rootClass}__assigning`}>
          <Assigning assignees={assignees} editable={true} clickAssign={this.clickedAssign}/>
        </div>
      </div>
    )
  }
}

export default WorkflowStepListItem

const { string, func } = PropTypes;

WorkflowStepListItem.propTypes = {
  clickedAssign: func.isRequired
}
