import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/compatible-invite-form.scss';

class CompatibleInviteForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      numberOfInputs: 3
    };

    bindAll(this, ['handleAddInput']);

    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  handleAddInput() {
    const { numberOfInputs } = this.state;

    this.setState({ numberOfInputs: numberOfInputs + 1 })
  }
  renderInput(i, autoFocusState) {

    const labelTargetForName = `compatible-invite-name-${i}`;
    const labelTargetForEmail = `compatible-invite-email-${i}`;

    return (
      <div className="input-row" key={i}>
        <div className="input-row__wrapper">
          <label htmlFor={labelTargetForName}>
            <div className="input-row__inner-wrapper">
              <input type="text" id={labelTargetForName} className="compatible-invite-form__input" placeholder=" " autoFocus={autoFocusState} />
              <div className="compatible-invite-form__input-label">First name</div>
            </div>
          </label>
        </div>

        <div className="input-row__wrapper">
        <div className="input-row__seperator"></div>
          <label htmlFor={labelTargetForEmail}>
            <div className="input-row__inner-wrapper">
              <input type="text" id={labelTargetForEmail} className="compatible-invite-form__input" placeholder=" " />
              <div className="compatible-invite-form__input-label">name@company.com</div>
            </div>
          </label>
        </div>
      </div>
    )
  }
  renderInputs() {
    const { numberOfInputs } = this.state;
    let renderInputs = [];
    
    for (var i = numberOfInputs - 1; i >= 0; i--) {
      const autoFocusState = i === 0;
      renderInputs.push(this.renderInput(i, autoFocusState))
    }

    return (
      <div className="compatible-invite-form__input-wrapper">
        {renderInputs.reverse()}
        <div className="compatible-invite-form__add-button" onClick={this.handleAddInput}>
          <Icon icon="Plus" className="compatible-invite-form__add-svg" />
          Add more people
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="compatible-invite-form">
        {this.renderInputs()}
      </div>
    );
  }
}

export default CompatibleInviteForm

// const { string } = PropTypes;

CompatibleInviteForm.propTypes = {};
