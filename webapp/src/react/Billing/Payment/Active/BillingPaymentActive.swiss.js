import { styleSheet } from 'swiss-react';

export default styleSheet('BillingPaymentActive', {
  Wrapper: {
    _size: ['420px', 'auto'],
    _flex: ['column', 'left', 'top'],

    loading: {
      _size: '100%',
      _flex: ['column', 'center', 'center']
    }
  },
  Title: {
    _textStyle: 'H1'
  },
  StatusWrapper: {
    _flex: ['row', 'left', 'center']
  },

  StatusLabel: {
    _textStyle: 'caption',
    color: '$sw2'
  },

  Status: {
    _size: ['54px', '24px'],
    _textStyle: 'caption',
    _flex: ['column', 'center', 'center'],
    backgroundColor: '$green1',
    textTransform: 'uppercase',
    color: '$base',
    borderRadius: '2px',
    margin: '0 auto auto 12px',
    pointerEvents: 'none',
    userSelect: 'none'
  },

  NextPaymentDate: {
    _textStyle: 'caption',
    color: '$sw2'
  }
});
