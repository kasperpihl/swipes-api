import { styleSheet } from 'swiss-react';

export default styleSheet('OrganizationCreate', {
  Wrapper: {
    _size: ['480px', 'auto'],
    _flex: ['column', 'left', 'top'],
    margin: '0 auto'
  },

  InputWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center']
  },

  Text: {
    _el: 'p',
    _textStyle: 'H2'
  },

  ErrorLabel: {
    _el: 'label',
    _textStyle: 'body',
    color: '$red',
    position: 'absolute',
    right: '0'
  }
});
