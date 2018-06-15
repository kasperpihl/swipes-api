import React from 'react';
import { CardElement } from 'react-stripe-elements';

import { bindAll } from 'swipes-core-js/classes/utils';

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
      <div className="billing">
        <div className="form-row">
          <label htmlFor="card-element">
            {label}
          </label>
          <div id="card-element">
            <CardElement hidePostalCode style={style} onChange={this.onChange} />
          </div>
          <div id="card-errors" role="alert">{errorMessage}</div>
        </div>
      </div>
    );
  }
}

export default CardSection;