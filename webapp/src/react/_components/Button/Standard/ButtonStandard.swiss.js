import { styleSheet } from 'swiss-react';

export default styleSheet('ButtonStandard', {
  Wrapper: {
    _el: 'a',
    _size: ['auto', '36px'],
    _flex: ['row', 'center', 'center'],
    display: 'inline-flex',
    _textStyle: 'body',
    flex: 'none',
    userSelect: 'none',

    rounded: {
      border: '1px solid $sw3',
      borderRadius: '18px',
      'status=Standard': {
        '&:hover': {
          borderColor: '$blue'
        }
      },

      'status=Success': {
        borderColor: '$green'
      },
      'status=Error': {
        borderColor: '$red'
      }
    }
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
      color: '$green'
    },

    'status=Error': {
      color: '$red'
    },

    hasIcon: {
      paddingLeft: '0'
    }
  }
});