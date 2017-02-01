import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Measure from 'react-measure';
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
import HandoffStatus from './HandoffStatus';
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
      hasLoaded: false,
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
    const { goal, navPop } = this.props;
    const nextGoal = nextProps.goal;
    if (goal && !nextGoal) {
      navPop();
    }
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
      this.refs.handoffWriteMessageTextarea.focus();
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
            title: 'Archive Goal',
            onClick: () => {
              archive(goal.get('id'));
              contextMenu(null);
            },
          },
          {
            title: 'Save as a Way',
            onClick: () => {
              const helper = this.getHelper();
              saveWay(options, helper.getObjectForWay());
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
  onOpenUser(id) {
    const { openSlackIn, navigateToId } = this.props;
    navigateToId('primary', 'slack');
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
    let className = 'section--hidden';

    if (isHandingOff) {
      className = 'section--show';
    }

    const src = me.get('profile_pic');

    return (
      <Measure
        onMeasure={(dim) => {
          this.setState({ handoffWriteMessageH: dim.height });
          if (!this.state.hasLoaded) {
            setTimeout(() => {
              this.setState({ hasLoaded: true });
            }, 1);
          }
        }}
      >
        <Section title="Write handoff" className={className}>
          <HandoffWriteMessage
            ref="handoffWriteMessageTextarea"
            onChange={this.onHandoffChange}
            imgSrc={src}
            disabled={!isHandingOff}
            text={handoffText}
          />
        </Section>
      </Measure>
    );
  }
  renderHandoffMessage() {
    const { users } = this.props;
    const { isHandingOff } = this.state;
    const helper = this.getHelper();
    const handOff = helper.getHandoffMessage();
    let className = 'section--show';

    if (isHandingOff || !handOff) {
      className = 'section--hidden';
    }

    const text = handOff.message;
    const user = users.get(handOff.by);
    const at = handOff.at;
    const title = helper.getCurrentStep() ? 'Handoff' : 'Final note';

    return (
      <Measure
        onMeasure={(dim) => {
          this.setState({ handoffMessageH: dim.height });
        }}
      >
        <Section title={title} key={title} className={className}>
          <HandoffMessage
            onClick={this.onOpenUser}
            user={user}
            message={text}
            at={at}
          />
        </Section>
      </Measure>
    );
  }

  renderAttachments() {
    const { goal } = this.props;
    const {
      isHandingOff,
      flags,
      handoffMessageH,
    } = this.state;
    const helper = this.getHelper();
    let sendFlags = helper.getFlags();
    const style = {};

    if (isHandingOff) {
      sendFlags = fromJS(flags);

      if (handoffMessageH) {
        style.marginTop = -1 * handoffMessageH;
      }
    }

    return (
      <Section title="Attachments" style={style}>
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          flags={sendFlags}
          goalId={goal.get('id')}
          enableFlagging={!!isHandingOff}
          delegate={this}
          disableAdd={!helper.getCurrentStep()}
        />
      </Section>
    );
  }
  renderStatus() {
    const { goal, users, me } = this.props;
    const { isHandingOff, nextStepId } = this.state;

    if (!isHandingOff) {
      return null;
    }

    return (
      <HandoffStatus
        goal={goal}
        toId={nextStepId}
        users={users}
        me={me}
        onChangeStep={this.onChangeClick}
      />
    );
  }
  renderActions() {
    const { isHandingOff, nextStepId, isSubmitting, handoffWriteMessageH, hasLoaded } = this.state;
    const { users, me, goal } = this.props;
    const helper = this.getHelper();
    const style = {};
    let className = '';

    if (!helper.getCurrentStep()) {
      return undefined;
    }

    if (!hasLoaded) {
      className = 'no-animation';
    }

    if (!isHandingOff && handoffWriteMessageH) {
      style.marginTop = -1 * handoffWriteMessageH;
    }

    return (
      <Section style={style} className={className}>
        <GoalActions
          onCancel={this.onCancel}
          onHandoff={this.onHandoff}
          isHandingOff={isHandingOff}
          isCompletingGoal={!nextStepId}
          isSubmitting={isSubmitting}
        >
          {this.renderStatus()}
        </GoalActions>
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
    const { goal } = this.props;

    let className = 'goal-step';
    if (!goal) {
      return <div className={className} />;
    }

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
  overlay: actions.main.overlay,
  contextMenu: actions.main.contextMenu,
  selectStep: actions.goals.selectStep,
  openSlackIn: actions.main.openSlackIn,
  saveWay: actions.ways.save,
  navigateToId: actions.navigation.navigateToId,
  archive: actions.goals.archive,
  addToCollection: actions.goals.addToCollection,
  completeStep: actions.goals.completeStep,
})(HOCGoalStep);
