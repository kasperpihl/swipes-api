import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import Button from 'Button';
import { fromJS } from 'immutable';
import { nearestAttribute } from 'classes/utils';
import * as Fields from 'src/react/swipes-fields';
import './styles/step-submission.scss';
import GoalStatus from './GoalStatus';

class StepSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = { showHandoff: false };
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  componentDidMount() {
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.showHandoff && !prevState.showHandoff) {
      this.refs.textarea.focus();
    }
  }
  onClose() {
    this.setState({ showHandoff: false });
  }
  onSubmit(e) {
    if (!this.state.showHandoff) {
      this.setState({ showHandoff: true });
    } else {
      const { onSubmit } = this.props;
      if (onSubmit) {
        onSubmit(0, this.handoffMessage);
      }
    }
  }
  renderStatusMessage() {
    if (!this.state.showHandoff) {
      return undefined;
    }
    const from = ['UZTYMBVGO'];
    const to = ['UB9BXJ1JB', 'URU3EUPOE'];
    const message = 'You will complete and pass it on to Stefan & Yana for Development.';
    return (
      <GoalStatus fromAssignees={from} toAssignees={to} message={message} />
    );
  }
  renderHandoffField() {
    if (!this.state.showHandoff) {
      return undefined;
    }
    const Textarea = Fields.textarea;
    const data = fromJS({ text: '' });
    const settings = fromJS({ editable: true, placeholder: 'What message should be passed on to them?' });
    return (
      <Textarea
        ref="textarea"
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
  renderHandoffButton() {
    if (this.state.showHandoff) {
      return undefined;
    }
    return (
      <Button
        className="step-submission__action"
        primary
        text="Handoff"
        onClick={this.onSubmit}
      />
    );
  }
  renderCompleteButton() {
    const { disabled } = this.props;
    if (!this.state.showHandoff) {
      return undefined;
    }
    return (
      <Button
        className="step-submission__action"
        primary
        text="Complete Step"
        disabled={disabled}
        onClick={this.onSubmit}
      />
    );
  }

  renderCloseButton() {
    const { disabled } = this.props;
    if (!this.state.showHandoff || disabled) {
      return undefined;
    }
    return (
      <Button
        className="step-submission__action"
        text="Cancel"
        onClick={this.onClose}
      />
    );
  }
  renderSomethingElse() {
    if (!this.state.showHandoff) {
      return undefined;
    }
    return <div className="something-else"><a>Skip to another step</a> or <a>Handoff current step</a></div>;
  }
  render() {
    return (
      <div className="step-submission">
        {this.renderStatusMessage()}
        {this.renderHandoffField()}
        <div className="step-submission__actions">
          {this.renderSomethingElse()}
          {this.renderHandoffButton()}
          {this.renderCloseButton()}
          {this.renderCompleteButton()}
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
