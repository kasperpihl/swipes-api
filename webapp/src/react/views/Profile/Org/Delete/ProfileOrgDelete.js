import React, { PureComponent } from 'react';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';
import SW from './ProfileOrgDelete.swiss';

export default class ProfileOrgDelete extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      passwordInput: ''
    };

    setupLoading(this);
  }

  handleInputChange = e => {
    this.setState({ passwordInput: e.target.value });
  };

  handleDeleteCached = orgId => {
    request('organization.delete', {
      organization_id: orgId,
      password: this.state.passwordInput
    });
  };

  render() {
    const { orgName, orgId, hideModal } = this.props;
    return (
      <SW.Wrapper>
        <SW.Title>Delete Organization</SW.Title>
        <SW.Text>
          Are you sure that you want to delete the organization <b>{orgName}</b>
          ?
        </SW.Text>
        <SW.PasswordInput
          type="password"
          placeholder="Enter password"
          value={this.state.passwordInput}
          onChange={this.handleInputChange}
        />
        <SW.ButtonWrapper>
          <SW.Button title="No" onClick={hideModal} />
          <SW.Button
            title="Yes"
            onClick={() => this.handleDeleteCached(orgId)}
          />
        </SW.ButtonWrapper>
      </SW.Wrapper>
    );
  }
}
