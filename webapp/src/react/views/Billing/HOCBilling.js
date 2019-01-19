import React, { PureComponent } from 'react';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';

import withLoader from 'src/react/_hocs/withLoader';
import request from 'swipes-core-js/utils/request';
import propsOrPop from 'src/react/_hocs/propsOrPop';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import BillingPlanSelector from './Plan/Selector/BillingPlanSelector';
import BillingPlanConfirm from './Plan/Confirm/BillingPlanConfirm';
import BillingChangeCard from './Change/Card/BillingChangeCard';

@navWrapper
@withLoader
@connect((state, props) => ({
  organization: state.organization.get(props.organizationId)
}))
@propsOrPop('organization')
export default class Billing extends PureComponent {
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
        component: BillingPlanConfirm,
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

    return <Elements>hi</Elements>;
  }
}
