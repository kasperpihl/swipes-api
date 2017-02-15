import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import Measure from 'react-measure';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalsUtil from 'classes/goals-util';
import { setupDelegate, bindAll } from 'classes/utils';
import ListMenu from 'components/list-menu/ListMenu';
import Button from 'Button';
import SWView from 'src/react/app/view-controller/SWView';
import HOCBreadCrumbs from 'components/bread-crumbs/HOCBreadCrumbs';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import GoalStep from './GoalStep';
import GoalSide from './GoalSide';

import './styles/goal-step';

class HOCGoalStep extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        icon: 'ThreeDots',
      },
    }];
  }
  constructor(props) {
    super(props);
    this.state = {
      isHandingOff: false,
      isSendingNotification: false,
      isSubmitting: false,
      handoff: this.getEmptyHandoff(),
      showSide: true,
    };

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['onHandoffChange', 'onOpenUser', 'onChangeClick', 'onMeasure', 'onContextClick']);
    this.callDelegate = setupDelegate(props.delegate);
  }

  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  componentWillReceiveProps(nextProps) {
    const { goal, navPop } = this.props;
    const nextGoal = nextProps.goal;
    if (goal && !nextGoal) {
      navPop();
    }
    if (nextGoal && goal) {
      if (nextGoal.getIn(['status', 'handoff_at']) !== goal.getIn(['status', 'handoff_at'])) {
        this.setState({
          isHandingOff: false,
          handoff: this.getEmptyHandoff(this.calculateNextStep(nextGoal)),
        });
      }
    }
  }
  onMeasure(dim) {
    if (dim.width < 1200) {
      this.setState({ showSide: false });
    } else {
      this.setState({ showSide: true });
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

  onContextClick(e) {
    const {
      goal,
      archive,
      contextMenu,
      saveWay,
    } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
    contextMenu({
      options,
      component: ListMenu,
      props: {
        items: [
          {
            title: 'Save as a Way',
            onClick: () => {
              const helper = this.getHelper();
              saveWay(options, helper.getObjectForWay());
            },
          },
          {
            title: 'Archive Goal',
            onClick: () => {
              archive(goal.get('id'));
              contextMenu(null);
            },
          },
        ],
      },
    });
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
        const newState = { isHandingOff: true };
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
  onCompleteStep(e) {
    const { completeStep, goal } = this.props;
    const { handoff } = this.state;

    this.setState({ isSubmitting: true });
    completeStep(goal.get('id'), handoff).then(() => {
      this.setState({ isSubmitting: false });
    });
  }
  onNotify() {
    const { goalNotify, goal } = this.props;
    const { handoff } = this.state;
    this.setState({ isSubmitting: true });
    goalNotify(goal.get('id'), handoff).then((res) => {
      if (res && res.ok) {
        this.setState({
          isSubmitting: false,
          handoff: this.getEmptyHandoff(),
          isHandingOff: false,
        });
      } else {
        this.setState({ isSubmitting: false });
      }
    });
  }
  onGoalAction(type, e) {
    const { handoff, isHandingOff } = this.state;
    if (type === 'primary') {
      // Submissions!
      if (isHandingOff) {
        if (handoff.get('target') === '_notify') {
          this.onNotify();
        } else {
          this.onCompleteStep();
        }
      } else {
        this.setState({ isHandingOff: true });
      }
    } else if (this.state.isHandingOff) {
      const newState = { isHandingOff: false };
      if (handoff.get('target') === '_notify') {
        newState.handoff = handoff.set('target', this.calculateNextStep());
      }
      this.setState(newState);
    } else {
      this.onSelectAssignees({
        boundingRect: e.target.getBoundingClientRect(),
        alignX: 'center',
        alignY: 'bottom',
      }, fromJS([]));

      this.setState({
        isHandingOff: true,
        handoff: handoff.set('target', '_notify').set('assignees', fromJS([])),
      });
    }
  }
  onHandoffChange(handoffText) {
    const { handoff } = this.state;
    this.setState({ handoff: handoff.set('message', handoffText) });
  }
  onOpenUser(id) {
    const { openSlackIn, navSet } = this.props;
    navSet('primary', 'slack');
    openSlackIn(this.slackUserIdForUser(id));
  }
  getHelper(overwriteGoal) {
    const { goal, me } = this.props;
    overwriteGoal = overwriteGoal || goal;
    return new GoalsUtil(overwriteGoal, me.get('id'));
  }
  getEmptyHandoff(target, message) {
    return fromJS({
      flags: [],
      assignees: null,
      message: message || '',
      target: target || this.calculateNextStep(),
    });
  }
  calculateNextStep(goal) {
    const helper = this.getHelper(goal);
    const nextStep = helper.getNextStep();
    return nextStep ? nextStep.get('id') : '_complete';
  }
  slackUserIdForUser(uId) {
    switch (uId) {
      case 'UB9BXJ1JB': // yana
        return 'U02S15YG9';
      case 'URU3EUPOE': // stefan
        return 'U02H991H2';
      case 'USTFL9YVE': // tihomir
        return 'U0B119T8W';
      case 'UVZWCJDHK': // kasper
        return 'U02A53ZUL';
      case 'UZTYMBVGO': // kristjan
        return 'U09KBMX7Z';
      default:
        return 'USLACKBOT';
    }
  }

  renderContent() {
    const {
      goal,
      me,
      users,
    } = this.props;
    const {
      isHandingOff,
      isSubmitting,
      handoff,
    } = this.state;

    return (
      <GoalStep
        goal={goal}
        me={me}
        users={users}
        delegate={this}
        handoff={handoff}
        isHandingOff={isHandingOff}
        isSubmitting={isSubmitting}
      />
    );
  }
  renderSide() {
    const { goal, me } = this.props;

    return (
      <div className="goal-step__side">
        <GoalSide goal={goal} me={me} />
      </div>
    );
  }
  renderHeader() {
    const { target } = this.props;

    return (
      <div className="goals-list__header">
        <HOCBreadCrumbs target={target} />
        <HOCHeaderTitle target={target}>
          <Button icon="ThreeDots" onClick={this.onContextClick} />
        </HOCHeaderTitle>
      </div>
    );
  }
  render() {
    const { isHandingOff } = this.state;
    const { goal } = this.props;
    let className = 'goal-step';
    if (!goal) {
      return <div className={className} />;
    }

    if (isHandingOff) {
      className += ' goal-step__handing-off';
    }
    return (
      <Measure onMeasure={this.onMeasure}>
        <SWView header={this.renderHeader()}>
          <div className={className}>
            {this.renderContent()}
            {/* {this.renderSide()} */}
          </div>
        </SWView>
      </Measure>
    );
  }
}

const { func, object, string } = PropTypes;
HOCGoalStep.propTypes = {
  archive: func,
  delegate: object,
  sideNoteId: string,
  navPop: func,
  saveWay: func,
  selectStep: func,
  goalNotify: func,
  selectAssignees: func,
  openSlackIn: func,
  navSet: func,
  completeStep: func,
  contextMenu: func,
  goal: map,
  me: map,
  users: map,
  target: string,
};


function mapStateToProps(state, ownProps) {
  const { goalId } = ownProps;
  const goal = state.getIn(['goals', goalId]);
  let step;
  if (goal) {
    step = goal.getIn(['steps', goal.getIn(['status', 'current_step_id'])]);
  }
  return {
    sideNoteId: state.getIn(['main', 'sideNoteId']),
    goal,
    users: state.get('users'),
    step,
    me: state.get('me'),
  };
}
export default connect(mapStateToProps, {
  selectAssignees: actions.goals.selectAssignees,
  overlay: actions.main.overlay,
  contextMenu: actions.main.contextMenu,
  goalNotify: actions.goals.notify,
  selectStep: actions.goals.selectStep,
  openSlackIn: actions.main.openSlackIn,
  saveWay: actions.ways.save,
  navSet: actions.navigation.set,
  archive: actions.goals.archive,
  addToCollection: actions.goals.addToCollection,
  completeStep: actions.goals.completeStep,
})(HOCGoalStep);
