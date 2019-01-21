import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileHeader from 'src/react/views/Profile/Header/ProfileHeader';
import ProfileOrgItem from 'src/react/views/Profile/Org/Item/ProfileOrgItem.js';
import withLoader from 'src/react/_hocs/withLoader';
import request from 'swipes-core-js/utils/request';
import FormModal from 'src/react/components/FormModal/FormModal';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './Profile.swiss';
import SWView from 'src/react/app/view-controller/SWView';

@navWrapper
@withLoader
@connect(state => ({
  organization: state.organization
}))
export default class Profile extends PureComponent {
  static sizes = () => [540];
  handleCreateOrganization = () => {
    const { openModal, loader } = this.props;
    openModal(FormModal, {
      title: 'Create Organization',
      subtitle:
        'This will start a trial for 30 days, after which it will be $7.5/user/month.',
      inputs: [
        { type: 'text', placeholder: 'Name of organization', autoFocus: true }
      ],
      confirmLabel: 'Create',
      onConfirm: ([name]) => {
        if (!name.length) {
          return;
        }

        loader.set('createOrg');
        request('organization.add', { name }).then(res => {
          if (res && res.ok) {
            loader.clear('createOrg');
          } else {
            loader.error('createOrg', res.error);
          }
        });
      }
    });
  };
  renderHeader = () => <ProfileHeader />;
  render() {
    const { organization, loader } = this.props;
    return (
      <SWView header={this.renderHeader()}>
        <SW.Wrapper>
          <SW.Title>Organizations</SW.Title>
          <SW.Button
            title="Create Organization"
            onClick={this.handleCreateOrganization}
            status={loader.get('createOrg')}
          />
          {organization
            .map((org, i) => (
              <ProfileOrgItem
                key={org.get('organization_id')}
                organization={org}
              />
            ))
            .toList()}
        </SW.Wrapper>
      </SWView>
    );
  }
}
