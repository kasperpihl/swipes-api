import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll, setupDelegate, setupCachedCallback } from 'classes/utils';

// Views
import ProgressDots from 'components/progress-dots/ProgressDots';
import Button from 'Button';
import StepSection from './StepSection';
import StepHandoff from './StepHandoff';
import StepContentRow from './StepContentRow';
import StepSubmission from './StepSubmission';


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
  renderStatus() {
    const {
      stepIndex,
      step,
      goal,
      status,
    } = this.props;
    return (
      <StepSection title="Status">
        <ProgressDots
          length={goal.get('steps').size}
          completed={goal.get('currentStepIndex')}
        />
        <div>{status}</div>
        <div>{`${stepIndex + 1}. ${step.get('title')}`}</div>
      </StepSection>
    );
  }
  renderHandoff() {
    const { handoff } = this.props;
    if (!handoff) {
      return undefined;
    }
    return (
      <StepSection title="Handoff">
        <StepHandoff data={handoff} />
      </StepSection>
    );
  }
  renderCollection() {
    const {
      collection: col,
    } = this.props;
    const html = col && col.map((c, i) => (
      <StepContentRow
        key={i}
        onClick={this.onOpenCached(i)}
        icon={c.get('type') === 'note' ? 'ListIcon' : 'LinkIcon'}
        title={c.get('title')}
      />
    ));
    return (
      <StepSection title="Content">
        {html}
        <Button icon="AddIcon" primary onClick={this.onAdd} className="goal-step__btn" />
      </StepSection>
    );
  }


  renderSubmission() {
    const { options, step, isSubmitting } = this.props;
    if (options.showSubmission) {
      return (
        <StepSection title="Deliver">
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
          {this.renderStatus()}
          {this.renderHandoff()}
          {this.renderCollection()}
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
  stepIndex: number,
  handoff: object,
  collection: list,
  isSubmitting: bool,
  options: object.isRequired,
  delegate: object.isRequired,
};
