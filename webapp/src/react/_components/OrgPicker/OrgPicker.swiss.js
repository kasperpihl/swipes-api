import { styleSheet } from 'swiss-react';

export default styleSheet('OrgPicker', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    flexWrap: 'wrap'
  },
  InputWrapper: {
    _flex: ['row', 'left', 'center'],
    padding: '6px',
    '&:first-child': {
      paddingLeft: 0
    }
  },
  Label: {
    _el: 'span',
    _textStyle: 'body',
    marginLeft: '6px'
  }
});
