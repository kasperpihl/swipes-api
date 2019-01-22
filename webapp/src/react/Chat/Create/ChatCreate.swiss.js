import { styleSheet } from 'swiss-react';

export default styleSheet('ChatCreate', {
  CheckboxWrapper: {
    _flex: ['row', 'left', 'center'],
    paddingTop: '6px',
    paddingBottom: '6px'
  },
  CheckboxValue: {
    _textStyle: 'body',
    marginLeft: '6px',
    userSelect: 'none'
  }
});
