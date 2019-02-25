import { styleSheet } from 'swiss-react';

export default styleSheet('ButtonStandard', {
  Wrapper: {
    _el: 'a',
    _size: ['auto', '24px'],
    _flex: ['row', 'center', 'center'],
    _textStyle: 'body',
    display: 'inline-flex',
    flex: 'none',
    userSelect: 'none',

    '&:hover': {
      backgroundColor: '$sw4'
    }
  },

  Title: {
    _el: 'p',
    padding: '0 6px',
    'status=Success': {
      color: '$green1'
    },

    'status=Error': {
      color: '$red'
    }
  }
});
