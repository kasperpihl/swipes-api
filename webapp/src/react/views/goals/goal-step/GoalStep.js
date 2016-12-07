import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll } from 'classes/utils';

// Views
import StepField from './StepField';
import StepSubmission from './StepSubmission';
import * as Fields from 'src/react/swipes-fields';

// styles
import './styles/goal-step.scss';

class GoalStep extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['onSubmit']);
    this.bindCallbacks = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  onSubmit(goBack) {

  }
  callDelegate(name) {
    const { delegate } = this.props;

    if (delegate && typeof delegate[name] === 'function') {
      return delegate[name](...[this].concat(Array.prototype.slice.call(arguments, 1)));
    }

    return undefined;
  }
  delegateFromField(index, name) {
    if (name === 'change') {
      this.callDelegate('goalStepUpdatedFieldData', index, arguments[2]);
    }
  }

  renderHandoff() {
    const { users } = this.props;
    const { stepIndex } = this.state;
    const handOff = this.helper.getHandoffMessageForStepIndex(stepIndex);

    if (handOff) {
      const firstMessage = handOff.findEntry(() => true);

      if (!firstMessage) {
        return undefined;
      }

      const user = users.get(firstMessage[0]);
      const message = firstMessage[1];

      if (user && message && message.length) {
        return (
          <StepField
            icon={user.get('profile_pic') || 'PersonIcon'}
            title={`Handoff from ${user.get('name')}`}
          >
            <div className="goal-step__hand-off-message">{message}</div>
          </StepField>
        );
      }
    }

    return undefined;
  }
  renderFields() {
    const { data, fields } = this.props;
    return fields.map((field, i) => {
      const Field = Fields[field.get('type')];
      console.log(Field);
      if (Field) {
        if (!this.bindCallbacks[i]) {
          this.bindCallbacks[i] = this.delegateFromField.bind(this, i);
        }
        return (
          <StepField
            key={field.get('id')}
            title={field.get('title')}
            icon={field.get('icon')}
            iconColor={field.get('iconColor')}
          >
            <Field
              delegate={this.bindCallbacks[i]}
              data={data.get(i)}
              settings={field.get('settings')}
            />
          </StepField>
        );
      }

      return undefined;
    });
  }
  renderPreAutomations() {
    // Here will come the pre automations
    // > Send email
    // > Save to Evernote
  }
  renderSubmission() {
    const { options, step } = this.props;
    if (options.showSubmission) {
      return <StepSubmission onSubmit={this.onSubmit} submission={step.get('submission')} />;
    }

    return undefined;
  }
  renderPostAutomations() {
    // Here will come the post automations
    // > Send email
    // > Save to Evernote
  }
  render() {
    const { step } = this.props;
    // console.log('this.props.goal.toJS()', JSON.stringify(this.props.goal.toJS()));
    return (
      <div className="goal-step">

        <div className="goal-step__content">
          {this.renderFields()}
        </div>

        <div className="submission">
          {this.renderPreAutomations()}
          {this.renderSubmission()}
          {this.renderPostAutomations()}
        </div>
      </div>
    );
  }
}

export default GoalStep;

const { string, number, object } = PropTypes;

GoalStep.propTypes = {
  goal: map,
  step: map,
  users: map,
  delegate: object,
};
