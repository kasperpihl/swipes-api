import { styleSheet } from 'swiss-react';

export default styleSheet('ButtonRounded', {
  Wrapper: {
    _el: 'a',
    _size: ['auto', '36px'],
    _flex: ['row', 'center', 'center'],
    _textStyle: 'body',
    display: 'inline-flex',
    userSelect: 'none'
  },

  Title: {
    _el: 'p',

    success: {
      color: '$green'
    },

    error: {
      color: '$red'
    }
  }
});
