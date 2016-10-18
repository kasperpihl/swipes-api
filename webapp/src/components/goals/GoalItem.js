import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import './styles/goal-item.scss'
import { randomStatusLabel } from '../../classes/utils'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class GoalItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.clickedListItem = this.clickedListItem.bind(this);
  }
  clickedListItem(){
    const { onClick, data } = this.props;
    if(onClick){
      onClick(data.get('id'));
    }
  }
  componentDidMount() {
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
  renderIcon(icon){
    const Comp = Icons[icon];
    if(Comp){
      return <Comp className="goal-item__icon goal-item__icon--svg"/>;
    }
    return <i className="material-icons goal-item__icon goal-item__icon--font">{icon}</i>
  }
  render() {
    const { data } = this.props;
    let rootClass = 'goal-item';
    console.log(data.toJS());
    return (
      <div className={rootClass} onClick={this.clickedListItem}>
        <div className={rootClass + "__image"}>
          {this.renderIcon(data.get('img'))}
        </div>
        <div className={rootClass + "__content"}>
          <div className={rootClass + "__title"}>{data.get('title')}</div>
          <div className={rootClass + "__label"}>{randomStatusLabel()}</div>
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
