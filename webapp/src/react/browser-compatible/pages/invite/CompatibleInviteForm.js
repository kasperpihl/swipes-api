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
  renderInput(i, obj) {

    const { getLoading } = this.props;
    const lState = getLoading(i);
    const isLoading = lState.loading;
    const successLabel = lState.successLabel;
    const errorLabel = lState.errorLabel;
    const labelTargetForName = `compatible-invite-name-${i}`;
    const labelTargetForEmail = `compatible-invite-email-${i}`;

    const isDisabled = !!(lState.loading || lState.successLabel)

    return (
      <div className="input-row" key={i}>
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
              <div className="compatible-invite-form__input-label">First name</div>
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
              <div className="compatible-invite-form__input-label">name@company.com</div>
            </div>
          </label>
        </div>
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
