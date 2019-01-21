import React from 'react';
import useLoader from 'src/react/_hooks/useLoader';
import { injectStripe } from 'react-stripe-elements';
import SW from './BillingPaymentSubmit.swiss';
import BillingPaymentInput from 'src/react/Billing/Payment/Input/BillingPaymentInput';
import request from 'swipes-core-js/utils/request';
import billingGetPrice from 'src/utils/billing/billingGetPrice';

export default injectStripe(function BillingPaymentSubmit({
  stripe,
  organization,
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
          organization_id: organization.get('organization_id'),
          plan
        });
      })
      .then(res => {
        if (res.ok) {
          loader.clear('submit');
        } else {
          loader.error('submit', 'Something went wrong', 3000);
        }
      });
  };

  return (
    <SW.Wrapper>
      <BillingPaymentInput label="Credit or debit card" />
      <SW.SubmitButton
        status={loader.get('submit')}
        title="Submit Payment"
        onClick={handleSubmit}
      />
      <SW.Subtitle>
        You will be billed ${billingGetPrice(organization, plan)}.
      </SW.Subtitle>

      <SW.Terms>
        Your subscription will automatically renew every {everyString}. You can
        always cancel your account by writing to us on help@swipesapp.com.
        <br />
        <br />
        By Clicking the 'Submit Payment' button above, you are agreeing to our{' '}
        <SW.Link
          target="_blank"
          href="https://s3.amazonaws.com/cdn.swipesapp.com/downloads/Policies.pdf"
        >
          Terms of Service
        </SW.Link>
        .
      </SW.Terms>
    </SW.Wrapper>
  );
});
