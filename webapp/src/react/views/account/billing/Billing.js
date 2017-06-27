import React, { PureComponent } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
// import Button from 'Button';
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
    super(props)
    this.state = {
      errorMessage: '',
      billingStatus: 'monthly',
      successState: true,
    };
    setupDelegate(this);
    bindAll(this, ['onChange', 'onSubmit']);
  }
  componentDidMount() {
  }
  onSubmit(e) {
    e.preventDefault();
    const { cardState } = this.state;
    const { stripe } = this.props;

    stripe.createToken().then(({ token, error }) => {
      if (error) {
        this.setState({ errorMessage: error.message });
      } else {
        console.log('Received Stripe token:', token);
        this.callDelegate('onSubmit', token);
      }

    });
  }
  onChange(cardState) {
    this.setState({ cardState });
  }
  renderHeader() {
    const status = true ? 'Inactive' : 'Active';
    const className = true ? 'payment-status__status payment-status__status--inactive' : 'payment-status__status payment-status__status--active';

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
    const { billingStatus } = this.state;
    let className = 'toggle';

    if (billingStatus === 'monthly') {
      className += ' toggle--first'
    } else {
      className += ' toggle--second'
    }

    return (
      <div className={className}>
        <div className="toggle__section">
          <div className="toggle__price">$9</div>
          <div className="toggle__label">per user a month</div>
          <div className="toggle__sublabel">billed monthly</div>
        </div>
        <div className="toggle__section">
          <div className="toggle__price">$6</div>
          <div className="toggle__label">per user a month</div>
          <div className="toggle__sublabel">billed anually <span>You save 33%</span></div>
        </div>
      </div>
    )
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
    )
  }
  renderBottomSection() {
    const { cardState } = this.state;
    const isReady = cardState && cardState.complete;
    const { billingStatus } = this.props;
    const className = billingStatus ? 'payment__bottom-section' : 'payment__bottom-section payment__bottom-section--success';

    return (
      <div className={className}>
        <div className="top-section">
          {this.renderBilling()}
          <button disabled={!isReady} onClick={this.onSubmit} className="payment__cta">Submit Payment</button>
          <div className="payment__cta-subtitle">You will be billed $45</div>
        </div>
        <div className="bottom-section">
          <div className="bottom-section__title">Thank you for your purchase, Nigel</div>
          <div className="payment-status">
            <div className="payment-status__label">Your subscription status is:</div>
            <div className="payment-status__status payment-status__status--active">Active</div>
          </div>
        </div>
      </div>
    )
  }
  render() {

    return (
      <SWView
        header={this.renderHeader()}
      >
        <div className="payment">
          <div className="payment__toggle">
            {this.renderToggle()}
            <div className="payment__toggle-subtitle">You currently have 5 active users in Swipes Inc.</div>
          </div>
          {this.renderBottomSection()}
        </div>
      </SWView>
    )
  }
}

export default injectStripe(Billing);

// const {string} = PropTypes;

Billing.propTypes = {};
