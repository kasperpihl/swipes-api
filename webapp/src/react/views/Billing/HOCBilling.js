import React, { PureComponent } from 'react';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';

import withLoader from 'src/react/_hocs/withLoader';
import request from 'swipes-core-js/utils/request';
import propsOrPop from 'src/react/_hocs/propsOrPop';
import SWView from 'src/react/app/view-controller/SWView';

import navWrapper from 'src/react/app/view-controller/NavWrapper';
import BillingHeader from './Header/BillingHeader';
import BillingPlanSelector from './Plan/Selector/BillingPlanSelector';
import BillingPlanConfirm from './Plan/Confirm/BillingPlanConfirm';
import BillingChangeCard from './Change/Card/BillingChangeCard';
import SW from './Billing.swiss';

@navWrapper
@withLoader
@connect((state, props) => ({
  organization: state.organization.get(props.organizationId)
}))
@propsOrPop('organization')
export default class Billing extends PureComponent {
  state = {
    plan: 'monthly'
  };
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
  handleManage = () => {
    const { navPush, organization } = this.props;
    navPush({
      id: 'Organization',
      title: 'Manage team'
    });
  };
  onCardDetails() {
    const { openModal } = this.props;

    openModal({
      component: BillingChangeCard,
      title: 'Change card details',
      position: 'center',
      props: {}
    });
  }
  getPrice = () => 7.5;
  handlePlanChange = plan => {
    console.log(plan);
    this.setState({ plan });
  };
  render() {
    const { organization } = this.props;
    const numberOfUsers = organization
      .get('users')
      .filter(u => u.get('status') === 'active').size;
    return (
      <Elements>
        <SWView header={<BillingHeader organization={organization} />}>
          <SW.Wrapper>
            <BillingPlanSelector
              value={this.state.plan}
              onChange={this.handlePlanChange}
            />
            <SW.PaymentToggle>
              <SW.ToggleSubtitle>
                You have {numberOfUsers} users in {organization.get('name')}.{' '}
                {`That's ${this.getPrice(true)}`}
              </SW.ToggleSubtitle>
              <SW.ManageButton title="Manage team" onClick={this.onManage} />
            </SW.PaymentToggle>
          </SW.Wrapper>
        </SWView>
      </Elements>
    );
  }
}
