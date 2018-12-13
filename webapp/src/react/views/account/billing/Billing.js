import React, { PureComponent } from 'react';
import { injectStripe } from 'react-stripe-elements';
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'src/react/app/view-controller/SWView';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SW from './Billing.swiss';

const style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};
class Billing extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ''
    };
    setupDelegate(
      this,
      'onSwitchPlan',
      'onSubmitSuccess',
      'onManage',
      'onCardDetails'
    );
    bindAll(this, ['onChange', 'onSubmit']);
  }
  getPrice(hasPostfix) {
    const { billingStatus, users } = this.props;
    const numberOfUsers = users.filter(u => u.get('active')).size;
    let price = 7.5;
    let months = 1;
    let postfix = hasPostfix ? ' monthly' : '';

    if (billingStatus === 'yearly') {
      price = 6;
      months = 12;
      postfix = hasPostfix ? ` annually ($${price * numberOfUsers}/month)` : '';
    }

    return `$${(price * months * numberOfUsers).toFixed(2)}${postfix}`;
  }
  onSubmit(e) {
    e.preventDefault();
    const { stripe, setLoading, clearLoading } = this.props;

    setLoading('submit');
    stripe.createToken().then(({ token, error }) => {
      if (error) {
        clearLoading('submit');
        this.setState({ errorMessage: error.message });
      } else {
        console.log('Received Stripe token:', token);
        this.onSubmitSuccess(token);
      }
    });
  }
  onChange(cardState) {
    this.setState({ cardState });
  }
  renderHeader() {
    const { organization } = this.props;
    const hasStripe = organization.get('stripe_subscription_id');
    const status = !hasStripe ? 'Inactive' : 'Active';

    return (
      <CardHeader title="Payment">
        <SW.PaymentStatus>
          <SW.PaymentStatusLabel>
            Your subscription status is:
          </SW.PaymentStatusLabel>
          <SW.Status active={!hasStripe ? false : true}>{status}</SW.Status>
        </SW.PaymentStatus>
      </CardHeader>
    );
  }
  renderToggle() {
    const { billingStatus } = this.props;

    return (
      <SW.Toggle>
        <SW.ToggleSection
          first={billingStatus === 'monthly' ? true : false}
          onClick={this.onSwitchPlanCached('monthly')}
        >
          <SW.TogglePrice>$7.50</SW.TogglePrice>
          <SW.ToggleLabel>per user a month</SW.ToggleLabel>
          <SW.ToggleSubLabel>billed monthly</SW.ToggleSubLabel>
        </SW.ToggleSection>
        <SW.ToggleSection
          first={billingStatus === 'monthly' ? true : false}
          onClick={this.onSwitchPlanCached('yearly')}
        >
          <SW.TogglePrice>$6</SW.TogglePrice>
          <SW.ToggleLabel>per user a month</SW.ToggleLabel>
          <SW.ToggleSubLabel>
            billed anually{' '}
            <SW.SaveLabel className="save">You save 20%</SW.SaveLabel>
          </SW.ToggleSubLabel>
        </SW.ToggleSection>
      </SW.Toggle>
    );
  }
  renderBottomSection() {
    const { organization, users, billingStatus, getLoading } = this.props;
    const hasStripe = organization.get('stripe_subscription_id');

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
          {billingStatus === 'monthly' ? (
            <SW.CardSectionSubtitle>
              Your subscription will automatically renew every month. You can
              always cancel your account by writing to us on help@swipesapp.com.
              <br />
              <br />
              By Clicking the 'Submit Payment' button above, you are agreeing to
              our{' '}
              <SW.Link href="https://s3.amazonaws.com/cdn.swipesapp.com/downloads/Policies.pdf">
                Terms of Service
              </SW.Link>
              .
            </SW.CardSectionSubtitle>
          ) : (
            <SW.CardSectionSubtitle>
              Your subscription will automatically renew every year. You can
              always cancel your account by writing to us on help@swipesapp.com.
              <br />
              <br />
              By Clicking the 'Submit Payment' button above, you are agreeing to
              our{' '}
              <SW.Link href="https://s3.amazonaws.com/cdn.swipesapp.com/downloads/Policies.pdf">
                Terms of Service
              </SW.Link>
              .
            </SW.CardSectionSubtitle>
          )}
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
  }
  render() {
    const { organization, users } = this.props;
    const numberOfUsers = users.filter(u => u.get('active')).size;
    return (
      <SWView header={this.renderHeader()}>
        <SW.Wrapper>
          <SW.PaymentToggle>
            {this.renderToggle()}
            <SW.ToggleSubtitle>
              You have {numberOfUsers} users in {organization.get('name')}.{' '}
              {`That's ${this.getPrice(true)}`}
            </SW.ToggleSubtitle>
            <SW.ManageButton title="Manage team" onClick={this.onManage} />
          </SW.PaymentToggle>
          {this.renderBottomSection()}
        </SW.Wrapper>
      </SWView>
    );
  }
}

export default injectStripe(Billing);
