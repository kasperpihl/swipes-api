import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';

import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning2';
import './styles/goal-list-section.scss';

class GoalListSection extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this, 'onGoalSectionClick');
  }
  renderLeftSide() {
    const { icon, title, id } = this.props;

    return (
      <div className="goal-list-section__side" onClick={this.onGoalSectionClickCached(id)}>
        <Icon className="goal-list-section__mini-svg" icon={icon} />
        <div className="goal-list-section__title">
          {title}
        </div>
      </div>
    )
  }
  renderRightSide() {
    const { milestoneId } = this.props;
    
    if (milestoneId === 'none') return null;

    const assignees = msgGen.milestones.getAssignees(milestoneId);

    if (!assignees || !assignees.size) return null;

    return (
      <HOCAssigning
        assignees={assignees}
        maxImages={5}
        size={26}
      />
    );
  }
  renderGoals() {
    const { children } = this.props;

    return (
      <div className="goal-list-section__children">
        {children}
      </div>
    )
  }
  render() {
    return (
      <div className="goal-list-section">
        <div className="goal-list-section__header">
          {this.renderLeftSide()}
          {this.renderRightSide()}
        </div>
        {this.renderGoals()}
      </div>
    )
  }
}

export default GoalListSection;
