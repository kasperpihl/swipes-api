import React, { PureComponent, PropTypes } from 'react';
import { styleElement } from 'react-swiss';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import { setupDelegate } from 'react-delegate';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import Icon from 'Icon';
import styles from './PlanListItem.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const ProgressBar = styleElement('div', styles.ProgressBar).debug();
const TextWrapper = styleElement('div', styles.TextWrapper);
const Title = styleElement('div', styles.Title);
const Subtitle = styleElement('div', styles.Subtitle);

class PlanListItem extends PureComponent {
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

    this.goalPercentage = percentage;
    this.stepPercentage = stepPercentage;
    
    return [percentage, stepPercentage];

  }
  render() {
    const { plan } = this.props;
    const [goalPercentage, stepPercentage] = this.getProgress();
    return (
      <Wrapper onClick={this.onOpenMilestone} className="hover-class">
        <ProgressBar
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          goalPercentage={goalPercentage}
          stepPercentage={stepPercentage}
        />
        <TextWrapper>
          <Title>{plan.get('title')}</Title>
        </TextWrapper>
      </Wrapper>
    );
  }
}

export default connect(state => ({
  goals: state.get('goals'),
}), {
  tooltip: mainActions.tooltip,
})(PlanListItem);
