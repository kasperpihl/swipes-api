import React, { PureComponent } from 'react';
import { injectStripe } from 'react-stripe-elements';
import SWView from 'src/react/app/view-controller/SWView';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SW from './Billing.swiss';
import BillingPlanSelector from './Plan/Selector/BillingPlanSelector';

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
      errorMessage: '',
      plan: 'monthly'
    };
    setupDelegate(
      this,
      'onSwitchPlan',
      'onSubmitSuccess',
      'onManage',
      'onCardDetails'
    );
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
  handlePlanChange = plan => {
    this.setState({ plan });
  };
  onSubmit = e => {
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
  };
  onChange = cardState => {
    this.setState({ cardState });
  };
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

  render() {
    const { organization } = this.props;
    const numberOfUsers = 9;
    return (
      <SWView header={this.renderHeader()}>
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
    );
  }
}

export default injectStripe(Billing);
