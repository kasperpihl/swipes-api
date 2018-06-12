import React, { PureComponent } from 'react';
import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import { styleElement, SwissProvider } from 'swiss-react';
import FloatingInput from 'compatible/components/input/FloatingInput';
import Icon from 'Icon';
<<<<<<< HEAD
import styles from './styles/CompatibleInviteForm.swiss';
=======
import styles from './CompatibleInviteForm.swiss';
>>>>>>> development

const InviteForm = styleElement('div', styles.InviteForm);
const RowWrapper = styleElement('div', styles.RowWrapper);
const InputRow = styleElement('div', styles.InputRow);
const StyledFloatingInput = styleElement(FloatingInput, styles.StyledFloatingInput);
const Separator = styleElement('div', styles.Separator);
const Wrapper = styleElement('div', styles.Wrapper);
const AddButton = styleElement('div', styles.AddButton);
const AddSVG = styleElement(Icon, styles.AddSVG);
const States = styleElement('div', styles.States);
const Loader = styleElement(Icon, styles.Loader);
const Success = styleElement(Icon, styles.Success);

class CompatibleInviteForm extends PureComponent {
  constructor(props) {
    super(props);
<<<<<<< HEAD
    this.state =  {};
=======
>>>>>>> development
    setupDelegate(this, 'onNameChange', 'onEmailChange', 'onAddInput');
    // this.callDelegate.bindAll('onLala');
  }

  renderLoader(isLoading, success) {

    if (isLoading) {
      return (
        <States>
          <Loader icon="darkloader"/>
        </States>
      )
    }

    if (success) {
      return (
        <States>
          <Success icon="ChecklistCheckmark" />
        </States>
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
      <InputRow key={i}>
        <RowWrapper>
                <StyledFloatingInput
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
        </RowWrapper>
        <Separator></Separator>
        <RowWrapper>
              <StyledFloatingInput
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
        </RowWrapper>

        {this.renderLoader(isLoading, success)}
      </InputRow>
    )
  }
  renderInputs() {
    const { invites } = this.props;

    return (
      <Wrapper>
        {invites.map((obj, i) => this.renderInput(i, obj))}
        <AddButton onClick={this.onAddInput}>
          <AddSVG icon="Plus" />
          Add more people
        </AddButton>
      </Wrapper>
    );
  }
  render() {
    return (
      <InviteForm>
        {this.renderInputs()}
      </InviteForm>
    );
  }
}

export default CompatibleInviteForm;
