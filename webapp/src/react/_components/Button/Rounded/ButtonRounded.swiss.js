import { styleSheet } from 'swiss-react';

export default styleSheet('ButtonRounded', {
  Wrapper: {
    _el: 'a',
    _size: ['auto', '36px'],
    _flex: ['row', 'center', 'center'],
    _textStyle: 'body',
    flex: 'none',
    userSelect: 'none',
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
  },

  Title: {
    _el: 'p',
    padding: '0 12px',

    'status=Standard': {
      '.ButtonRounded_Wrapper:hover &': {
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
