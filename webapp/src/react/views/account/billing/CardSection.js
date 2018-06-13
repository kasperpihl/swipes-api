import React from 'react';
import { CardElement } from 'react-stripe-elements';
import { styleElement } from 'swiss-react';
import { bindAll } from 'swipes-core-js/classes/utils';
import styles from './CardSection.swiss';
import styleSheet from 'swiss-react/dist/cjs/helpers/styleSheet';

const Billing = styleElement('div', styles.Billing);
const FormRowLabel = styleElement('div', styles.FormRowLabel);
const ElementWrapper = styleElement('label', styles.ElementWrapper);
const CardError = styleElement('div', styles.CardError);
const StripeElement = styleElement(CardElement, styles.StripeElement);

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

class CardSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
    bindAll(this, ['onChange']);
  }

  onChange(cardState) {
    this.setState({ cardState });
  }
  render() {
    const { label } = this.props;
    let { errorMessage, cardState } = this.state;

    errorMessage = errorMessage || (cardState && cardState.error && cardState.error.message);

    return (
      <Billing>
        <div>
          <FormRowLabel htmlFor="card-element">
            {label}
          </FormRowLabel>
          <ElementWrapper>
            <StripeElement hidePostalCode style={style} onChange={this.onChange} />
          </ElementWrapper>
          <CardError role="alert">{errorMessage}</CardError>
        </div>
      </Billing>
    );
  }
}

export default CardSection;
