import React, { PureComponent } from 'react';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';

import withLoader from 'src/react/_hocs/withLoader';
import request from 'core/utils/request';
import propsOrPop from 'src/react/_hocs/propsOrPop';
import CardContent from 'src/react/_components/Card/Content/CardContent';

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
  team: state.teams.get(props.teamId)
}))
@propsOrPop('team')
export default class Billing extends PureComponent {
  state = {
    plan: 'monthly'
  };
  updatePlanRequest = plan => {
    const { team } = this.props;

    request('billing.updatePlan', {
      plan,
      team_id: team.get('team_id')
    });
  };
  handlePlanChange = plan => {
    const { nav, team } = this.props;
    if (!team.get('stripe_subscription_id')) {
      this.setState({ plan });
    } else {
      nav.openModal(FormModal, {
        title: 'Change billing plan',
        subtitle: `You are about to change your billing plan from ${team.get(
          'plan'
        )} to ${plan}. Any unused time from the current subscription will be converted in credits that will be used for future payments.
    
          Click 'Confirm’ to change the plan.`,
        onConfirm: this.updatePlanRequest.bind(null, plan)
      });
    }
  };
  render() {
    const { team, nav } = this.props;
    const { plan } = this.state;

    return (
      <Elements>
        <CardContent header={<BillingHeader team={team} />}>
          <SW.Wrapper>
            <BillingPlan
              value={team.get('plan') || plan}
              onChange={this.handlePlanChange}
            />
            <SW.PaymentSection>
              {team.get('stripe_subscription_id') ? (
                <BillingPaymentActive openModal={nav.openModal} team={team} />
              ) : (
                <BillingPaymentSubmit team={team} plan={plan} />
              )}
            </SW.PaymentSection>
          </SW.Wrapper>
        </CardContent>
      </Elements>
    );
  }
}
