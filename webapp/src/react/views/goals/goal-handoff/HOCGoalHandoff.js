import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { map } from 'react-immutable-proptypes';
import GoalsUtil from 'classes/goals-util';
import { fromJS } from 'immutable';
import SWView from 'SWView';
import GoalHandoff from './GoalHandoff';
import GoalActions from './GoalActions';
import HandoffStatus from './HandoffStatus';

class HOCGoalHandoff extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      handoff: this.getEmptyHandoff(props.notify ? '_notify' : undefined),
    };
    this.onChangeClick = this.onChangeClick.bind(this);
  }
  componentDidMount() {
    const { openAssignees, goal, navPop } = this.props;
    if (!goal) {
      navPop();
    } else if (openAssignees) {
      this.onSelectAssignees(openAssignees.toJS(), fromJS([]));
    }
  }
  componentWillReceiveProps(nextProps) {
    const { goal, navPop } = this.props;
    const nextGoal = nextProps.goal;
    if (goal && !nextGoal) {
      navPop();
    }
  }
  onCompleteStep() {
    const { completeStep, goal, navPop } = this.props;
    const { handoff } = this.state;

    this.setState({ isSubmitting: true });
    completeStep(goal.get('id'), handoff).then((res) => {
      this.setState({ isSubmitting: false });
      if (res && res.ok) {
        const event = handoff.get('target') === '_complete' ? 'Complete goal' : 'Complete step';
        window.analytics.sendEvent(event);
        navPop();
      }
    });
  }
  onNotify() {
    const { goalNotify, goal, navPop } = this.props;
    const { handoff } = this.state;
    this.setState({ isSubmitting: true });
    goalNotify(goal.get('id'), handoff).then((res) => {
      this.setState({ isSubmitting: false });
      if (res && res.ok) {
        window.analytics.sendEvent('Notify');
        navPop();
      }
    });
  }
  onGoalAction(type) {
    const { handoff } = this.state;
    if (type === 'primary') {
      if (handoff.get('target') === '_notify') {
        this.onNotify();
      } else {
        this.onCompleteStep();
      }
    } else {
      const { navPop } = this.props;
      navPop();
    }
  }
  onFlag(id) {
    let { handoff } = this.state;
    if (handoff.get('flags').includes(id)) {
      handoff = handoff.updateIn(['flags'], fl => fl.filter(f => f !== id));
    } else {
      handoff = handoff.updateIn(['flags'], fl => fl.push(id));
    }
    this.setState({ handoff });
  }
  onSelectAssignees(options, newAssignees) {
    const { selectAssignees } = this.props;

    selectAssignees(options, newAssignees.toJS(), (assignees) => {
      const { handoff } = this.state;
      if (assignees) {
        this.setState({ handoff: handoff.set('assignees', fromJS(assignees)) });
      }
    });
  }
  onHandoffChange(handoffText) {
    const { handoff } = this.state;
    this.setState({ handoff: handoff.set('message', handoffText) });
  }
  onChangeClick(type, e) {
    let { handoff } = this.state;
    const helper = this.getHelper();
    const { goal, selectStep } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    };
    if (type === 'step') {
      selectStep(options, goal.get('id'), handoff.get('target'), (newStepId) => {
        if (newStepId !== handoff.get('target')) {
          this.setState({
            handoff: handoff.set('assignees', null).set('target', newStepId || '_complete'),
          });
          if (newStepId === helper.getCurrentStepId()) {
            this.onSelectAssignees(options, helper.getCurrentStep().get('assignees'));
          }
        }
      });
    } else {
      if (type === 'from') {
        const newState = {};
        if (handoff.get('target') !== helper.getCurrentStepId()) {
          newState.handoff = handoff = handoff.set('target', helper.getCurrentStepId()).set('assignees', null);
        }
        this.setState(newState);
      }
      const step = helper.getStepById(handoff.get('target'));
      let newAssignees = handoff.get('assignees');
      if (!newAssignees && step) {
        newAssignees = step.get('assignees');
      }
      this.onSelectAssignees(options, newAssignees);
    }
  }
  getEmptyHandoff(target, message) {
    return fromJS({
      flags: [],
      assignees: (target === '_notify') ? [] : null,
      message: message || '',
      target: target || this.calculateNextStep(),
    });
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  calculateNextStep(goal) {
    const helper = this.getHelper(goal);
    const nextStep = helper.getNextStep();
    return nextStep ? nextStep.get('id') : '_complete';
  }
  renderStatus() {
    const { goal } = this.props;
    const { handoff } = this.state;

    const helper = this.getHelper();
    let assignees = handoff.get('assignees');
    if (!assignees && !handoff.get('target').startsWith('_')) {
      const nextStep = helper.getStepById(handoff.get('target'));
      assignees = nextStep.get('assignees');
    }

    return (
      <HandoffStatus
        goal={goal}
        assignees={assignees}
        toId={handoff.get('target')}
        onChangeClick={this.onChangeClick}
      />
    );
  }
  renderFooter() {
    const {
      handoff,
      isSubmitting,
    } = this.state;
    const helper = this.getHelper();

    let primaryLabel = 'Complete step';
    const secondaryLabel = 'Cancel';
    if (handoff.get('target') === '_complete') {
      primaryLabel = 'Complete Goal';
    } else if (handoff.get('target') === '_notify') {
      primaryLabel = 'Send Notification';
    } else {
      const nextStepIndex = helper.getStepIndexForId(handoff.get('target'));
      const currentStepIndex = helper.getCurrentStepIndex();
      if (nextStepIndex === currentStepIndex) {
        primaryLabel = 'Reassign Step';
      }
      if (nextStepIndex < currentStepIndex) {
        primaryLabel = 'Make Iteration';
      }
    }

    return (
      <div className="goal-handoff__action-bar">
        <GoalActions
          delegate={this}
          secondaryLabel={secondaryLabel}
          primaryLabel={primaryLabel}
          primaryLoading={isSubmitting}
        >
          {this.renderStatus()}
        </GoalActions>
      </div>
    );
  }
  render() {
    const {
      goal,
      me,
      users,
    } = this.props;
    const {
      isSubmitting,
      handoff,
    } = this.state;

    if (!goal) {
      return <div />;
    }

    return (
      <SWView footer={this.renderFooter()}>
        <GoalHandoff
          goal={goal}
          me={me}
          users={users}
          delegate={this}
          handoff={handoff}
          isSubmitting={isSubmitting}
        />
      </SWView>
    );
  }
}

const { func, bool } = PropTypes;
HOCGoalHandoff.propTypes = {
  navPop: func,
  notify: bool,
  selectStep: func,
  goalNotify: func,
  selectAssignees: func,
  openAssignees: map,
  completeStep: func,
  goal: map,
  me: map,
  users: map,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  selectAssignees: a.goals.selectAssignees,
  goalNotify: a.goals.notify,
  selectStep: a.goals.selectStep,
  completeStep: a.goals.completeStep,
})(HOCGoalHandoff);
