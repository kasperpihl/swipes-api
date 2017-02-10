import React, { Component, PropTypes } from 'react';
import Measure from 'react-measure';
import { map } from 'react-immutable-proptypes';
import { setupDelegate } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';

import Section from 'components/section/Section';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HandoffWriteMessage from 'components/handoff-write-message/HandoffWriteMessage';
import HandoffHeader from './HandoffHeader';
import HandoffMessage from './HandoffMessage';
import GoalActions from './GoalActions';
import GoalCompleted from './GoalCompleted';
import HandoffStatus from './HandoffStatus';

class GoalStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
    };
    this.callDelegate = setupDelegate(props.delegate);
    this.onOpenUser = this.callDelegate.bind(null, 'onOpenUser');
    this.onChangeClick = this.callDelegate.bind(null, 'onChangeClick');
    this.onHandoffChange = this.callDelegate.bind(null, 'onHandoffChange');
  }
  componentDidMount() {
  }
  componentDidUpdate(prevProps) {
    if (this.props.isHandingOff && !prevProps.isHandingOff) {
      this.refs.handoffWriteMessageTextarea.focus();
    }
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  mapStepToHeader(target, isNext) {
    const { handoff } = this.props;
    const helper = this.getHelper();
    if (target === '_complete') {
      return undefined;
    }
    if (target === '_notify') {
      let notifyTo = handoff.get('assignees') || [];
      if (typeof notifyTo.size === 'number') {
        notifyTo = notifyTo.toJS();
      }
      return {
        title: 'Notify people',
        assignees: notifyTo,
      };
    }
    let subtitle = 'Current step';
    const stepIndex = helper.getStepIndexForId(target);
    const step = helper.getStepById(target);
    let assignees = step.get('assignees');
    if (isNext) {
      assignees = handoff.get('assignees') || assignees;
      const currentI = helper.getCurrentStepIndex();
      const nextI = helper.getStepIndexForId(target);
      subtitle = 'Next step';
      if (nextI === currentI) {
        subtitle = 'Reassign';
      } else if (nextI < currentI) {
        subtitle = 'Make Iteration';
      }
    }
    return {
      title: `${stepIndex + 1}. ${step.get('title')}`,
      subtitle,
      assignees: assignees.toJS(),
    };
  }
  renderHeader() {
    const { isHandingOff, handoff } = this.props;
    const helper = this.getHelper();
    if (!helper.getCurrentStepId()) {
      return undefined;
    }
    const from = this.mapStepToHeader(helper.getCurrentStepId());
    const to = this.mapStepToHeader(handoff.get('target'), true);

    return (
      <HandoffHeader
        from={from}
        to={to}
        onChangeClick={this.onChangeClick}
        isHandingOff={isHandingOff}
      />
    );
  }
  renderGoalCompleted() {
    const helper = this.getHelper();
    if (helper.getCurrentStepId()) {
      return undefined;
    }
    return (
      <GoalCompleted
        title="Goal completed!"
        subtitle="Well done! Together with Tisho, Yana, Kasper, Kris and Stefan"
        assignees={helper.getAllInvolvedAssignees()}
      />
    );
  }
  renderHandoffMessage() {
    const { users, isHandingOff } = this.props;
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
    const { goal, delegate, isHandingOff, handoff } = this.props;
    const {
      handoffMessageH,
    } = this.state;
    const helper = this.getHelper();
    let sendFlags = helper.getCurrentFlags();
    const style = {};

    if (isHandingOff) {
      sendFlags = handoff.get('flags');

      if (handoffMessageH) {
        style.marginTop = -1 * handoffMessageH;
      }
    }

    return (
      <Section className="goal-step__attachment" style={style}>
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          flags={sendFlags}
          goalId={goal.get('id')}
          enableFlagging={isHandingOff}
          delegate={delegate}
          disableAdd={!helper.getCurrentStep()}
        />
      </Section>
    );
  }
  renderHandoffWriteMessage() {
    const { me } = this.props;
    const { handoff, isHandingOff } = this.props;
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
            text={handoff.get('message')}
          />
        </Section>
      </Measure>
    );
  }
  renderStatus() {
    const {
      goal,
      isHandingOff,
      handoff,
    } = this.props;
    if (!isHandingOff) {
      return null;
    }

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
  renderActions() {
    const {
      handoffWriteMessageH,
      hasLoaded,
    } = this.state;
    const {
      isHandingOff,
      handoff,
      isSubmitting,
      delegate,
    } = this.props;
    const helper = this.getHelper();
    const style = {};
    let className = '';

    if (!helper.getCurrentStep()) {
      return undefined;
    }

    let primaryLabel = 'Handoff';
    let secondaryLabel = 'Cancel';
    if (isHandingOff) {
      if (handoff.get('target') === '_complete') {
        primaryLabel = 'Complete Goal';
      } else if (handoff.get('target') === '_notify') {
        primaryLabel = 'Send Notification';
      } else {
        primaryLabel = 'Complete Step';
        const nextStepIndex = helper.getStepIndexForId(handoff.get('target'));
        const currentStepIndex = helper.getCurrentStepIndex();
        if (nextStepIndex === currentStepIndex) {
          primaryLabel = 'Reassign Step';
        }
        if (nextStepIndex < currentStepIndex) {
          primaryLabel = 'Make Iteration';
        }
      }
    } else {
      secondaryLabel = 'Notify';
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
          delegate={delegate}
          secondaryLabel={secondaryLabel}
          primaryLabel={primaryLabel}
          primaryLoading={isSubmitting}
        >
          {this.renderStatus()}
        </GoalActions>
      </Section>
    );
  }
  render() {
    return (
      <div className="goal-step__content">
        {this.renderGoalCompleted()}
        {this.renderHeader()}
        {this.renderHandoffMessage()}
        {this.renderAttachments()}
        {this.renderHandoffWriteMessage()}
        {this.renderActions()}
      </div>
    );
  }
}

export default GoalStep;

const { string, object, bool } = PropTypes;

GoalStep.propTypes = {
  delegate: object.isRequired,
  goal: map,
  users: map,
  me: map,
  handoff: map,
  isHandingOff: bool,
  isSubmitting: bool,
};
