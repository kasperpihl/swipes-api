import React, { PureComponent } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Button from 'Button';
// import Icon from 'Icon';
import './styles/billing.scss';

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
    setupDelegate(this, 'onSwitchPlan', 'onSubmitSuccess', 'onManage');
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
    const { cardState } = this.state;
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
    const className = !hasStripe ? 'payment-status__status payment-status__status--inactive' : 'payment-status__status payment-status__status--active';

    return (
      <HOCHeaderTitle title="Payment">
        <div className="payment-status">
          <div className="payment-status__label">Your subscription status is:</div>
          <div className={className}>{status}</div>
        </div>
      </HOCHeaderTitle>
    );
  }
  renderToggle() {
    const { billingStatus } = this.props;
    let className = 'toggle';

    if (billingStatus === 'monthly') {
      className += ' toggle--first';
    } else {
      className += ' toggle--second';
    }

    return (
      <div className={className}>
        <div className="toggle__section" onClick={this.onSwitchPlanCached('monthly')}>
          <div className="toggle__price">$9</div>
          <div className="toggle__label">per user a month</div>
          <div className="toggle__sublabel">billed monthly</div>
        </div>
        <div className="toggle__section" onClick={this.onSwitchPlanCached('yearly')}>
          <div className="toggle__price">$6</div>
          <div className="toggle__label">per user a month</div>
          <div className="toggle__sublabel">billed anually <span>You save 33%</span></div>
        </div>
      </div>
    );
  }
  renderBilling() {
    const { cardState } = this.state;
    let { errorMessage } = this.state;

    errorMessage = errorMessage || (cardState && cardState.error && cardState.error.message);

    return (
      <div className="billing">
        <div className="form-row">
          <label htmlFor="card-element">
            Credit or debit card
          </label>
          <div id="card-element">
            <CardElement hidePostalCode style={style} onChange={this.onChange} />
          </div>
          <div id="card-errors" role="alert">{errorMessage}</div>
        </div>
      </div>
    );
  }
  renderBottomSection() {
    const { cardState } = this.state;
    const { organization, users, billingStatus, getLoading } = this.props;
    const isReady = cardState && cardState.complete;
    const hasStripe = organization.get('stripe_subscription_id');
    const className = `payment__bottom-section ${hasStripe ? 'payment__bottom-section--success' : ''}`;

    return (
      <div className={className}>
        <div className="top-section">
          {this.renderBilling()}
          <Button
            {...getLoading('submit')}
            primary
            disabled={!isReady}
            text="Submit Payment"
            onClick={this.onSubmit}
          />
          <div className="payment__cta-subtitle">You will be billed ${this.getPrice()}.</div>
        </div>
        <div className="bottom-section">
          <div className="bottom-section__title">Thank you for your purchase.</div>
          <div className="payment-status">
            <div className="payment-status__label">Your subscription status is:</div>
            <div className="payment-status__status payment-status__status--active">Active</div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { organization, users } = this.props;
    const numberOfUsers = users.filter(u => u.get('active')).size;
    return (
      <SWView
        header={this.renderHeader()}
      >
        <div className="payment">
          <div className="payment__toggle">
            {this.renderToggle()}
            <div className="payment__toggle-subtitle">
              You have {numberOfUsers} users in {organization.get('name')}. {`That's ${this.getShowPrice()}`}

            </div>
            <Button
              text="Manage team"
              primary
              onClick={this.onManage}
            />
          </div>
          {this.renderBottomSection()}
        </div>
      </SWView>
    );
  }
}

export default injectStripe(Billing);

// const {string} = PropTypes;

Billing.propTypes = {};
