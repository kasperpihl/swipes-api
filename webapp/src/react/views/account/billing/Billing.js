import React, { PureComponent } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { styleElement } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Button from 'src/react/components/button/Button';
import CardSection from './CardSection';
import styles from './Billing.swiss';
import { SwissProvider } from 'swiss-react/dist/cjs/components/SwissProviders';


const Wrapper = styleElement('div', styles.Wrapper);
const PaymentToggle = styleElement('div', styles.PaymentToggle);
const ToggleSubtitle = styleElement('div', styles.ToggleSubtitle);
const Status = styleElement('div', styles.Status);
const Toggle = styleElement('div', styles.Toggle);
const ToggleSection = styleElement('div', styles.ToggleSection);
const TogglePrice = styleElement('div', styles.TogglePrice);
const ToggleLabel = styleElement('div', styles.ToggleLabel);
const ToggleSubLabel = styleElement('div', styles.ToggleSubLabel);
const SaveLabel = styleElement('span', styles.SaveLabel);
const PaymentSection = styleElement('div', styles.PaymentSection);
const TopSection = styleElement('div', styles.TopSection);
const BottomSection = styleElement('div', styles.BottomSection);
const BottomSectionTitle = styleElement('div', styles.BottomSectionTitle);
const PaymentStatus = styleElement('div', styles.PaymentStatus);
const PaymentStatusLabel = styleElement('div', styles.PaymentStatusLabel);
const SubmitButtonSubtitle = styleElement('div', styles.SubmitButtonSubtitle);
const SubmitButton = styleElement(Button, styles.SubmitButton);
const ManageButton = styleElement(Button, styles.ManageButton);
const ChangeDetails = styleElement(Button, styles.ChangeDetails);

const style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};
class Billing extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
    setupDelegate(this, 'onSwitchPlan', 'onSubmitSuccess', 'onManage', 'onCardDetails');
    bindAll(this, ['onChange', 'onSubmit']);
  }
  getShowPrice() {
    const { billingStatus, users } = this.props;
    const numberOfUsers = users.filter(u => u.get('active')).size;

    let price = 9;
    let months = 1;
    let postfix = ' monthly';
    if (billingStatus === 'yearly') {
      price = 6;
      months = 12;
      postfix = ` annually ($${price * numberOfUsers}/month)`;
    }
    return `$${price * months * numberOfUsers}${postfix}`;
  }
  getPrice() {
    const { billingStatus, users } = this.props;
    const numberOfUsers = users.filter(u => u.get('active')).size;
    let price = 9;
    let months = 1;
    if (billingStatus === 'yearly') {
      price = 6;
      months = 12;
    }
    return price * months * numberOfUsers;
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
      <HOCHeaderTitle title="Payment">
        <PaymentStatus>
          <PaymentStatusLabel>Your subscription status is:</PaymentStatusLabel>
          <Status active={!hasStripe ? false : true }>{status}</Status>
        </PaymentStatus>
      </HOCHeaderTitle>
    );
  }
  renderToggle() {
    const { billingStatus } = this.props;

    return (
        <Toggle>
          <ToggleSection
          first={billingStatus === 'monthly' ? true : false}
          onClick={this.onSwitchPlanCached('monthly')}>
            <TogglePrice>$9</TogglePrice>
            <ToggleLabel>per user a month</ToggleLabel>
            <ToggleSubLabel>billed monthly</ToggleSubLabel>
          </ToggleSection>
          <ToggleSection
          first={billingStatus === 'monthly' ? true : false}
          onClick={this.onSwitchPlanCached('yearly')}>
            <TogglePrice>$6</TogglePrice>
            <ToggleLabel>per user a month</ToggleLabel>
            <ToggleSubLabel>billed anually <SaveLabel className='save'>You save 33%</SaveLabel></ToggleSubLabel>
          </ToggleSection>
        </Toggle>
    );
  }
  renderBottomSection() {
    const { organization, users, billingStatus, getLoading } = this.props;
    const hasStripe = organization.get('stripe_subscription_id');
    const className = `payment__bottom-section ${hasStripe ? 'payment__bottom-section--success' : ''}`;

    return (
      <PaymentSection >
        <TopSection success={hasStripe ? true : ''}>
          <CardSection label="Credit or debit card" />
          <SubmitButton
            {...getLoading('submit')}
            title="Submit Payment"
            onClick={this.onSubmit}
          />
          <SubmitButtonSubtitle>You will be billed ${this.getPrice()}.</SubmitButtonSubtitle>
        </TopSection>
        <BottomSection success={hasStripe ? true : ''}>
          <BottomSectionTitle>Thank you for your purchase.</BottomSectionTitle>
          <PaymentStatus>
            <PaymentStatusLabel>Your subscription status is:</PaymentStatusLabel>
            <Status active={!hasStripe ? false : true }>Active</Status>
          </PaymentStatus>
          <ChangeDetails
            title="Change card details"
            onClick={this.onCardDetails}
          />
        </BottomSection>
      </PaymentSection>
    );
  }
  render() {
    const { organization, users } = this.props;
    const numberOfUsers = users.filter(u => u.get('active')).size;
    return (
      <SWView
        header={this.renderHeader()}
      >
        <Wrapper>
          <PaymentToggle>
            {this.renderToggle()}
            <ToggleSubtitle>
              You have {numberOfUsers} users in {organization.get('name')}. {`That's ${this.getShowPrice()}`}

            </ToggleSubtitle>
            <ManageButton
              title="Manage team"
              onClick={this.onManage}
            />
          </PaymentToggle>
          {this.renderBottomSection()}
        </Wrapper>
      </SWView>
    );
  }
}

export default injectStripe(Billing);
