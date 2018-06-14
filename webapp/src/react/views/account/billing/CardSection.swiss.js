import { styleSheet } from 'swiss-react';

export default styleSheet('CardSection', {
  Billing: {
    _size: ['420px', '90px'],
    paddingBottom: '30px',
  },

  FormRowLabel: {
    _font: ['18px', '24px'],
    marginBottom: '9px',
  },

  ElementWrapper: {
    _size: ['100%', 'auto'],
    paddingTop: '9px',
  },

  StripeElement: {
    _size: ['100%', 'auto'],
    backgroundColor: 'white',
    padding: '8px 12px',
    borderRadius: '3px',
    border: '1px solid $sw3',
    display: 'block',

    '&:focus': {
      border: '1px solid $blue',
    },

    invalid: {
      borderColor: '#fa755a',
    },
  },

  CardError: {
    _font: ['12px', '18px'],
    color: '$red',
    padding: '6px 0'
  },
})
