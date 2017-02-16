import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { setupDelegate } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';

import Section from 'components/section/Section';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HandoffWriteMessage from 'components/handoff-write-message/HandoffWriteMessage';
import HandoffHeader from './HandoffHeader';
import GoalActions from './GoalActions';
import HandoffStatus from './HandoffStatus';

import './styles/goal-handoff.scss';

class GoalHandoff extends PureComponent {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.onOpenUser = this.callDelegate.bind(null, 'onOpenUser');
    this.onChangeClick = this.callDelegate.bind(null, 'onChangeClick');
    this.onHandoffChange = this.callDelegate.bind(null, 'onHandoffChange');
  }
  componentDidMount() {
    this.refs.handoffWriteMessageTextarea.focus();
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
    const { handoff } = this.props;
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
        isHandingOff
      />
    );
  }

  renderAttachments() {
    const { goal, delegate, handoff } = this.props;

    return (
      <Section className="goal-step__attachment">
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          flags={handoff.get('flags')}
          goalId={goal.get('id')}
          enableFlagging
          delegate={delegate}
        />
      </Section>
    );
  }
  renderWriteMessage() {
    const { me, handoff } = this.props;

    const src = me.get('profile_pic');

    return (
      <Section title="Write handoff" className="section--show">
        <HandoffWriteMessage
          ref="handoffWriteMessageTextarea"
          onChange={this.onHandoffChange}
          imgSrc={src}
          text={handoff.get('message')}
        />
      </Section>
    );
  }
  renderStatus() {
    const {
      goal,
      handoff,
    } = this.props;

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
  renderActionBar() {
    const {
      handoff,
      isSubmitting,
      delegate,
    } = this.props;
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
          delegate={delegate}
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
    return (
      <div className="goal-handoff">
        {this.renderHeader()}
        {this.renderWriteMessage()}
        {this.renderAttachments()}
        {this.renderActionBar()}
      </div>
    );
  }
}

export default GoalHandoff;

// const { string } = PropTypes;

const { object, bool } = PropTypes;

GoalHandoff.propTypes = {
  delegate: object.isRequired,
  goal: map,
  me: map,
  handoff: map,
  isSubmitting: bool,
};
