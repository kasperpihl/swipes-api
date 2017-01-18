import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll, setupDelegate, setupCachedCallback } from 'classes/utils';

// Views
import HOCAttachments from 'components/attachments/HOCAttachments';
import ProgressBar from 'components/progress-bar/ProgressBar';
import StepSection from './StepSection';
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
  onOpen(i, e) {
    const {
      collection,
    } = this.props;
    this.callDelegate('goalStepClicked', collection.get(i), e);
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
      <StepSection>
        <ProgressBar
          length={length}
          completed={numberOfCompleted}
          steps={goal.get('steps')}
        />
      </StepSection>
    );
  }
  renderStatus() {
    const {
      goal,
      stepIndex,
      step,
      status,
    } = this.props;

    const prev = goal.getIn(['steps', stepIndex - 1, 'title']);
    const current = goal.getIn(['steps', stepIndex, 'title']);
    const next = goal.getIn(['steps', stepIndex + 1, 'title']);
    return (
      <StepSection title="current step">
        <CurrentStep
          prev={prev}
          current={current}
          next={next}
        />
      </StepSection>
    );
    return (
      <StepSection title="current step">
        <div className="goal-step__status">
          <span>{`${stepIndex + 1}. ${step.get('title')} `}</span>{status}
        </div>
      </StepSection>
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
      <StepSection title="Attachments">
        <HOCAttachments
          attachments={collection}
          delegate={this}
        />
      </StepSection>
    );
  }
  renderHandoff() {
    const { handoff } = this.props;
    if (!handoff) {
      return undefined;
    }
    return (
      <StepSection title="Deliver">
        <StepHandoff data={handoff} />
      </StepSection>
    );
  }

  renderSubmission() {
    const { options, step, isSubmitting } = this.props;
    if (options.showSubmission) {
      return (
        <StepSection title="Handoff">
          <StepSubmission
            onSubmit={this.onSubmit}
            submission={step.get('submission')}
            disabled={!!isSubmitting}
          />
        </StepSection>
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
