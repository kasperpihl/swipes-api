import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';

export default styleSheet('BillingPaymentActive', {
  Wrapper: {
    _size: ['420px', 'auto'],
    _flex: ['column', 'center', 'center']
  },
  Title: {
    _font: ['27px', '36px'],
    color: 'black',
    textAlign: 'center',
    paddingBottom: '12px'
  },
  StatusWrapper: {
    _flex: ['row', 'left', 'center']
  },

  StatusLabel: {
    _font: ['12px', '21px', '500'],
    color: '$sw2',
    _size: ['160px', 'auto']
  },
  ChangeDetailsButton: {
    _el: Button,
    marginTop: '20px'
  },

  Status: {
    _font: ['12px', '21px', '500'],
    color: '$blue20',
    borderRadius: '2px',
    marginLeft: '6px',
    height: '21px',
    padding: '0 6px',

    color: 'white',
    backgroundColor: '$blue'
  }
});
