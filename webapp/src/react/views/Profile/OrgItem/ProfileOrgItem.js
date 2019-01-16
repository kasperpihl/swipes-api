import React, { PureComponent } from 'react';
import ProfileOrgDelete from 'src/react/views/Profile/OrgDelete/ProfileOrgDelete';
import Button from 'src/react/components/button/Button';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './ProfileOrgItem.swiss';

@navWrapper
export default class ProfileOrgItem extends PureComponent {
  openDeleteModal = () => {
    const { openModal, organization } = this.props;

    openModal({
      component: ProfileOrgDelete,
      position: 'center',
      props: {
        orgName: organization.get('name'),
        orgId: organization.get('organization_id')
      }
    });
  };
  render() {
    const { organization } = this.props;
    console.log(organization.toJS());
    return (
      <SW.Wrapper>
        <SW.OrgName>{organization.get('name')}</SW.OrgName>
        <SW.Options>
          <SW.UserAmount>
            {organization.get('users').size}{' '}
            {organization.get('users').size === 1 ? 'user' : 'users'}
          </SW.UserAmount>
          <Button icon="Delete" onClick={this.openDeleteModal} />
        </SW.Options>
      </SW.Wrapper>
    );
  }
}
