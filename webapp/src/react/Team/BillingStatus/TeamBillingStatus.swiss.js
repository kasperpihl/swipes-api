import { styleSheet } from 'swiss-react';

export default styleSheet('TeamBillingStatus', {
  Wrapper: {
    _flex: ['column', 'left', 'top'],
    width: 'calc(100%)',
    margin: '0 18px 0 36px'
  },

  Text: {
    _textStyle: 'caption',
    color: '$dark'
  },

  Row: {
    _flex: ['row', 'left', 'center'],
    width: '100%'
  },

  StatusWrapper: {
    _flex: ['column', 'left', 'top']
  },

  SubscriptionType: {
    _textStyle: 'body'
  },

  DaysLeft: {
    _textStyle: 'body',
    color: '$sw2'
  },

  ButtonWrapper: {
    marginLeft: 'auto'
  }
});
