import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import withNav from 'src/react/_hocs/Nav/withNav';

import ProfileHeader from 'src/react/Profile/Header/ProfileHeader';
import ProfileTeam from 'src/react/Profile/Team/ProfileTeam';
import CardContent from '_shared/Card/Content/CardContent';
import SectionHeader from '_shared/SectionHeader/SectionHeader';
import ActionBar from '_shared/ActionBar/ActionBar';
import Button from '_shared/Button/Button';

import SW from './Profile.swiss';

@withNav
@connect(state => ({
  teams: state.teams
}))
export default class Profile extends PureComponent {
  static sizes = [540];
  openCreateTeam = () => {
    const { nav } = this.props;
    nav.push({
      screenId: 'TeamCreate',
      crumbTitle: 'Create a team'
    });
  };
  renderHeader = () => <ProfileHeader />;
  render() {
    const { teams } = this.props;
    const actions = [
      <Button
        title="New team"
        icon="CircledPlus"
        onClick={this.openCreateTeam}
      />
    ];
    return (
      <CardContent header={this.renderHeader()}>
        <SW.Wrapper>
          <SectionHeader>
            <SW.HeaderItem team>Team</SW.HeaderItem>
            <SW.HeaderItem status>Status</SW.HeaderItem>
            <SW.HeaderItem members>Members</SW.HeaderItem>
          </SectionHeader>
          {teams
            .map(team => <ProfileTeam key={team.get('team_id')} team={team} />)
            .toList()}
        </SW.Wrapper>
        <SW.ActionBarWrapper>
          <ActionBar actions={actions} />
        </SW.ActionBarWrapper>
      </CardContent>
    );
  }
}
