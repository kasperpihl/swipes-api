import React, { PureComponent } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';

import { setupLoading } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Billing from './Billing';
import HOCChangeBillingPlan from './HOCChangeBillingPlan';
import HOCChangeCardDetailsModal from './HOCChangeCardDetailsModal';

@navWrapper
@connect(state => ({
  organization: state.me.getIn(['organizations', 0]),
  users: cs.users.getAllButSofi(state),
}), {
  createStripeCustomer: ca.organizations.createStripeCustomer,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      billingStatus: props.organization.get('plan') || 'monthly',
    };

    setupLoading(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.organization.get('plan') !== this.state.billingStatus) {
      this.setState({ billingStatus: nextProps.organization.get('plan') });
    }
  }
  onSubmitSuccess(token) {
    const { createStripeCustomer } = this.props;
    const { billingStatus } = this.state;

    createStripeCustomer(token.id, billingStatus).then((res) => {
      if (res.ok) {
        this.clearLoading('submit');
      } else {
        const message = res.error && res.error.message && res.error.message.message;
        this.clearLoading('submit', `!${  message}`);
      }
    });
  }
  onSwitchPlan(plan) {
    const { organization, openModal } = this.props;
    if (!organization.get('stripe_subscription_id')) {
      this.setState({ billingStatus: plan });
    } else if (this.state.billingStatus !== plan) {
      openModal({
        component: HOCChangeBillingPlan,
        title: 'Change billing plan',
        position: 'center',
        props: {
          plan,
          currentPlan: this.state.billingStatus
        },
      });
    }
  }
  onManage() {
    const { navPush } = this.props;
    navPush({
      id: 'Organization',
      title: 'Manage team',
    });
  }
  onCardDetails() {
    const { openModal } = this.props;

    openModal({
      component: HOCChangeCardDetailsModal,
      title: 'Change card details',
      position: 'center',
      props: {},
    });
  }
  render() {
    const { billingStatus } = this.state;
    const { organization, users } = this.props;

    // if we need to change the token this is not the only instance of it
    // we need to fix that
    let token = 'pk_live_vLIRvcBoJ4AA9sFUpmVT11gQ';

    if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'staging.swipesapp.com') {
      token = 'pk_test_0pUn7s5EyQy7GeAg93QrsJl9';
    }

    return (
      <StripeProvider apiKey={token}>
        <Elements>
          <Billing
            delegate={this}
            billingStatus={billingStatus}
            organization={organization}
            users={users}
            {...this.bindLoading()}
          />
        </Elements>
      </StripeProvider>
    );
  }
}
