import { styleSheet } from 'swiss-react';

export default styleSheet('WeekPicker', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    width: '162px',
    borderBottom: '1px solid $sw4'
  },
  WeekLabel: {
    _textStyle: 'body',
    width: '100%',
    textAlign: 'center'
  }
});
