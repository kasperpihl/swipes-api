import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileHeader from 'src/react/Profile/Header/ProfileHeader';
import ProfileOrg from 'src/react/Profile/Org/ProfileOrg.js';
import withLoader from 'src/react/_hocs/withLoader';
import request from 'swipes-core-js/utils/request';
import FormModal from 'src/react/_components/FormModal/FormModal';
import withNav from 'src/react/_hocs/Nav/withNav';
import SW from './Profile.swiss';
import SWView from 'src/react/_Layout/view-controller/SWView';

@withNav
@withLoader
@connect(state => ({
  organizations: state.organizations
}))
export default class Profile extends PureComponent {
  static sizes = [540];
  handleCreateOrganization = () => {
    const { nav, loader } = this.props;
    nav.openModal(FormModal, {
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
    const { organizations, loader } = this.props;
    return (
      <SWView header={this.renderHeader()}>
        <SW.Wrapper>
          <SW.Title>Organizations</SW.Title>
          <SW.Button
            title="Create Organization"
            onClick={this.handleCreateOrganization}
            status={loader.get('createOrg')}
          />
          {organizations
            .map((org, i) => (
              <ProfileOrg key={org.get('organization_id')} organization={org} />
            ))
            .toList()}
        </SW.Wrapper>
      </SWView>
    );
  }
}
