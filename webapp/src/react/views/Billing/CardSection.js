import React from 'react';
import SW from './CardSection.swiss';

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

class CardSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ''
    };
  }

  onChange = cardState => {
    this.setState({ cardState });
  };
  render() {
    const { label } = this.props;
    let { errorMessage, cardState } = this.state;

    errorMessage =
      errorMessage || (cardState && cardState.error && cardState.error.message);

    return (
      <SW.Billing>
        <div>
          <SW.FormRowLabel htmlFor="card-element">{label}</SW.FormRowLabel>
          <SW.ElementWrapper>
            <SW.StripeElement
              hidePostalCode
              style={style}
              onChange={this.onChange}
            />
          </SW.ElementWrapper>
          <SW.CardError role="alert">{errorMessage}</SW.CardError>
        </div>
      </SW.Billing>
    );
  }
}

export default CardSection;
