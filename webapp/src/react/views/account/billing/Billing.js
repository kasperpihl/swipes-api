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
  renderSuccessState() {

    return (
      <div className="payment__success">
        hi
      </div>
    )
  }
  renderContent() {
    const { successState } = this.props;
    const { cardState } = this.state;
    const isReady = cardState && cardState.complete;

    if (successState) {
      return (this.renderSuccessState());
    }

    return (
      <div className="payment">
        <div className="payment__toggle">
          {this.renderToggle()}
          <div className="payment__toggle-subtitle">You currently have 5 active users in Swipes Inc.</div>
        </div>
        {this.renderBilling()}
        <button disabled={!isReady} onClick={this.onSubmit} className="payment__cta">Submit Payment</button>
        <div className="payment__cta-subtitle">You will be billed $45</div>
      </div>
    )
  }
  render() {

    return (
      <SWView header={this.renderHeader()}>
        {this.renderContent()}
      </SWView>
    )
  }
}

export default injectStripe(Billing);

// const {string} = PropTypes;

Billing.propTypes = {};
