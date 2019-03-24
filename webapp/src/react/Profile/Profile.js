import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileHeader from 'src/react/Profile/Header/ProfileHeader';
import ProfileTeam from 'src/react/Profile/Team/ProfileTeam.js';
import withNav from 'src/react/_hocs/Nav/withNav';
import SW from './Profile.swiss';
import CardContent from 'src/react/_components/Card/Content/CardContent';

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
    return (
      <CardContent header={this.renderHeader()}>
        <SW.Wrapper>
          <SW.Title>Teams you are part of</SW.Title>
          <SW.Button title="Create Team" onClick={this.openCreateTeam} border />
          {teams
            .map(team => <ProfileTeam key={team.get('team_id')} team={team} />)
            .toList()}
        </SW.Wrapper>
      </CardContent>
    );
  }
}
