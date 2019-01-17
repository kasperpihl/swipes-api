import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileHeader from 'src/react/views/Profile/Header/ProfileHeader';
import ProfileOrgItem from 'src/react/views/Profile/Org/Item/ProfileOrgItem.js';
import ProfileOrgCreate from 'src/react/views/Profile/Org/Create/ProfileOrgCreate.js';
import Button from 'src/react/components/Button/Button';
import * as menuActions from 'src/redux/menu/menuActions';
import request from 'swipes-core-js/utils/request';

import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './Profile.swiss';
import SWView from 'src/react/app/view-controller/SWView';

@navWrapper
@connect(
  state => ({
    organization: state.organization
  }),
  {
    confirm: menuActions.confirm
  }
)
export default class Profile extends PureComponent {
  static sizes = () => [540];

  handleLogout = e => {
    const { confirm } = this.props;

    confirm(
      {
        boundingRect: e.target.getBoundingClientRect(),
        alignX: 'center',
        title: 'Log out',
        message: 'Do you want to log out?'
      },
      i => {
        if (i === 1) {
          request('user.signout');
        }
      }
    );
  };
  handleCreateOrganization = () => {
    const { openModal } = this.props;
    openModal({
      component: ProfileOrgCreate,
      position: 'center'
    });
  };
  renderHeader = () => <ProfileHeader />;
  render() {
    const { organization } = this.props;
    return (
      <SWView header={this.renderHeader()}>
        <SW.Wrapper>
          {organization
            .map(org => (
              <ProfileOrgItem
                key={org.get('organization_id')}
                organization={org}
              />
            ))
            .toList()}
          <Button
            title="Create Organization"
            onClick={this.handleCreateOrganization}
            rounded
          />
        </SW.Wrapper>
      </SWView>
    );
  }
}
