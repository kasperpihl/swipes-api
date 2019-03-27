import { styleSheet } from 'swiss-react';

export default styleSheet('InputRadio', {
  Wrapper: {
    _flex: ['row', 'left', 'center']
  },

  Input: {
    _el: 'input',

    hideRadio: {
      opacity: '0',
      _size: '0'
    }
  },

  Label: {
    _el: 'label',
    _textStyle: 'body',
    marginLeft: '6px',

    hideRadio: {
      margin: '0',
      padding: '6px 9px',
      borderRadius: '2px',

      checked: {
        background: '$green4'
      }
    }
  }
});
