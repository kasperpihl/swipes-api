import React, { PureComponent } from 'react';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';

import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';
import propsOrPop from 'src/utils/propsOrPop';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Billing from './Billing';
import BillingChangePlan from './Change/Plan/BillingChangePlan';
import BillingChangeCard from './Change/Card/BillingChangeCard';

@navWrapper
@connect((state, props) => ({
  organization: state.organization.get(props.organizationId)
}))
@propsOrPop('organization')
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      billingStatus: props.organization.get('plan') || 'monthly'
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

    createStripeCustomer(token.id, billingStatus).then(res => {
      if (res.ok) {
        this.clearLoading('submit');
      } else {
        const message =
          res.error && res.error.message && res.error.message.message;
        this.clearLoading('submit', `!${message}`);
      }
    });
  }
  onSwitchPlan(plan) {
    const { organization, openModal } = this.props;
    if (!organization.get('stripe_subscription_id')) {
      this.setState({ billingStatus: plan });
    } else if (this.state.billingStatus !== plan) {
      openModal({
        component: BillingChangePlan,
        title: 'Change billing plan',
        position: 'center',
        props: {
          plan,
          organizationId: organization.get('organization_id'),
          currentPlan: this.state.billingStatus
        }
      });
    }
  }
  onManage() {
    const { navPush } = this.props;
    navPush({
      id: 'Organization',
      title: 'Manage team'
    });
  }
  onCardDetails() {
    const { openModal } = this.props;

    openModal({
      component: BillingChangeCard,
      title: 'Change card details',
      position: 'center',
      props: {}
    });
  }
  render() {
    const { billingStatus } = this.state;
    const { organization, users } = this.props;

    return (
      <Elements>
        <Billing
          delegate={this}
          billingStatus={billingStatus}
          organization={organization}
          users={users}
          {...this.bindLoading()}
        />
      </Elements>
    );
  }
}
