import { styleSheet } from 'swiss-react';

export default styleSheet('Button', {
  Wrapper: {
    _el: 'a',
    _size: ['auto', '24px'],
    _flex: ['row', 'center', 'center'],
    _textStyle: 'body',
    display: 'inline-flex',
    flex: 'none',
    userSelect: 'none',
    borderRadius: '2px',
    '&:hover': {
      backgroundColor: '$sw4'
    },
    selected: {
      backgroundColor: '$dark',
      '&:hover': {
        backgroundColor: '$sw1'
      }
    }
  },

  Title: {
    _el: 'p',
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
    }
  }
});
