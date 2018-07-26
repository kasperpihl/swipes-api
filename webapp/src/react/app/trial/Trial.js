import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Trial.swiss';
import { SwissProvider } from '../../../../node_modules/swiss-react';

@connect(state => ({
  me: state.me,
  subscribed: state.me.getIn(['organizations', 0, 'stripe_subscription_id']),
  organization: state.me.get('organizations'),
  trial: state.me.get(['organizations', 0, 'trial']),
  isAccount: (state.navigation.getIn(['primary', 'id']) === 'AccountList')
}), {
  navSet: navigationActions.set,
  navPush: navigationActions.push,
})
export default class Trial extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      daysLeft: msgGen.orgs.getDaysLeft(),
      dismissed: false,
    };
  }
  componentDidMount() {
    if(!this.props.subscribed) {
      this.interval = setInterval(this.updateDaysLeft, 1000);
    }
  }
  componentDidUpdate(prevProps) {
    if(!this.props.subscribed && prevProps.subscribed) {
      this.interval = setInterval(this.updateDaysLeft, 1000);
    }
    else if(this.props.subscribed && !prevProps.subscribed) {
      clearInterval(this.interval);
    }
    this.updateDaysLeft();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  onExtend() {
    window.open('mailto:help@swipesapp.com?subject=Trial%20extension&body=Dear%20Swipes%20Team,%0D%0A%0D%0ACan%20you%20please%20extend%20my%20free%20trial%20because%20me%20and%20my%20team%20want%20to...')
  }
  onUnpaid = (e) => {
    const { navSet, navPush } = this.props;
    this.onDismiss();
    navSet('primary', {
      id: 'AccountList',
      title: 'Account',
    })
    navPush('primary', {
      id: 'Billing',
      title: 'Billing',
    })
  }
  onDismiss = () => {
    this.setState({ dismissed: true });
  }
  updateDaysLeft = () => {
    if(!this.props.subscribed) {
      const newDaysLeft = msgGen.orgs.getDaysLeft();
      if(newDaysLeft !== this.state.daysLeft) {
        this.setState({ daysLeft: newDaysLeft });
      }
    }
  }
  shouldShowPopup() {
    const { isAccount } = this.props;
    const { daysLeft, dismissed } = this.state;
    const isAdmin = msgGen.me.isAdmin();
    return (!isAccount && (daysLeft <= -7 || (isAdmin && daysLeft < 0 && !dismissed)));
  }
  renderTrialIndicator() {
    const isAdmin = msgGen.me.isAdmin();
    const shouldShowPopup = this.shouldShowPopup();

    if(!isAdmin || shouldShowPopup) {
      return undefined;
    }

    const { daysLeft } = this.state;

    let text = `${daysLeft} day${daysLeft !== 1 ? 's': ''} left in trial`;
    let expired = undefined;

    if (daysLeft < 0) {
      text = 'Unpaid subscription. Add billing info.';
      expired = true
    }

    return (
      <SW.Indicator expired={expired}>
        <SW.Label onClick={this.onUnpaid}>
          {text}
        </SW.Label>
      </SW.Indicator>
    );
  }
  renderTrialPopup() {
    const { daysLeft, dismissed } = this.state;
    const { me } = this.props;
    const show = this.shouldShowPopup();

    if(!show) {
      return undefined;
    }

    let actionLbl = 'Add billing info to continue the service for your team.';
    const name = msgGen.users.getFirstName(me.get('id'));
    const isAdmin = msgGen.me.isAdmin();
    let displayActions = undefined;

    if(!isAdmin) {
      actionLbl = 'Contact your admin to continue the service for your team';
      displayActions = false
    }

    return (
      <SwissProvider displayActions={displayActions}>
        <SW.PopupWrapper>
          <SW.Popup>
            <SW.Title>Dear {name}, your free trial has expired.</SW.Title>
            <SW.Paragraph>Subscribe and unite the work of your team in a single place - your project goals, files, and communication.</SW.Paragraph>
            <SW.Paragraph>⭐&nbsp;&nbsp;Your progress is saved. {actionLbl}</SW.Paragraph>
            <SW.Actions >
              {(daysLeft > -7) ? <SW.Button
                title="Dismiss"
                onClick={this.onDismiss}
              /> : null}
              {isAdmin ? <SW.Button
                title="Request extension"
                onClick={this.onExtend}
              /> : null}
              {isAdmin ? (
                <SW.Button
                  title="Add billing info"
                  onClick={this.onUnpaid}
                />
              ) : null}
            </SW.Actions>
          </SW.Popup>
        </SW.PopupWrapper>
      </SwissProvider>
    )
  }
  render() {
    const { subscribed, organization } = this.props;

    if (subscribed || !organization || !organization.size) {
      return null;
    }

    return (
      <SW.Wrapper >
        {this.renderTrialIndicator()}
        {this.renderTrialPopup()}
      </SW.Wrapper>
    );
  }
}
