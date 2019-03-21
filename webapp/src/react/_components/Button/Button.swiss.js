import { styleSheet } from 'swiss-react';

export default styleSheet('Button', {
  Wrapper: {
    _el: 'a',
    _flex: ['row', 'center', 'center'],
    _textStyle: 'body',
    display: 'inline-flex',
    flex: 'none',
    userSelect: 'none',
    borderRadius: '2px',
    height: '30px',
    minWidth: '30px',
    small: {
      minWidth: '24px',
      height: '24px'
    },
    '&:hover': {
      backgroundColor: '$sw4'
    },
    selected: {
      backgroundColor: '$dark',
      '&:hover': {
        backgroundColor: '$sw1'
      }
    },
    withTitle: {
      padding: '0 6px'
    },
    border: {
      border: '1px solid $sw3'
    },
    green: {
      border: 'none',
      backgroundColor: '$green1',

      '&:hover': {
        backgroundColor: '$green2'
      }
    }
  },

  Title: {
    _el: 'p',
    _textStyle: 'body',
    padding: '0 6px',
    color: '$dark',
    selected: {
      color: '$base'
    },
    'status=Success': {
      color: '$green1'
    },
    'status=Error': {
      color: '$red'
    },
    green: {
      color: '$base',

      '.Button_Wrapper:hover &': {
        color: '$dark'
      }
    }
  }
});
