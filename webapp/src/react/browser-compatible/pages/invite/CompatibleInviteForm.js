import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import SW from './CompatibleInviteForm.swiss';

class CompatibleInviteForm extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onNameChange', 'onEmailChange', 'onAddInput');
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
          <SW.Success icon="ChecklistCheckmark" />
        </SW.States>
      )
    }

    return undefined;
  }

  renderInput(i, obj) {
    const { getLoading } = this.props;
    const lState = getLoading(i);
    const isLoading = !!lState.loading;
    const success = lState.success;

    return (
      <SW.InputRow key={i}>
        <SW.RowWrapper>
          <SW.Input
            type="text"
            placeholder="First name"
            onKeyDown={this.onKeyDown}
            value={obj.get('firstName')}
            autoFocus={i === 0}
            onChange={(e) => {
              this.onNameChange(i, e.target.value);
          }}/>
        </SW.RowWrapper>
        <SW.Separator></SW.Separator>
        <SW.RowWrapper>
          <SW.Input
            type="text"
            placeholder="Email"
            onKeyDown={this.onKeyDown}
            value={obj.get('email')}
            onChange={(e) => {
              this.onEmailChange(i, e.target.value);
          }}/>
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
