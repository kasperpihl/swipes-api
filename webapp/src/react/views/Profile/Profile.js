import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileHeader from './Header/ProfileHeader';
import ProfileOrgItem from './OrgItem/ProfileOrgItem';
import ProfileOrgCreate from 'src/react/views/Profile/OrgCreate/ProfileOrgCreate';
import * as menuActions from 'src/redux/menu/menuActions';

import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Button from 'src/react/components/button/Button';
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
    const options = this.getOptionsForE({
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
      title: 'Log out',
      message: 'Do you want to log out?'
    });

    confirm(options, i => {
      i === 1 && request('user.signout');
    });
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
        <Button
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
      </SWView>
    );
  }
}
