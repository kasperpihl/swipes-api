import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileHeader from './Header/ProfileHeader';
import ProfileOrgItem from './OrgItem/ProfileOrgItem';
import ProfileOrgCreate from 'src/react/views/Profile/OrgCreate/ProfileOrgCreate';
import * as menuActions from 'src/redux/menu/menuActions';
import request from 'swipes-core-js/utils/request';

import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Button from 'src/react/components/Button/Button';
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
          <SW.Button
            title="Create Organization"
            onClick={this.handleCreateOrganization}
          />
          {organization
            .map(org => (
              <ProfileOrgItem
                key={org.get('organization_id')}
                organization={org}
              />
            ))
            .toList()}
          <Button title="Log out" onClick={this.handleLogout} />
        </SW.Wrapper>
      </SWView>
    );
  }
}
