import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalsUtil from 'classes/goals-util';
import { setupDelegate, bindAll } from 'classes/utils';

import ListMenu from 'components/list-menu/ListMenu';
import Section from 'components/section/Section';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HandoffWriteMessage from 'components/handoff-write-message/HandoffWriteMessage';
import HandoffHeader from './HandoffHeader';
import HandoffMessage from './HandoffMessage';
import GoalActions from './GoalActions';
import GoalCompleted from './GoalCompleted';
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
      isSubmitting: false,
      flags: [],
      handoffText: '',
      nextStepId: this.calculateNextStep(),
    };

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['onCancel', 'onHandoff', 'onHandoffChange', 'onOpenUser', 'onChangeClick']);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  componentWillReceiveProps(nextProps) {
    const { goal } = this.props;
    const nextGoal = nextProps.goal;
    if (nextGoal && goal) {
      if (nextGoal.getIn(['status', 'current_step_id']) !== goal.getIn(['status', 'current_step_id'])) {
        this.setState({
          isHandingOff: false,
          handoffText: '',
          nextStepId: this.calculateNextStep(nextGoal),
          flags: [],
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isHandingOff && !prevState.isHandingOff) {
      this.refs.handoffMessage.focus();
    }
  }
  onFlag(id) {
    let flags = this.state.flags;
    const index = flags.indexOf(id);
    if (index !== -1) {
      flags = flags.slice(0, index).concat(flags.slice(index + 1));
    } else {
      flags = flags.concat([id]);
    }
    this.setState({ flags });
  }

  onContextClick(i, e) {
    const {
      goal,
      archive,
      contextMenu,
    } = this.props;

    contextMenu({
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        alignX: 'right',
      },
      component: ListMenu,
      props: {
        items: [
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
  onCancel() {
    this.setState({ isHandingOff: false });
  }
  onChangeClick(e) {
    const { nextStepId } = this.state;
    const { selectStep, goal } = this.props;
    selectStep({
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    }, goal.get('id'), nextStepId, (newStepId) => {
      this.setState({ nextStepId: newStepId });
    });
  }
  onHandoff() {
    const { completeStep, goal } = this.props;
    const { handoffText, nextStepId, flags } = this.state;
    if (this.state.isHandingOff) {
      this.setState({ isSubmitting: true });
      completeStep(goal.get('id'), nextStepId, handoffText, flags).then((res) => {
        this.setState({ isSubmitting: false });
      });
    } else {
      this.setState({ isHandingOff: true });
    }
  }
  onHandoffChange(handoffText) {
    this.setState({ handoffText });
  }
  onAddAttachment(obj) {
    const {
      addToCollection,
      goal,
    } = this.props;
    addToCollection(goal.get('id'), obj);
  }
  onOpenUser(id) {
    const { openSlackIn, navigateToId } = this.props;
    navigateToId('slack');
    openSlackIn(this.slackUserIdForUser(id));
  }
  calculateNextStep(goal) {
    const helper = this.getHelper(goal);
    const nextStep = helper.getNextStep();
    return nextStep ? nextStep.get('id') : null;
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

  getHelper(overwriteGoal) {
    const { goal, me } = this.props;
    overwriteGoal = overwriteGoal || goal;
    return new GoalsUtil(overwriteGoal, me.get('id'));
  }

  mapStepToHeader(stepId, next) {
    const helper = this.getHelper();

    if (!stepId) {
      return undefined;
    }
    const stepIndex = helper.getStepIndexForId(stepId);
    const step = helper.getStepById(stepId);
    return {
      title: `${stepIndex + 1}. ${step.get('title')}`,
      subtitle: next ? 'Next Step' : 'Current Step',
      assignees: step.get('assignees').toJS(),
    };
  }
  renderGoalCompleted() {
    const helper = this.getHelper();
    if (helper.getCurrentStepId()) {
      return undefined;
    }
    return (
      <GoalCompleted
        title="Goal completed!"
        subtitle="Well done! Together with Tisho, Yana, Kasper, Kris and Stefan you completed this goal"
        assignees={helper.getAllInvolvedAssignees()}
      />
    );
  }
  renderHeader() {
    const { isHandingOff, nextStepId } = this.state;
    const helper = this.getHelper();
    if (!helper.getCurrentStepId()) {
      return undefined;
    }
    const from = this.mapStepToHeader(helper.getCurrentStepId());
    const to = this.mapStepToHeader(nextStepId, true);

    return (
      <HandoffHeader
        from={from}
        to={to}
        onChangeClick={this.onChangeClick}
        isHandingOff={isHandingOff}
      />
    );
  }
  renderHandoffWriteMessage() {
    const { me } = this.props;
    const { handoffText, isHandingOff } = this.state;
    if (!isHandingOff) {
      return undefined;
    }
    const src = me.get('profile_pic');
    return (
      <Section title="Write handoff">
        <HandoffWriteMessage
          ref="handoffMessage"
          onChange={this.onHandoffChange}
          imgSrc={src}
          disabled={!isHandingOff}
          text={handoffText}
        />
      </Section>
    );
  }
  renderHandoffMessage() {
    const { users } = this.props;
    const { isHandingOff } = this.state;
    const helper = this.getHelper();
    const handOff = helper.getHandoffMessage();
    if (isHandingOff || !handOff) {
      return undefined;
    }

    const text = handOff.message;
    const user = users.get(handOff.by);
    const at = handOff.at;
    const title = helper.getCurrentStep() ? 'Handoff' : 'Final note';
    return (
      <Section title={title}>
        <HandoffMessage
          onClick={this.onOpenUser}
          user={user}
          message={text}
          at={at}
        />
      </Section>
    );
  }

  renderAttachments() {
    const { goal } = this.props;
    const { isHandingOff, flags } = this.state;
    const helper = this.getHelper();
    let sendFlags = helper.getFlags();
    if (isHandingOff) {
      sendFlags = fromJS(flags);
    }
    return (
      <Section title="Attachments">
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          flags={sendFlags}
          disableFlagging={!isHandingOff}
          delegate={this}
          disableAdd={!helper.getCurrentStep()}
        />
      </Section>
    );
  }
  renderActions() {
    const { isHandingOff, nextStepId, isSubmitting } = this.state;
    const helper = this.getHelper();
    if (!helper.getCurrentStep()) {
      return undefined;
    }
    return (
      <Section>
        <GoalActions
          onCancel={this.onCancel}
          onHandoff={this.onHandoff}
          isHandingOff={isHandingOff}
          isCompletingGoal={!nextStepId}
          isSubmitting={isSubmitting}
        />
      </Section>
    );
  }
  renderSide() {
    const { goal, me, sideNoteId } = this.props;
    if (sideNoteId) {
      return undefined;
    }
    return (
      <div className="goal-step__side">
        <GoalSide goal={goal} me={me} />
      </div>
    );
  }
  render() {
    const { isHandingOff } = this.state;
    let className = 'goal-step';

    if (isHandingOff) {
      className += ' goal-step__handing-off';
    }
    return (
      <div className={className}>
        <div className="goal-step__content">
          {this.renderGoalCompleted()}
          {this.renderHeader()}
          {this.renderHandoffMessage()}
          {this.renderAttachments()}
          {this.renderHandoffWriteMessage()}
          {this.renderActions()}
        </div>

        {this.renderSide()}

      </div>
    );
  }
}

const { func, object, string } = PropTypes;
HOCGoalStep.propTypes = {
  archive: func,
  delegate: object,
  sideNoteId: string,
  addToCollection: func,
  completeStep: func,
  contextMenu: func,
  goal: map,
  me: map,
  users: map,
};


function mapStateToProps(state, ownProps) {
  const { goalId } = ownProps;
  const goal = state.getIn(['goals', goalId]);
  return {
    sideNoteId: state.getIn(['main', 'sideNoteId']),
    goal,
    users: state.get('users'),
    step: goal.getIn(['steps', goal.getIn(['status', 'current_step_id'])]),
    me: state.get('me'),
  };
}
export default connect(mapStateToProps, {
  overlay: actions.main.overlay,
  contextMenu: actions.main.contextMenu,
  selectStep: actions.goals.selectStep,
  openSlackIn: actions.main.openSlackIn,
  navigateToId: actions.navigation.navigateToId,
  archive: actions.goals.archive,
  addToCollection: actions.goals.addToCollection,
  completeStep: actions.goals.completeStep,
})(HOCGoalStep);
