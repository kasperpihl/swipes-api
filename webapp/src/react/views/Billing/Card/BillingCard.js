import React from 'react';
import SW from './BillingCard.swiss';

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

export default class BillingCard extends React.Component {
  state = {
    errorMessage: ''
  };

  handleChange = cardState => {
    this.setState({ cardState });
  };
  render() {
    const { label } = this.props;
    const { cardState } = this.state;

    const errorMessage =
      cardState && cardState.error && cardState.error.message;

    return (
      <SW.Billing>
        <div>
          <SW.FormRowLabel htmlFor="card-element">{label}</SW.FormRowLabel>
          <SW.ElementWrapper>
            <SW.StripeElement
              hidePostalCode
              style={style}
              onChange={this.handleChange}
            />
          </SW.ElementWrapper>
          <SW.CardError role="alert">{errorMessage}</SW.CardError>
        </div>
      </SW.Billing>
    );
  }
}
