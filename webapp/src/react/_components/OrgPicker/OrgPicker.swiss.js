import { styleSheet } from 'swiss-react';

export default styleSheet('OrgPicker', {
  Wrapper: {
    _flex: ['column', 'left', 'top']
  },
  InputWrapper: {
    _flex: ['row', 'left', 'center'],
    padding: '3px 0'
  },
  Label: {
    _el: 'span',
    _textStyle: 'body',
    marginLeft: '6px'
  }
});
