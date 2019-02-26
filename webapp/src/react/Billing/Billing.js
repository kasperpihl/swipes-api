import React, { PureComponent } from 'react';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';

import withLoader from 'src/react/_hocs/withLoader';
import request from 'core/utils/request';
import propsOrPop from 'src/react/_hocs/propsOrPop';
import SWView from 'src/react/_Layout/view-controller/SWView';

import withNav from 'src/react/_hocs/Nav/withNav';
import FormModal from 'src/react/_components/FormModal/FormModal';
import BillingHeader from './Header/BillingHeader';
import BillingPaymentActive from './Payment/Active/BillingPaymentActive';
import BillingPaymentSubmit from './Payment/Submit/BillingPaymentSubmit';

import BillingPlan from './Plan/BillingPlan';

import SW from './Billing.swiss';

@withNav
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
    const { nav, organization } = this.props;
    if (!organization.get('stripe_subscription_id')) {
      this.setState({ plan });
    } else {
      nav.openModal(FormModal, {
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
    const { organization, nav } = this.props;
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
                  openModal={nav.openModal}
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
