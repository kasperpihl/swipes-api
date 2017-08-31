import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Button from 'Button';
import './styles/trial.scss';

class HOCTrial extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      daysLeft: msgGen.orgs.getDaysLeft(),
      dismissed: false,
    };
    bindAll(this, ['onUnpaid', 'onDismiss', 'updateDaysLeft']);
    // setupLoading(this);
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
  onUnpaid(e) {
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
  onDismiss() {
    this.setState({ dismissed: true });
  }
  updateDaysLeft() {
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
    return (!isAccount && (daysLeft < -7 || daysLeft < 0 && !dismissed));
  }
  renderTrialIndicator() {
    const isAdmin = msgGen.me.isAdmin();
    const shouldShowPopup = this.shouldShowPopup();
    console.log('is account');
    if(!isAdmin || shouldShowPopup) {
      return undefined;
    }

    const { daysLeft } = this.state;

    let text = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left in trial`;
    if(daysLeft < 0) {
      text = 'Unpaid subscription. Add billing info.';
    }
    return (
      <div className={`trial__indicator ${daysLeft < 0 ? 'trial__indicator--expired': ''}`} >
        <span className="trial__indicator--label" onClick={this.onUnpaid}>
          {text}
        </span>
      </div>
    );
  }
  renderTrialPopup() {
    const { daysLeft, dismissed } = this.state;
    const show = this.shouldShowPopup();
    if(!show) {
      return undefined;
    }

    return (
      <div className="trial__popup">
        <div className="trial__popup--content">
          <Button
            text="Add billing info"
            primary
            onClick={this.onUnpaid}
          />
          <Button
            text="Dismiss"
            onClick={this.onDismiss}
          />
        </div>
      </div>
    )
  }
  render() {
    const { subscribed } = this.props;
    if(subscribed) {
      return <div />;
    }

    return (
      <div className="trial">
        {this.renderTrialIndicator()}
        {this.renderTrialPopup()}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCTrial.propTypes = {};

const mapStateToProps = (state) => ({
  me: state.get('me'),
  subscribed: state.getIn(['me', 'organizations', 0, 'stripe_subscription_id']),
  trial: state.getIn(['me', 'organizations', 0, 'trial']),
  isAccount: (state.getIn(['navigation', 'primary', 'stack', 1, 'id']) === 'Billing')
});

export default connect(mapStateToProps, {
  navSet: a.navigation.set,
  navPush: a.navigation.push,
})(HOCTrial);
