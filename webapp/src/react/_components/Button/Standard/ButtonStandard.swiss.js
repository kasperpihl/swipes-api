import { styleSheet } from 'swiss-react';

export default styleSheet('ButtonStandard', {
  Wrapper: {
    _el: 'a',
    _size: ['auto', '24px'],
    _flex: ['row', 'center', 'center'],
    display: 'inline-flex',
    _textStyle: 'body',
    flex: 'none',
    userSelect: 'none',
  },

  Title: {
    _el: 'p',
    padding: '0 12px',

    'status=Standard': {
      '.ButtonStandard_Wrapper:hover &': {
        color: '$blue'
      }
    },
    'status=Success': {
      color: '$green1'
    },

    'status=Error': {
      color: '$red'
    },

    hasIcon: {
      paddingLeft: '0'
    }
  }
});
