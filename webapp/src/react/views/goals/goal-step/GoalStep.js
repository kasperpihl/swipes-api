import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll, setupDelegate, setupCachedCallback } from 'classes/utils';

// Views
import ProgressBar from 'components/progress-bar/ProgressBar';
import Button from 'Button';
import StepSection from './StepSection';
import StepHandoff from './StepHandoff';
import StepContentRow from './StepContentRow';
import StepSubmission from './StepSubmission';
import GoalStatus from './GoalStatus';


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
  onAdd(e) {
    this.callDelegate('goalStepAdd', e);
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
    } = this.props;

    return (
      <StepSection>
        <ProgressBar
          length={goal.get('steps').size}
          completed={goal.get('currentStepIndex')}
          steps={goal.get('steps')}
        />
      </StepSection>
    );
  }
  renderStatusMessage() {
    const from = ['UB9BXJ1JB', 'URU3EUPOE'];
    const to = ['UZTYMBVGO'];
    const message = 'Stefan & Yana did their part. Now it is up to you. Good luck';
    return <GoalStatus fromAssignees={from} toAssignees={to} message={message} />;
  }
  renderStatus() {
    const {
      stepIndex,
      step,
      status,
    } = this.props;

    return (
      <StepSection title="current step">
        <div className="goal-step__status">
          <span>{`${stepIndex + 1}. ${step.get('title')} `}</span>{status}
        </div>
      </StepSection>
    );
  }

  renderAttachments() {
    const {
      collection: col,
    } = this.props;
    let html = col && col.map((c, i) => (
      <StepContentRow
        key={i}
        onClick={this.onOpenCached(i)}
        icon={c.get('type') === 'note' ? 'Note' : 'Hyperlink'}
        title={c.get('title')}
      />
    ));
    console.log('html1', html);
    if (!html) {
      html = <div className="goal-step__empty-state">Nothing here yet</div>;
    }
    console.log('html2', html);
    return (
      <StepSection title="Attachments">
        <div className="goal-step__attachments">
          {html}
        </div>
        <Button icon="Plus" onClick={this.onAdd} className="goal-step__btn" />
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
          {this.renderHandoff()}
          {this.renderStatus()}
          {this.renderAttachments()}
          {this.renderSubmission()}
        </div>
      </div>
    );
  }
}

export default GoalStep;

const { object, bool, number } = PropTypes;

GoalStep.propTypes = {
  step: map.isRequired,
  goal: map.isRequired,
  stepIndex: number,
  handoff: object,
  collection: list,
  isSubmitting: bool,
  options: object.isRequired,
  delegate: object.isRequired,
};
