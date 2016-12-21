import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll, setupDelegate, setupCachedCallback } from 'classes/utils';

// Views
import Button from 'Button';
import * as Fields from 'src/react/swipes-fields';
import StepSection from './StepSection';
import StepContentRow from './StepContentRow';
import StepSubmission from './StepSubmission';


// styles
import './styles/goal-step.scss';

class GoalStep extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['onSubmit', 'onAdd', 'onOpen']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.getCachedOnOpen = setupCachedCallback(this.onOpen, this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  onSubmit(goBack) {
    this.callDelegate('goalStepSubmit', goBack, this.handoffMessage);
  }
  onAdd() {
    this.callDelegate('goalStepAdd');
  }
  onOpen(i) {
    console.log('hello', i, this);
  }

  renderHandoff() {
    const { handoff } = this.props;
    if (!handoff) {
      return undefined;
    }
    return (
      <StepSection title="Handoff">
        <div className="goal-step__hand-off-message">{handoff.message}</div>
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
        onClick={this.getCachedOnOpen(i)}
        icon={c.get('icon')}
        title={'Note'}
      />
    ));
    return (
      <StepSection title="Content">
        {html}
        <Button icon="AddIcon" primary onClick={this.onAdd} />
      </StepSection>
    );
  }

  renderHandoffField() {
    const { options } = this.props;
    if (!options.showSubmission) {
      return undefined;
    }
    const Textarea = Fields.textarea;
    const data = fromJS({ text: '' });
    const settings = fromJS({ editable: true, placeholder: 'handoff' });
    return (
      <StepSection title="Deliver">
        <Textarea
          data={data}
          settings={settings}
          delegate={(name, val) => {
            if (name === 'change') {
              this.handoffMessage = val.get('text');
            }
          }}
        />
        {this.renderSubmission}
      </StepSection>

    );
  }
  renderSubmission() {
    const { options, step, isSubmitting } = this.props;
    if (options.showSubmission) {
      return (
        <StepSubmission
          onSubmit={this.onSubmit}
          submission={step.get('submission')}
          disabled={!!isSubmitting}
        />
      );
    }

    return undefined;
  }

  render() {
    return (
      <div className="goal-step">

        <div className="goal-step__content">
          {this.renderHandoff()}
          {this.renderCollection()}
        </div>

        <div className="goal-step__submission">
          {this.renderHandoffField()}
          {this.renderSubmission()}
        </div>


      </div>
    );
  }
}

export default GoalStep;

const { object, bool } = PropTypes;

GoalStep.propTypes = {
  step: map.isRequired,
  handoff: object,
  collection: list,
  isSubmitting: bool,
  options: object.isRequired,
  delegate: object.isRequired,
};
