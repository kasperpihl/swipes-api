import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { map, list } from 'react-immutable-proptypes';
import GoalsUtil from 'classes/goals-util';
import { fromJS } from 'immutable';
import SWView from 'SWView';
import Button from 'Button';
import SelectStep from 'context-menus/select-step/SelectStep';
import HOCAssigning from 'components/assigning/HOCAssigning';
import GoalHandoff from './GoalHandoff';
import HandoffStatus from './HandoffStatus';

class HOCGoalHandoff extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      errorLabel: null,
      handoff: fromJS({
        flags: [],
        assignees: props.assignees || null,
        message: props.message || '',
        target: props._target,
      }),
    };
    this.onChangeClick = this.onChangeClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    const { goal, navPop } = this.props;
    if (!goal) {
      navPop();
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

    this.setState({ isSubmitting: true, errorLabel: null });
    completeStep(goal.get('id'), handoff).then((res) => {
      if (res && res.ok) {
        const event = handoff.get('target') === '_complete' ? 'Complete goal' : 'Complete step';
        window.analytics.sendEvent(event);
        navPop();
      } else {
        this.setState({
          isSubmitting: false,
          errorLabel: 'Something went wrong',
        });
      }
    });
  }
  onNotify(target) {
    const { goalNotify, goal, navPop } = this.props;
    const { handoff } = this.state;
    this.setState({ isSubmitting: true, errorLabel: null });
    goalNotify(goal.get('id'), handoff).then((res) => {
      if (res && res.ok) {
        window.analytics.sendEvent('Notify');
        navPop();
      } else {
        this.setState({
          isSubmitting: false,
          errorLabel: 'Something went wrong',
        });
      }
    });
  }
  onSubmit() {
    const { handoff } = this.state;
    if (['_feedback', '_notify'].indexOf(handoff.get('target')) !== -1) {
      this.onNotify(handoff.get('target'));
    } else {
      this.onCompleteStep();
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
    const { handoff } = this.state;
    const helper = this.getHelper();
    const { goal, contextMenu } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    };
    if (type === 'step') {
      let number = helper.getCurrentStepIndex();
      // helper.getStepIndexForId(handoff.get('target'));
      if (typeof number === 'undefined') {
        number = goal.get('step_order').size;
      }
      contextMenu({
        options,
        component: SelectStep,
        props: {
          steps: helper.getOrderedSteps(),
          numberOfCompleted: number,
          onClick: (i) => {
            if (i >= number) {
              i += 1;
            }
            const step = helper.getStepByIndex(i);
            const target = step && step.get('id');
            contextMenu(null);
            this.setState({
              handoff: handoff.set('assignees', null).set('target', target || '_complete'),
            });
          },
        },
      });
    } else {
      const step = helper.getStepById(handoff.get('target'));
      let newAssignees = handoff.get('assignees');
      if (!newAssignees && step) {
        newAssignees = step.get('assignees');
      }
      this.onSelectAssignees(options, newAssignees);
    }
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  getAssignees() {
    const { handoff } = this.state;

    const helper = this.getHelper();
    let assignees = handoff.get('assignees');
    if (!assignees && !handoff.get('target').startsWith('_')) {
      const nextStep = helper.getStepById(handoff.get('target'));
      if (nextStep) {
        assignees = nextStep.get('assignees');
      }
    }
    return assignees;
  }
  getTitle() {
    const { handoff } = this.state;
    const helper = this.getHelper();

    let label = 'Complete Step';
    if (handoff.get('target') === '_complete') {
      label = 'Complete Goal';
    } else if (handoff.get('target') === '_notify') {
      label = 'Send Notification';
    } else if (handoff.get('target') === '_feedback') {
      label = 'Give Feedback';
    } else {
      const nextStepIndex = helper.getStepIndexForId(handoff.get('target'));
      const numberOfCompleted = helper.getNumberOfCompletedSteps();
      if (nextStepIndex === numberOfCompleted) {
        label = 'Reassign Step';
      }
      if (nextStepIndex < numberOfCompleted) {
        label = 'Make Iteration';
      }
    }
    return label;
  }
  clickedAssign(index, e) {
    this.onChangeClick('assignees', e);
  }
  renderAssignees() {
    const { handoff } = this.state;
    if (handoff.get('target') === '_complete') {
      return undefined;
    }

    const assignees = this.getAssignees();

    return (
      <div className="goal-handoff__assignees">
        <HOCAssigning
          delegate={this}
          assignees={assignees}
          rounded
        />
      </div>
    );
  }
  renderHeader() {
    return (
      <div className="goal-handoff__header">
        <div className="goal-handoff__content">
          <div className="goal-handoff__title">{this.getTitle()}</div>
          <div className="goal-handoff__subtitle">
            {this.renderStatus()}
          </div>
        </div>
        {this.renderAssignees()}

      </div>
    );
  }
  renderStatus() {
    const { goal } = this.props;
    const { handoff } = this.state;
    const assignees = this.getAssignees();

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
      errorLabel,
    } = this.state;
    const helper = this.getHelper();

    let label = 'Complete step';
    if (handoff.get('target') === '_complete') {
      label = 'Complete goal';
    } else if (handoff.get('target') === '_notify') {
      label = 'Send notification';
    } else if (handoff.get('target') === '_feedback') {
      label = 'Give feedback';
    } else {
      const nextStepIndex = helper.getStepIndexForId(handoff.get('target'));
      const currentStepIndex = helper.getCurrentStepIndex();
      if (nextStepIndex === currentStepIndex) {
        label = 'Reassign Step';
      }
      if (nextStepIndex < currentStepIndex) {
        label = 'Make Iteration';
      }
    }

    return (
      <div className="handoff-footer">
        <div className="handoff-footer__status">
          {this.renderStatus()}
        </div>
        <div className="handoff-footer__actions">
          <Button
            text={label}
            onClick={this.onSubmit}
            loading={isSubmitting}
            errorLabel={errorLabel}
            primary
          />
        </div>
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
      <SWView header={this.renderHeader()} footer={this.renderFooter()}>
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

const { func, string } = PropTypes;
HOCGoalHandoff.propTypes = {
  navPop: func,
  selectStep: func,
  assignees: list,
  message: string,
  goalNotify: func,
  contextMenu: func,
  selectAssignees: func,
  _target: string.isRequired,
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
  contextMenu: a.main.contextMenu,
})(HOCGoalHandoff);
