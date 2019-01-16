import React, { PureComponent } from 'react';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';
import SW from './ProfileOrgDelete.swiss';

export default class ProfileOrgDelete extends PureComponent {
  constructor(props) {
    super(props);

    setupLoading(this);
  }
  handleDeleteCached = org => {
    this.setLoading('deleteOrg');
    request('organization.delete', {
      organization_id: org
    }).then(res => {
      if (res && res.ok) {
        this.clearLoading('deleteOrg', 'Success', 1500, this.props.hideModal);
      } else {
        this.clearLoading('deleteOrg', 'Something went wrong!');
      }
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
        <SW.ButtonWrapper>
          <SW.Button title="No" onClick={hideModal} />
          <SW.Button
            title="Yes"
            onClick={() => this.handleDeleteCached(orgId)}
            {...this.getLoading('deleteOrg')}
          />
        </SW.ButtonWrapper>
      </SW.Wrapper>
    );
  }
}
