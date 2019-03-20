import { styleSheet } from 'swiss-react';

export default styleSheet('InputRadio', {
  Wrapper: {
    _flex: ['row', 'left', 'center']
  },

  Input: {
    _el: 'input'
  },

  Label: {
    _el: 'label',
    _textStyle: 'body',
    marginLeft: '6px'
  }
});
