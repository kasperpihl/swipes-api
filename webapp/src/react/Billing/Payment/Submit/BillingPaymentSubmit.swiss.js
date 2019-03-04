import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('BillingPaymentSubmit', {
  Wrapper: {
    _size: ['420px', 'auto'],
    _flex: ['column', 'center']
  },
  SubmitButton: {
    _el: Button,
    marginTop: '20px'
  },
  Subtitle: {
    _font: ['12px', '15px', '$medium'],
    color: '$sw2',
    marginTop: '9px'
  },
  Terms: {
    _el: 'p',
    _font: ['12px', '18px'],
    color: '$sw2',
    textAlign: 'left',
    marginTop: '20px'
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
  }
});
