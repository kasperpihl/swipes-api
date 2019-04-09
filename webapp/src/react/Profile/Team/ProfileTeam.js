import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import withNav from 'src/react/_hocs/Nav/withNav';
import SW from './ProfileTeam.swiss';

@withNav
@connect(state => ({
  me: state.me
}))
export default class ProfileTeam extends PureComponent {
  handleOpenTeam = () => {
    const { team, nav, me } = this.props;

    nav.push({
      screenId: 'Team',
      crumbTitle: 'Team',
      props: {
        teamId: team.get('team_id')
      }
    });
  };

  renderSubscriptionStatus = () => {
    const { team } = this.props;
    const now = moment();
    const endingAt = moment(team.get('trial_ending'));
    const trialExpired = endingAt.isBefore(now);
    const daysLeft = endingAt.diff(now, 'days');

    if (team.get('stripe_subscription_id')) {
      return;
    }
    if (daysLeft > 0) {
      return (
        <SW.TeamInfo>
          {daysLeft > 0
            ? `Trial (${daysLeft} ${daysLeft > 1 ? 'days' : 'day'} left)`
            : 'Trial Expired'}
        </SW.TeamInfo>
      );
    } else if (trialExpired) {
      return <SW.TeamInfo>Trial Expired</SW.TeamInfo>;
    } else if (false) {
      return <SW.TeamInfo error>Payment Error</SW.TeamInfo>;
    } // TODO: add payment error conditional rendering whenever that is implemented
  };
  render() {
    const { team, first } = this.props;
    const activeCount = team
      .get('users')
      .filter(u => u.get('status') === 'active').size;

    return (
      <SW.Wrapper onClick={this.handleOpenTeam} first={first}>
        <SW.TeamName>{team.get('name')}</SW.TeamName>
        <SW.Options>
          {this.renderSubscriptionStatus()}
          <SW.TeamInfo right>{activeCount}</SW.TeamInfo>
        </SW.Options>
      </SW.Wrapper>
    );
  }
}
