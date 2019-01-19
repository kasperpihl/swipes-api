import { styleSheet } from 'swiss-react';

export default styleSheet('BillingPlan', {
  Wrapper: {
    _size: ['420px', '213px'],
    _flex: ['row'],
    color: '$blue',
    border: '1px solid $blue',
    borderRadius: '3px',
    overflow: 'hidden'
  },

  Toggle: {
    _size: ['100%'],
    cursor: 'pointer',
    backgroundColor: '$blue',
    color: 'white',
    '& > *': {
      pointerEvents: 'none',
      userSelect: 'none'
    },

    '!selected': {
      backgroundColor: 'transparent',
      transition: '.2s ease',
      color: 'black',
      '&:hover': {
        backgroundColor: '$sw3',
        transition: '.2s ease'
      }
    }
  },

  Price: {
    _font: ['42px', '54px'],
    paddingTop: '24px',
    paddingLeft: '21px'
  },

  PriceLabel: {
    _font: ['18px', '24px', '400'],
    paddingLeft: '21px',
    paddingTop: '9px'
  },

  Subtitle: {
    _font: ['12px', '15px', '500'],
    paddingTop: '57px',
    paddingLeft: '21px'
  },

  SaveLabel: {
    _el: 'span',
    backgroundColor: '$yellow !important',
    color: 'black'
  }
});
