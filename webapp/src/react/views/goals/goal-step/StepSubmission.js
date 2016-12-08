import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import Button from 'Button';
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
    const goBack = (parseInt(e.target.getAttribute('data-index'), 10));
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(goBack);
    }
  }
  render() {
    const { submission } = this.props;
    const className = 'step-submission';
    let btns = ['Submit'];

    if (submission && submission.get('type') === 'decide') {
      btns = ['Yes', 'No'];
    }

    return (
      <div className={className}>
        <div className="step-submission__actions">
          {btns.map((t, i) => (
            <Button
              className="step-submission__action"
              primary={(i === 0)}
              text={t}
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
