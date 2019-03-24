import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import TeamHeader from 'src/react/Team/Header/TeamHeader';
import TeamUser from 'src/react/Team/User/TeamUser';
import TeamInviteInput from 'src/react/Team/Invite/Input/TeamInviteInput';
import TeamPendingInvites from 'src/react/Team/Invite/PendingInvites/TeamPendingInvites';
import SW from './Team.swiss';

import propsOrPop from 'src/react/_hocs/propsOrPop';
import CardContent from 'src/react/_components/Card/Content/CardContent';

@connect((state, props) => ({
  meInTeam: state.teams.getIn([props.teamId, 'users', state.me.get('user_id')]),
  team: state.teams.get(props.teamId)
}))
@propsOrPop('team')
export default class Team extends PureComponent {
  static sizes = [540];
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0
    };
  }

  handleTabChange = index => {
    if (this.state.tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  };

  renderHeader = () => {
    const {
      team,
      activeSubscription,
      trialExpired,
      daysLeft,
      meInTeam
    } = this.props;
    return (
      <TeamHeader
        name={team.get('name')}
        team={team}
        meInTeam={meInTeam}
        admin={team.getIn(['users', meInTeam.get('user_id'), 'admin'])}
        activeSubscription={activeSubscription}
        trialExpired={trialExpired}
        daysLeft={daysLeft}
      />
    );
  };

  renderTabBar = () => {
    const { team } = this.props;
    const disabledUsersAmount = team
      .get('users')
      .filter(u => u.get('status') === 'disabled').size;

    let tabs = ['Active users'];
    if (disabledUsersAmount > 0) {
      tabs.push('Disabled users');
    }
    return (
      <SW.TabBar
        tabs={tabs}
        value={this.state.tabIndex}
        onChange={this.handleTabChange}
      />
    );
  };

  render() {
    const { tabIndex } = this.state;
    const { team, meInTeam } = this.props;
    const userStatus = tabIndex === 0 ? 'active' : 'disabled';

    return (
      <CardContent header={this.renderHeader()}>
        <SW.Wrapper>
          <TeamInviteInput teamId={team.get('team_id')} />
          <TeamPendingInvites team={team} />
          {this.renderTabBar()}
          <SW.UsersWrapper>
            {team
              .get('users')
              .filter(u => u.get('status') === userStatus)
              .map(u => (
                <TeamUser
                  key={u.get('user_id')}
                  user={u}
                  teamId={team.get('team_id')}
                  meInTeam={meInTeam}
                />
              ))
              .toList()}
          </SW.UsersWrapper>
        </SW.Wrapper>
      </CardContent>
    );
  }
}
