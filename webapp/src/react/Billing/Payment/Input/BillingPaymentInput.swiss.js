import { styleSheet } from 'swiss-react';
import { CardElement } from 'react-stripe-elements';

export default styleSheet('BillingPaymentInput', {
  Billing: {
    _size: ['100%', 'auto']
  },

  FormRowLabel: {
    _textStyle: 'caption',
    textTransform: 'uppercase'
  },

  PriceWrapper: {
    _flex: ['row', 'left', 'baseline']
  },

  Amount: {
    _textStyle: 'title',
    color: '$dark'
  },

  DueDate: {
    _textStyle: 'H2',
    marginLeft: '6px'
  },

  Subtitle: {
    _textStyle: 'caption',
    textTransform: 'uppercase',
    color: '$sw2'
  },

  ElementWrapper: {
    _el: 'label',
    _size: ['420px', 'auto'],
    paddingTop: '9px'
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
  },

  CardError: {
    _font: ['12px', '18px'],
    color: '$red',
    padding: '6px 0'
  }
});
