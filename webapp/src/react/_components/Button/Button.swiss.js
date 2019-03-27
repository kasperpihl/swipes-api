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
    boxSizing: 'border-box',
    cursor: 'pointer',
    '& > *': {
      pointerEvents: 'none'
    },
    small: {
      minWidth: '24px',
      height: '24px'
    },
    withTitle: {
      padding: '0 6px'
    },
    border: {
      border: '1px solid $sw3'
    },
    right: {
      marginLeft: 'auto'
    },
    selected: {
      backgroundColor: '$green1',
    },
    disabled: {
      pointerEvents: 'none',
      opacity: 0.5
    },
    green: {
      border: 'none',
      backgroundColor: '$green1'
    },
    '&:hover': {
      borderColor: '$green3',
      backgroundColor: '$green3',

      '& > p': {
        color: '$dark'
      }
    }
  },

  Title: {
    _el: 'p',
    _textStyle: 'body',
    padding: '0 6px',
    color: '$dark',
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
    },
    selected: {
      color: '$base',
    }
  }
});
