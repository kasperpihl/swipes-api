import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll, setupDelegate, setupCachedCallback } from 'classes/utils';

// Views
import HOCAttachments from 'components/attachments/HOCAttachments';
import Section from 'components/section/Section';
import GoalsUtil from 'classes/goals-util';
import StepSubmission from './StepSubmission';
import GoalStatus from './GoalStatus';

// styles
import './styles/goal-step';

class GoalStep extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['onSubmit']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onOpenCached = setupCachedCallback(this.onOpen, this);
    // now use events as onClick: this.onOpenCached(i)
    this.callDelegate = setupDelegate(props.delegate);
  }
  onSubmit(goBack, message) {
    this.callDelegate('goalStepSubmit', goBack, message);
  }
  onAddAttachment(obj) {
    this.callDelegate('goalStepAddAttachment', obj);
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  renderStatusMessage() {
    const from = ['UB9BXJ1JB', 'URU3EUPOE'];
    const to = ['UZTYMBVGO'];
    const message = 'Stefan & Yana did their part. Now it is up to you. Good luck';
    return (
      <GoalStatus fromAssignees={from} toAssignees={to} message={message} />
    );
  }
  renderHandoff() {
    const helper = this.getHelper();
    const stepIndex = helper.getCurrentStepIndex();
    const step = helper.getCurrentStep();
    const status = helper.getStatus();
    return (
      <Section title="current step">
        <div className="goal-step__status">
          <span>{`${stepIndex + 1}. ${step.get('title')} `}</span>{status}
        </div>
      </Section>
    );
  }

  renderAttachments() {
    const helper = this.getHelper();
    const {
      goal,
    } = this.props;
    return (
      <Section title="Attachments">
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          delegate={this}
        />
      </Section>
    );
  }

  renderSubmission() {
    const { isSubmitting } = this.props;
    const helper = this.getHelper();
    const step = helper.getCurrentStep();
    return (
      <Section title="Handoff">
        <StepSubmission
          onSubmit={this.onSubmit}
          submission={step.get('submission')}
          disabled={!!isSubmitting}
        />
      </Section>
    );
  }

  render() {
    return (
      <div className="goal-step">

        <div className="goal-step__content">
          {this.renderStatusMessage()}
          {this.renderHandoff()}

          {this.renderAttachments()}
          {this.renderSubmission()}
        </div>
      </div>
    );
  }
}

export default GoalStep;

const { object, bool, string } = PropTypes;

GoalStep.propTypes = {
  goal: map.isRequired,
  status: string,
  handoff: object,
  isSubmitting: bool,
  delegate: object.isRequired,
};
