import { styleSheet } from 'swiss-react';

export default styleSheet('BillingHeader', {
  StatusWrapper: {
    _flex: ['row', 'left', 'center']
  },

  StatusLabel: {
    _font: ['12px', '21px', '500'],
    color: '$sw2',
    _size: ['160px', 'auto']
  },

  Status: {
    _font: ['12px', '21px', '500'],
    color: '$blue',
    borderRadius: '2px',
    marginLeft: '6px',
    height: '21px',
    padding: '0 6px',

    '!active': {
      backgroundColor: '$sw3',
      color: '$sw2'
    },

    active: {
      color: 'white',
      backgroundColor: '$blue'
    }
  }
});
