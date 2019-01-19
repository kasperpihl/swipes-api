import React from 'react';
import SW from './BillingFooter.swiss';

const BillingFooter = props => {
  const { organization, billingStatus, getLoading } = this.props;
  const hasStripe = organization.get('stripe_subscription_id');
  const everyString = billingStatus === 'monthly' ? 'month' : 'year';
  return (
    <SW.PaymentSection>
      <SW.TopSection success={hasStripe ? true : ''}>
        <SW.CardSection label="Credit or debit card" />
        <SW.SubmitButton
          {...getLoading('submit')}
          title="Submit Payment"
          onClick={this.onSubmit}
        />
        <SW.SubmitButtonSubtitle>
          You will be billed {this.getPrice()}.
        </SW.SubmitButtonSubtitle>

        <SW.CardSectionSubtitle>
          Your subscription will automatically renew every {everyString}. You
          can always cancel your account by writing to us on help@swipesapp.com.
          <br />
          <br />
          By Clicking the 'Submit Payment' button above, you are agreeing to our{' '}
          <SW.Link href="https://s3.amazonaws.com/cdn.swipesapp.com/downloads/Policies.pdf">
            Terms of Service
          </SW.Link>
          .
        </SW.CardSectionSubtitle>
      </SW.TopSection>
      <SW.BottomSection success={hasStripe ? true : ''}>
        <SW.BottomSectionTitle>
          Thank you for your purchase.
        </SW.BottomSectionTitle>
        <SW.PaymentStatus>
          <SW.PaymentStatusLabel>
            Your subscription status is:
          </SW.PaymentStatusLabel>
          <SW.Status active={!hasStripe ? false : true}>Active</SW.Status>
        </SW.PaymentStatus>
        <SW.ChangeDetails
          title="Change card details"
          onClick={this.onCardDetails}
        />
      </SW.BottomSection>
    </SW.PaymentSection>
  );
};

export default BillingFooter;
