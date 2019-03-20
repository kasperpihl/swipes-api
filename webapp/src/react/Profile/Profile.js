import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileHeader from 'src/react/Profile/Header/ProfileHeader';
import ProfileOrg from 'src/react/Profile/Org/ProfileOrg.js';
import withLoader from 'src/react/_hocs/withLoader';
import withNav from 'src/react/_hocs/Nav/withNav';
import SW from './Profile.swiss';
import CardContent from 'src/react/_components/Card/Content/CardContent';

@withNav
@withLoader
@connect(state => ({
  organizations: state.organizations
}))
export default class Profile extends PureComponent {
  static sizes = [540];
  openCreateOrganization = () => {
    const { nav } = this.props;
    nav.push({
      screenId: 'OrganizationCreate',
      crumbTitle: 'Create an organization'
    });
  };
  renderHeader = () => <ProfileHeader />;
  render() {
    const { organizations, loader } = this.props;
    return (
      <CardContent header={this.renderHeader()}>
        <SW.Wrapper>
          <SW.Title>Organizations</SW.Title>
          <SW.Button
            title="Create Organization"
            onClick={this.openCreateOrganization}
            status={loader.get('createOrg')}
          />
          {organizations
            .map((org, i) => (
              <ProfileOrg key={org.get('organization_id')} organization={org} />
            ))
            .toList()}
        </SW.Wrapper>
      </CardContent>
    );
  }
}
