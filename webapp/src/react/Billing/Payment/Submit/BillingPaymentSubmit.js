import React from 'react';
import useLoader from 'src/react/_hooks/useLoader';
import { injectStripe } from 'react-stripe-elements';

import request from 'core/utils/request';
import billingGetPrice from 'src/utils/billing/billingGetPrice';

import BillingPaymentInput from 'src/react/Billing/Payment/Input/BillingPaymentInput';

import SW from './BillingPaymentSubmit.swiss';
import Spacing from '_shared/Spacing/Spacing';

export default injectStripe(function BillingPaymentSubmit({
  stripe,
  team,
  plan
}) {
  const loader = useLoader();
  const everyString = plan === 'monthly' ? 'month' : 'year';

  const handleSubmit = () => {
    loader.set('submit');
    stripe
      .createToken()
      .then(({ token, error }) => {
        if (error) {
          return loader.error('submit', error.message);
        }
        console.log('Received Stripe token:', token);

        return request('billing.add', {
          stripe_token: token.id,
          team_id: team.get('team_id'),
          plan
        });
      })
      .then(res => {
        if (res.ok) {
          loader.clear('submit');
        } else {
          loader.error('submit', res.error, 3000);
        }
      });
  };

  const activeUsersAmount = team
    .get('users')
    .filter(u => u.get('status') === 'active').size;

  return (
    <SW.Wrapper>
      <BillingPaymentInput
        label="Payments information"
        billedAmount={billingGetPrice(team, plan)}
        activeUsersAmount={activeUsersAmount}
        plan={plan}
      />

      <SW.Terms>
        {`To ensure uninterrupted service, your subscription will be set to continuous auto-renewal payments of $${billingGetPrice(
          team,
          plan
        )} per ${everyString} (plus applicable taxes), with your next payment due on Apr 4, 2020. You can cancel your subscription at any time from your Billing page, or by contacting our Customer Service on help@swipesapp.com. Yearly subscriptions can be canceled with a full refund 14 days after purchase. You also agree to our `}
        <SW.Link
          target="_blank"
          href="https://s3.amazonaws.com/cdn.swipesapp.com/downloads/Policies.pdf"
        >
          Terms of Service
        </SW.Link>
        {` and confirm that you have read and understood our Privacy Policy.`}
      </SW.Terms>
      <Spacing height={30} />
      <SW.Button
        status={loader.get('submit')}
        title="Submit Payment"
        onClick={handleSubmit}
        green
      />
    </SW.Wrapper>
  );
});
