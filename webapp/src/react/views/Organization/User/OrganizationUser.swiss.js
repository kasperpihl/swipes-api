import { styleSheet } from 'swiss-react';

export default styleSheet('OrganizationUser', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'bodyMedium'
  },

  Name: {
    _el: 'p',
    marginLeft: '12px'
  },

  Email: {
    _el: 'p',
    _textStyle: 'body',
    margin: '0 auto',
    color: '$sw2'
  },

  UserType: {
    _el: 'p',
    _textStyle: 'body',
    marginLeft: 'auto',
    color: '$sw2'
  }
});
