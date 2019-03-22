import { styleSheet } from 'swiss-react';

export default styleSheet('OrganizationCreate', {
  Wrapper: {
    _size: ['calc(100% - 18px * 2)', 'auto'],
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
