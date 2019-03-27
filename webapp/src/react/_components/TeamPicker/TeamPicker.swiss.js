import { styleSheet } from 'swiss-react';

export default styleSheet('TeamPicker', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    flexWrap: 'wrap'
  },
  InputWrapper: {
    _flex: ['row', 'left', 'center'],
    marginRight: '12px'
  },
  Label: {
    _el: 'span',
    _textStyle: 'body',
    marginLeft: '6px'
  }
});
