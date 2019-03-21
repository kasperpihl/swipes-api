import { styleSheet } from 'swiss-react';

export default styleSheet('OrganizationCreate', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'left', 'top'],
    padding: '0 18px'
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
    right: '9px'
  },

  ActionsWrapper: {
    _flex: ['row', 'left', 'center'],
    marginLeft: 'auto',

    '& > a:first-child': {
      marginRight: '12px'
    }
  }
});
