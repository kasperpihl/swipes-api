import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import { setupDelegate } from 'react-delegate';
import Icon from 'Icon';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import PlanProgressTooltip from '../plan-progress-tooltip/PlanProgressTooltip';
import SW from './PlanListItem.swiss';

@connect(state => ({
  goals: state.get('goals'),
}), {
  tooltip: mainActions.tooltip,
})

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      goals: this.getFilteredGoals(props.plan),
    };
    setupDelegate(this, 'onOpenMilestone').setGlobals(props.plan.get('id'));
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      goals: this.getFilteredGoals(nextProps.plan),
    });
  }
  showTooltip = (e) => {
    const { tooltip } = this.props;
    const data = {
      component: PlanProgressTooltip,
      props: {
        numberOfGoals: this.numberOfGoals,
        numberOfCompletedGoals: this.numberOfCompletedGoals,
        numberOfStepsLeft: this.numberOfStepsLeft,
      },
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        position: 'top',
        delay: 100,
      }
    }

    tooltip(data);
  }
  hideTooltip = () => {
    const { tooltip } = this.props;

    tooltip(null);
  }
  getFilteredGoals(plan) {
    return msgGen.milestones.getGoals(plan);
  }
  getProgress() {
    const { plan } = this.props;
    if(plan.get('closed_at')) {
      return [100, 100];
    }
    const { goals } = this.state;
    const numberOfGoals = goals.size;
    let numberOfSteps = 0;
    let numberOfCompletedSteps = 0;
    const numberOfCompletedGoals = goals.filter(g => {
      const goal = new GoalsUtil(g);
      if(!goal.getIsCompleted()) {
        const dSteps = goal.getNumberOfSteps();
        if(dSteps) {
          numberOfSteps += dSteps;
          numberOfCompletedSteps += goal.getNumberOfCompletedSteps();
        } else {
          numberOfSteps += 1;
        }
      } 
      return goal.getIsCompleted();
    }).size;
    const percentage = numberOfGoals ? parseInt((numberOfCompletedGoals / numberOfGoals) * 100, 10) : 0;

    const stepPercentage = numberOfSteps ? parseInt((numberOfCompletedSteps / numberOfSteps) * 100, 10) : 0;

    this.numberOfCompletedGoals = numberOfCompletedGoals;
    this.numberOfGoals = numberOfGoals;
    this.numberOfStepsLeft = numberOfSteps - numberOfCompletedSteps;

    
    return [percentage, stepPercentage];

  }
  render() {
    const { plan } = this.props;
    const [goalPercentage, stepPercentage] = this.getProgress();
    return (
      <SW.Wrapper onClick={this.onOpenMilestone} className="hover-class">
        <SW.ProgressBar
          onClick={this.hideTooltip}
          onMouseEnter={this.showTooltip}
          onMouseLeave={this.hideTooltip}
          goalPercentage={goalPercentage}
          stepPercentage={stepPercentage}
        />
        <SW.TextWrapper>
          <SW.Title>{plan.get('title')}</SW.Title>
        </SW.TextWrapper>
      </SW.Wrapper>
    );
  }
}
