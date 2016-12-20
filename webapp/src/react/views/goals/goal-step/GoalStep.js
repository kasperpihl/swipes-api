import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll, setupDelegate } from 'classes/utils';

// Views
import { Attachment } from 'src/react/preview-card/preview-fields';
import Button from 'Button';
import * as Fields from 'src/react/swipes-fields';
import StepField from './StepField';
import StepSubmission from './StepSubmission';


// styles
import './styles/goal-step.scss';

class GoalStep extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['onSubmit', 'onAdd', 'onOpen']);
    this.bindCallbacks = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  onSubmit(goBack) {
    this.callDelegate('goalStepSubmit', goBack, this.handoffMessage);
  }
  onAdd() {
    this.callDelegate('goalStepAdd');
  }
  onOpen(att, e) {
    this.callDelegate('goalStepClicked', att, e);
  }

  renderHandoff() {
    const { handoff } = this.props;
    if (!handoff) {
      return undefined;
    }
    return (
      <StepField
        svg={handoff.svg}
        src={handoff.src}
        title={handoff.title}
      >
        <div className="goal-step__hand-off-message">{handoff.message}</div>
      </StepField>
    );
  }
  renderCollection() {
    const {
      collection: col,
    } = this.props;
    const html = col && col.map((c, i) => (
      <Attachment onClick={this.onOpen} key={i} data={c} />
    ));
    return (
      <StepField
        title="Content"
        svg="ArrowRightIcon"
        iconColor="#007AFF"
      >
        {html}
        <Button icon="AddIcon" primary onClick={this.onAdd} />
        <input type="text" placeholder="Add text/url" />
      </StepField>
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
      <StepField
        title="Handoff"
        svg="ArrowRightIcon"
        iconColor="#007AFF"
      >
        <Textarea
          data={data}
          settings={settings}
          delegate={(name, val) => {
            if (name === 'change') {
              this.handoffMessage = val.get('text');
            }
          }}
        />
      </StepField>

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
