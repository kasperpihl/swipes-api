import { styleSheet } from 'swiss-react';
import { CardElement } from 'react-stripe-elements';

export default styleSheet('BillingPaymentModal', {
  Wrapper: {
    width: '479px'
  },
  ComposerWrapper: {
    _flex: ['row', 'left', 'top'],
    padding: '0 24px 0px 30px',
    textAlign: 'left',
    whiteSpace: 'pre-line'
  },
  ActionBar: {
    _flex: ['row', 'right', 'top'],
    padding: '12px 30px',
    borderTop: '1px solid $sw3',

    top: {
      _flex: ['row', 'left', 'top'],
      borderTop: 'none',
      borderBottom: '1px solid $sw3'
    }
  },

  Title: {
    _textStyle: 'H2',
    fontWeight: '$bold'
  },

  ElementWrapper: {
    _el: 'label',
    _size: ['420px', 'auto']
  },

  StripeElement: {
    _el: CardElement,
    _size: ['420px', 'auto'],
    backgroundColor: 'white',
    padding: '8px 12px',
    borderRadius: '3px',
    border: '1px solid $sw3',
    display: 'block',

    '&:focus': {
      border: '1px solid $blue'
    },

    invalid: {
      borderColor: '#fa755a'
    }
  }
});
