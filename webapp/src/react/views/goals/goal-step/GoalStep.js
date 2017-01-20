import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll, setupDelegate, setupCachedCallback } from 'classes/utils';

// Views
import HOCAttachments from 'components/attachments/HOCAttachments';
import ProgressBar from 'components/progress-bar/ProgressBar';
import Section from 'components/section/Section';
import StepHandoff from './StepHandoff';
import StepSubmission from './StepSubmission';
import GoalStatus from './GoalStatus';
import CurrentStep from './CurrentStep';

// styles
import './styles/goal-step';

class GoalStep extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['onSubmit', 'onAdd', 'onOpen']);
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
  renderProgressBar() {
    const {
      goal,
      step,
    } = this.props;
    const length = goal.get('steps').size;
    let numberOfCompleted = goal.get('currentStepIndex');

    if (numberOfCompleted === length - 1 && step.get('completed')) {
      numberOfCompleted = length;
    }

    return (
      <Section first>
        <ProgressBar
          length={length}
          completed={numberOfCompleted}
          steps={goal.get('steps')}
        />
      </Section>
    );
  }
  renderStatus() {
    const {
      stepIndex,
      step,
      status,
    } = this.props;
    return (
      <Section title="current step">
        <div className="goal-step__status">
          <span>{`${stepIndex + 1}. ${step.get('title')} `}</span>{status}
        </div>
      </Section>
    );
  }
  renderStatusMessage() {
    const from = ['UB9BXJ1JB', 'URU3EUPOE'];
    const to = ['UZTYMBVGO'];
    const message = 'Stefan & Yana did their part. Now it is up to you. Good luck';
    return (
      <GoalStatus fromAssignees={from} toAssignees={to} message={message} />
    );
  }


  renderAttachments() {
    const {
      collection,
    } = this.props;
    return (
      <Section title="Attachments">
        <HOCAttachments
          attachments={collection}
          delegate={this}
        />
      </Section>
    );
  }
  renderHandoff() {
    const { handoff } = this.props;
    if (!handoff) {
      return undefined;
    }
    return (
      <Section title="Deliver">
        <StepHandoff data={handoff} />
      </Section>
    );
  }

  renderSubmission() {
    const { options, step, isSubmitting } = this.props;
    if (options.showSubmission) {
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

    return undefined;
  }

  render() {
    return (
      <div className="goal-step">

        <div className="goal-step__content">
          {this.renderProgressBar()}
          {this.renderStatusMessage()}
          {this.renderStatus()}
          {this.renderHandoff()}

          {this.renderAttachments()}
          {this.renderSubmission()}
        </div>
      </div>
    );
  }
}

export default GoalStep;

const { object, bool, number, string } = PropTypes;

GoalStep.propTypes = {
  step: map.isRequired,
  goal: map.isRequired,
  stepIndex: number,
  status: string,
  handoff: object,
  collection: list,
  isSubmitting: bool,
  options: object.isRequired,
  delegate: object.isRequired,
};
