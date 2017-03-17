import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { cache, goals } from 'swipes-core-js';
import { map, list } from 'react-immutable-proptypes';
import GoalsUtil from 'classes/goals-util';
import { setupLoadingHandlers } from 'classes/utils';
import { fromJS } from 'immutable';

import SelectStep from 'context-menus/select-step/SelectStep';

import GoalHandoff from './GoalHandoff';


class HOCGoalHandoff extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);
    const savedState = props.savedState && props.savedState.get('handoff');
    this.state = {
      handoff: savedState || fromJS({
        flags: [],
        assignees: props.assignees || null,
        message: props.message || '',
        target: props._target,
      }),
    };
    setupLoadingHandlers(this);
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

    this.setLoadingState('button');
    completeStep(goal.get('id'), handoff).then((res) => {
      if (res && res.ok) {
        const event = handoff.get('target') === '_complete' ? 'Complete goal' : 'Complete step';
        window.analytics.sendEvent(event);
        navPop();
      } else {
        this.clearLoadingState('button', '!Something went wrong');
      }
    });
  }
  onStartGoal() {
    const { goalStart, goal, navPop } = this.props;
    const { handoff } = this.state;

    this.setLoadingState('button');
    goalStart(goal.get('id'), handoff).then((res) => {
      if (res && res.ok) {
        window.analytics.sendEvent('Start goal');
        navPop();
      } else {
        this.clearLoadingState('button', '!Something went wrong');
      }
    });
  }
  onNotify() {
    const { goalNotify, goal, navPop } = this.props;
    const { handoff } = this.state;
    this.setLoadingState('button');
    goalNotify(goal.get('id'), handoff).then((res) => {
      if (res && res.ok) {
        window.analytics.sendEvent('Notify');
        navPop();
      } else {
        this.clearLoadingState('button', '!Something went wrong');
      }
    });
  }
  onSubmit() {
    const { handoff } = this.state;
    if (['_feedback', '_notify'].indexOf(handoff.get('target')) !== -1) {
      this.onNotify(handoff.get('target'));
    } else if (['_start'].indexOf(handoff.get('target')) !== -1) {
      this.onStartGoal();
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
    this.updateHandoff(handoff);
  }
  onSelectAssignees(options, newAssignees) {
    const { selectAssignees } = this.props;

    selectAssignees(Object.assign({ actionLabel: 'Done' }, options), newAssignees.toJS(), (assignees) => {
      const { handoff } = this.state;
      if (assignees) {
        this.updateHandoff(handoff.set('assignees', fromJS(assignees)));
      }
    });
  }
  onHandoffChange(handoffText) {
    const { handoff } = this.state;
    this.updateHandoff(handoff.set('message', handoffText));
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
            this.updateHandoff(handoff.set('assignees', null).set('target', target || '_complete'));
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

  updateHandoff(handoff) {
    this.setState({ handoff });
    // const { saveState } = this.props;
    // saveState({ handoff });
  }
  clickedAssign(index, e) {
    this.onChangeClick('assignees', e);
  }

  render() {
    const {
      goal,
      me,
      users,
    } = this.props;
    const {
      handoff,
    } = this.state;

    if (!goal) {
      return <div />;
    }

    return (

      <GoalHandoff
        goal={goal}
        assignees={this.getAssignees()}
        me={me}
        users={users}
        delegate={this}
        handoff={handoff}
        loadingState={this.getAllLoadingStates()}
      />

    );
  }
}

const { func, string, object } = PropTypes;
HOCGoalHandoff.propTypes = {
  navPop: func,
  assignees: list,
  savedState: object,
  message: string,
  goalNotify: func,
  goalStart: func,
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
  saveCache: cache.save,
  goalNotify: goals.notify,
  goalStart: goals.start,
  completeStep: goals.completeStep,
  contextMenu: a.main.contextMenu,
})(HOCGoalHandoff);
