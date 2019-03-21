import { styleSheet } from 'swiss-react';

export default styleSheet('InputText', {
  Input: {
    _el: 'input',
    _size: ['100%', '36px'],
    _textStyle: 'body',
    color: '$sw1',
    transition: '.2s ease',
    padding: '9px',
    border: '1px solid $sw3',
    '&:focus': {
      border: '1px solid $blue',
      transition: '.2s ease'
    },

    error: {
      border: '1px solid $red'
    }
  }
});
