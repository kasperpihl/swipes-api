import { styleSheet } from 'swiss-react';

export default styleSheet('InputText', {
  Input: {
    _el: 'input',
    _size: ['100%', '36px'],
    _textStyle: 'body',
    color: '$sw1',
    transition: '.2s ease',
    borderBottom: '1px solid $sw3',
    '&:focus': {
      borderBottom: '1px solid $blue',
      transition: '.2s ease'
    },

    error: {
      borderBottom: '1px solid $red'
    }
  }
});
