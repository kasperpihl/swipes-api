import { styleSheet } from 'swiss-react';

export default styleSheet('ButtonStandard', {
  Wrapper: {
    _el: 'a',
    _size: ['auto', '36px'],
    _flex: ['row', 'center', 'center'],
    _textStyle: 'body',
    display: 'inline-flex',
    userSelect: 'none',
    padding: '0 6px'
  },

  Title: {
    _el: 'p',
    'status=Standard': {
      '.ButtonStandard_Wrapper:hover &': {
        color: '$blue'
      }
    },
    'status=Success': {
      color: '$green'
    },

    'status=Error': {
      color: '$red'
    },

    hasIcon: {
      marginLeft: '6px'
    }
  }
});
