import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import HOCAssigning from 'components/assigning/HOCAssigning';
import SW from './GoalListSection.swiss';

class GoalListSection extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this, 'onGoalSectionClick');
  }
  renderLeftSide() {
    const { icon, title, id } = this.props;

    return (
      <SW.Side onClick={this.onGoalSectionClickCached(id)}>
        <SW.MiniSVG icon={icon} className='miniSVG'/>
        <SW.Title className='title'>
          {title}
        </SW.Title>
      </SW.Side>
    )
  }
  renderRightSide() {
    const { milestoneId } = this.props;

    if (milestoneId === 'none') return null;

    const assignees = msgGen.milestones.getAssignees(milestoneId);

    if (!assignees || !assignees.size) return null;

    return (
      <HOCAssigning
        enableTooltip
        assignees={assignees}
        maxImages={5}
        size={26}
      />
    );
  }
  renderGoals() {
    const { children } = this.props;

    return (
      <SW.Children>
        {children}
      </SW.Children>
    )
  }
  render() {
    return (
      <SW.Wrapper>
        <SW.Header>
          {this.renderLeftSide()}
          {this.renderRightSide()}
        </SW.Header>
        {this.renderGoals()}
      </SW.Wrapper>
    )
  }
}

export default GoalListSection;
