import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('BillingPaymentSubmit', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'left', 'top']
  },
  Terms: {
    _el: 'p',
    _textStyle: 'caption',
    width: '420px',
    color: '$sw2',
    lineHeight: '24px',
    textAlign: 'left'
  },
  Link: {
    _el: 'a',

    '&:visited': {
      color: '$blue'
    },

    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },

  Button: {
    _el: Button,
    _size: ['144px', '42px !important']
  }
});
