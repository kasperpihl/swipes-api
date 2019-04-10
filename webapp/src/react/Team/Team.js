import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import TeamHeader from 'src/react/Team/Header/TeamHeader';
import TeamUser from 'src/react/Team/User/TeamUser';
import TeamInviteInput from 'src/react/Team/Invite/Input/TeamInviteInput';
import TeamPendingInvites from 'src/react/Team/Invite/PendingInvites/TeamPendingInvites';
import TabBar from 'src/react/_components/TabBar/TabBar';
import TeamBillingStatus from './BillingStatus/TeamBillingStatus';

import propsOrPop from 'src/react/_hocs/propsOrPop';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import Spacing from '_shared/Spacing/Spacing';

import SW from './Team.swiss';

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
      tabIndex: 0,
      showPendingInvites: false
    };
  }

  handleTabChange = index => {
    if (this.state.tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  };

  renderHeader = (subType, color) => {
    const { team, meInTeam } = this.props;
    return (
      <TeamHeader
        name={team.get('name')}
        team={team}
        meInTeam={meInTeam}
        admin={team.getIn(['users', meInTeam.get('user_id'), 'admin'])}
        subType={subType}
        color={color}
      />
    );
  };

  renderTabBar = () => {
    const { team } = this.props;
    const activeMembers = team
      .get('users')
      .filter(u => u.get('status') === 'active').size;
    const disabledUsersAmount = team
      .get('users')
      .filter(u => u.get('status') === 'disabled').size;

    let tabs = [`Active members (${activeMembers})`];
    if (disabledUsersAmount > 0) {
      tabs.push(`Deactivated members (${disabledUsersAmount})`);
    }
    return (
      <TabBar
        tabs={tabs}
        value={this.state.tabIndex}
        onChange={this.handleTabChange}
      />
    );
  };

  showPendingInvites = () => {
    this.setState({ showPendingInvites: !this.state.showPendingInvites });
  };

  getTeamStatus = () => {
    const { team } = this.props;
    const now = moment();
    const endingAt = moment(team.get('trial_ending'));
    const trialExpired = endingAt.isBefore(now);
    const daysLeft = endingAt.diff(now, 'days');
    const activeSubscription = team.get('stripe_subscription_id') !== null;
    let status = {
      subType: '',
      color: '',
      daysLeft
    };
    if (activeSubscription) {
      status.subType = 'Active';
      status.color = '$green1';
    }
    if (!activeSubscription && daysLeft > 0) {
      status.subType = 'Trial';
      status.color = '$red';
    }
    if (!activeSubscription && trialExpired) {
      status.subType = 'Expired';
      status.color = '$red';
    }

    return status;
  };

  render() {
    const { tabIndex, showPendingInvites } = this.state;
    const { team, meInTeam } = this.props;
    const userStatus = tabIndex === 0 ? 'active' : 'disabled';
    const { subType, color, daysLeft } = this.getTeamStatus();

    return (
      <CardContent noframe header={this.renderHeader(subType, color)}>
        <SW.Wrapper>
          <Spacing height={24} />
          <TeamBillingStatus
            subType={subType}
            daysLeft={daysLeft}
            team={team}
          />
          <Spacing height={48} />
          <TeamInviteInput
            teamId={team.get('team_id')}
            handleClick={this.showPendingInvites}
            showInvites={showPendingInvites}
            pendingUsers={team.get('pending_users').size}
          />
          <TeamPendingInvites team={team} showInvites={showPendingInvites} />
          <Spacing height={24} />
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
