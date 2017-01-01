import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import Button from 'Button';
import { fromJS } from 'immutable';
import { nearestAttribute } from 'classes/utils';
import * as Fields from 'src/react/swipes-fields';
import './styles/step-submission.scss';

class StepSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
  }
  onSubmit(e) {
    const goBack = parseInt(nearestAttribute(e.target, 'data-index'), 10);
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(goBack, this.handoffMessage);
    }
  }
  renderHandoffField() {
    const Textarea = Fields.textarea;
    const data = fromJS({ text: '' });
    const settings = fromJS({ editable: true, placeholder: 'handoff' });
    return (
      <Textarea
        data={data}
        settings={settings}
        delegate={(name, val) => {
          if (name === 'change') {
            this.handoffMessage = val.get('text');
          }
        }}
      />
    );
  }
  render() {
    const { submission, disabled } = this.props;
    const className = 'step-submission';
    let btns = ['Complete Step'];

    if (submission && submission.get('type') === 'decide') {
      btns = ['Complete Step', 'Go Back'];
    }

    return (
      <div className={className}>
        {this.renderHandoffField()}
        <div className="step-submission__actions">
          {btns.map((t, i) => (
            <Button
              className="step-submission__action"
              primary={(i === 0)}
              text={t}
              disabled={disabled}
              onClick={this.onSubmit}
              data-index={i}
              key={i}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default StepSubmission;

const { func, bool } = PropTypes;

StepSubmission.propTypes = {
  onSubmit: func,
  submission: map,
  disabled: bool,
};
