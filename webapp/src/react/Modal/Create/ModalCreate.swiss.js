import { styleSheet } from 'swiss-react';

export default styleSheet('ModalCreate', {
  CheckboxWrapper: {
    _flex: ['row', 'left', 'center'],
    padding: '6px 9px',
    checked: {
      backgroundColor: '$green4'
    }
  },

  Input: {
    _el: 'input',
    _size: '0',
    opacity: '0'
  },

  CheckboxValue: {
    _textStyle: 'body',
    userSelect: 'none'
  }
});
