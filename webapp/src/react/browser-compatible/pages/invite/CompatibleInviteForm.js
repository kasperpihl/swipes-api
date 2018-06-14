import React, { PureComponent } from 'react';
import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import SW from './CompatibleInviteForm.swiss';

class CompatibleInviteForm extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onNameChange', 'onEmailChange', 'onAddInput');
    // this.callDelegate.bindAll('onLala');
  }

  renderLoader(isLoading, success) {

    if (isLoading) {
      return (
        <SW.States>
          <SW.Loader icon="darkloader"/>
        </SW.States>
      )
    }

    if (success) {
      return (
        <SW.States>
          <Sw.Success icon="ChecklistCheckmark" />
        </SW.States>
      )
    }

    return undefined;
  }

  renderInput(i, obj) {
    const { getLoading, invites } = this.props;
    const lState = getLoading(i);
    const nameError = getLoading(i + 'name').error;
    const emailError = getLoading(i + 'email').error;
    const isLoading = !!lState.loading;
    const success = lState.success;
    const isDisabled = !!(lState.loading || lState.success);
    const labelTargetForName = `compatible-invite-name-${i}`;
    const labelTargetForEmail = `compatible-invite-email-${i}`;

    let className = 'input-row';

    const nameLabel = 'First name';
    const emailLabel = 'name@company.com';

    return (
      <SW.InputRow key={i}>
        <SW.RowWrapper>
                <SW.StyledFloatingInput
                  leftfield
                  inviteFormField
                  inputError={nameError}
                  placeholder={nameLabel}
                  value={obj.get('firstName')}
                  inputKey={`name${i}`}
                  type='text'
                  autoFocus={i === 0}
                  onChange={this.onNameChangeCached(i)}
                />
        </SW.RowWrapper>
        <SW.Separator></SW.Separator>
        <SW.RowWrapper>
              <SW.StyledFloatingInput
                  rightfield
                  inviteFormField
                  placeholder={emailLabel}
                  inputError={emailError}
                  value={obj.get('email')}
                  inputKey={`email${i}`}
                  type='text'
                  autoFocus={i === 0}
                  onChange={this.onEmailChangeCached(i)}
                />
        </SW.RowWrapper>

        {this.renderLoader(isLoading, success)}
      </SW.InputRow>
    )
  }
  renderInputs() {
    const { invites } = this.props;

    return (
      <SW.Wrapper>
        {invites.map((obj, i) => this.renderInput(i, obj))}
        <SW.AddButton onClick={this.onAddInput}>
          <SW.AddSVG icon="Plus" />
          Add more people
        </SW.AddButton>
      </SW.Wrapper>
    );
  }
  render() {
    return (
      <SW.InviteForm>
        {this.renderInputs()}
      </SW.InviteForm>
    );
  }
}

export default CompatibleInviteForm;
