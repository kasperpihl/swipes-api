import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setupDelegate } from 'react-delegate';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Icon from 'Icon';

import sw from './PlanListItem.swiss';
const Wrapper = element('div', sw.Wrapper);

class PlanListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      goals: this.getFilteredGoals(props.milestone),
    };
    setupDelegate(this, 'onOpenMilestone').setGlobals(props.milestone.get('id'));
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      goals: this.getFilteredGoals(nextProps.milestone),
    });
  }
  getFilteredGoals(milestone) {
    return msgGen.milestones.getGoals(milestone);
  }
  renderProgress() {
    const { milestone } = this.props;
    const { goals } = this.state;
    const numberOfGoals = goals.size;
    const numberOfCompletedGoals = goals.filter(g => new GoalsUtil(g).getIsCompleted()).size;
    const percentage = numberOfGoals ? parseInt((numberOfCompletedGoals / numberOfGoals) * 100, 10) : 0;
    const svgDashOffset = PROGRESS_DASH - ((PROGRESS_DASH * percentage) / 100);

  }
  render() {
    return (
      <div className="milestone" onClick={this.onOpenMilestone}>
        {this.renderHeader()}
        {this.renderProgress()}
      </div>
    );
  }
}

export default connect(state => ({
  goals: state.get('goals'),
}))(PlanListItem);
