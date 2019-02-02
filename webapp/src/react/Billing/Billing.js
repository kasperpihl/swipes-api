import React, { PureComponent } from 'react';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';

import withLoader from 'src/react/_hocs/withLoader';
import request from 'swipes-core-js/utils/request';
import propsOrPop from 'src/react/_hocs/propsOrPop';
import SWView from 'src/react/_Layout/view-controller/SWView';

import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';
import FormModal from 'src/react/_components/FormModal/FormModal';
import BillingHeader from './Header/BillingHeader';
import BillingPaymentActive from './Payment/Active/BillingPaymentActive';
import BillingPaymentSubmit from './Payment/Submit/BillingPaymentSubmit';

import BillingPlan from './Plan/BillingPlan';

import SW from './Billing.swiss';

@navWrapper
@withLoader
@connect((state, props) => ({
  organization: state.organizations.get(props.organizationId)
}))
@propsOrPop('organization')
export default class Billing extends PureComponent {
  state = {
    plan: 'monthly'
  };
  updatePlanRequest = plan => {
    const { organization } = this.props;

    request('billing.updatePlan', {
      plan,
      organization_id: organization.get('organization_id')
    });
  };
  handlePlanChange = plan => {
    const { openModal, organization } = this.props;
    if (!organization.get('stripe_subscription_id')) {
      this.setState({ plan });
    } else {
      openModal(FormModal, {
        title: 'Change billing plan',
        subtitle: `You are about to change your billing plan from ${organization.get(
          'plan'
        )} to ${plan}. Any unused time from the current subscription will be converted in credits that will be used for future payments.
    
          Click 'Confirm’ to change the plan.`,
        onConfirm: this.updatePlanRequest.bind(null, plan)
      });
    }
  };
  render() {
    const { organization, openModal } = this.props;
    const { plan } = this.state;

    return (
      <Elements>
        <SWView header={<BillingHeader organization={organization} />}>
          <SW.Wrapper>
            <BillingPlan
              value={organization.get('plan') || plan}
              onChange={this.handlePlanChange}
            />
            <SW.PaymentSection>
              {organization.get('stripe_subscription_id') ? (
                <BillingPaymentActive
                  openModal={openModal}
                  organization={organization}
                />
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