import React, { PureComponent } from 'react';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';

import withLoader from 'src/react/_hocs/withLoader';
import request from 'swipes-core-js/utils/request';
import propsOrPop from 'src/react/_hocs/propsOrPop';
import SWView from 'src/react/app/view-controller/SWView';

import navWrapper from 'src/react/app/view-controller/NavWrapper';
import BillingHeader from './Header/BillingHeader';
import BillingPaymentActive from './Payment/Active/BillingPaymentActive';
import BillingPaymentSubmit from './Payment/Submit/BillingPaymentSubmit';

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
  onCardDetails() {
    const { openModal } = this.props;

    openModal({
      component: BillingChangeCard,
      title: 'Change card details',
      position: 'center',
      props: {}
    });
  }
  handlePlanChange = plan => {
    const { openModal, organization } = this.props;
    if (!organization.get('stripe_subscription_id')) {
      this.setState({ plan });
    } else {
      openModal({
        component: BillingPlanConfirm,
        title: 'Change billing plan',
        position: 'center',
        props: {
          plan,
          organizationId: organization.get('organization_id'),
          currentPlan: this.state.plan
        }
      });
    }
    this.setState({ plan });
  };
  render() {
    const { organization } = this.props;
    const { plan } = this.state;

    return (
      <Elements>
        <SWView header={<BillingHeader organization={organization} />}>
          <SW.Wrapper>
            <BillingPlanSelector
              value={this.state.plan}
              onChange={this.handlePlanChange}
            />
            <SW.PaymentSection>
              {organization.get('stripe_subscription_id') ? (
                <BillingPaymentActive />
              ) : (
                <BillingPaymentSubmit organization={organization} plan={plan} />
              )}
            </SW.PaymentSection>
          </SW.Wrapper>
        </SWView>
      </Elements>
    );
  }
}
