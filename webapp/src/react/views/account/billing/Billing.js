import React, { PureComponent } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
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
      errorMessage: ''
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

    stripe.createToken().then(({token, error}) => {
      if(error) {
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
  render() {
    const { cardState } = this.state;
    let { errorMessage } = this.state;

    errorMessage = errorMessage || (cardState && cardState.error && cardState.error.message);
    const isReady = cardState && cardState.complete;
    return (
      <div className="billing">
        <div className="form-row">
          <label htmlFor="card-element">
            Credit or debit card
          </label>
          <div id="card-element">
            <CardElement hidePostalCode style={style} onChange={this.onChange}/>
          </div>
          <div id="card-errors" role="alert">{errorMessage}</div>
        </div>
        <button disabled={!isReady} onClick={this.onSubmit}>Submit Payment</button>

      </div>
    )
  }
}

export default injectStripe(Billing);

// const { string } = PropTypes;

Billing.propTypes = {};
