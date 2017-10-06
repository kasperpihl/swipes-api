import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/compatible-invite-form.scss';

class CompatibleInviteForm extends PureComponent {
  constructor(props) {
    super(props);

    bindAll(this, ['handleAddInput']);

    setupDelegate(this, 'onNameChange', 'onEmailChange', 'onAddInput');
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  renderLoader(isLoading, successLabel) {
    
    if (!isLoading && !successLabel) {
      return undefined;
    }

    if (isLoading) {
      return (
        <div className="input-row__states">
          <Icon icon="darkloader" width="12" height="12" className="input-row__loader" />
        </div>
      )
    }

    if (successLabel) {
      return (
        <div className="input-row__states">
          <Icon icon="ChecklistCheckmark" className="input-row__success" />
        </div>
      )
    }
  }
  renderInput(i, obj) {
    const { getLoading } = this.props;
    const lState = getLoading(i);
    const nameError = getLoading(i + 'name').errorLabel;
    const emailError = getLoading(i + 'email').errorLabel;
    const isLoading = lState.loading;
    const successLabel = lState.successLabel;
    const isDisabled = !!(lState.loading || lState.successLabel);

    const labelTargetForName = `compatible-invite-name-${i}`;
    const labelTargetForEmail = `compatible-invite-email-${i}`;
    let className = 'input-row';

    if (nameError) className += ' input-row--error input-row--name-error';
    if (emailError) className += ' input-row--error input-row--email-error';

    const nameLabel = nameError ? nameError : 'First name';
    const emailLabel = emailError ? emailError : 'name@company.com';

    return (
      <div className={className} key={i}>
        <div className="input-row__wrapper">
          <label htmlFor={labelTargetForName}>
            <div className="input-row__inner-wrapper">
              <input 
                type="text" 
                id={labelTargetForName} 
                className="compatible-invite-form__input" 
                placeholder=" " 
                autoFocus={i === 0} 
                disabled={isDisabled}
                value={obj.get('firstName')}
                onChange={this.onNameChangeCached(i)}
              />
              <div className="compatible-invite-form__input-label">{nameLabel}</div>
            </div>
          </label>
        </div>

        <div className="input-row__wrapper">
          <div className="input-row__seperator"></div>
          <label htmlFor={labelTargetForEmail}>
            <div className="input-row__inner-wrapper">
              <input 
                type="text"
                id={labelTargetForEmail}
                className="compatible-invite-form__input"
                placeholder=" "
                disabled={isDisabled}
                value={obj.get('email')}
                onChange={this.onEmailChangeCached(i)}
              />
              <div className="compatible-invite-form__input-label">{emailLabel}</div>
            </div>
          </label>
        </div>

        {this.renderLoader(isLoading, successLabel)}
      </div>
    )
  }
  renderInputs() {
    const { invites } = this.props;

    return (
      <div className="compatible-invite-form__input-wrapper">
        {invites.map((obj, i) => this.renderInput(i, obj))}
        <div className="compatible-invite-form__add-button" onClick={this.onAddInput}>
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
