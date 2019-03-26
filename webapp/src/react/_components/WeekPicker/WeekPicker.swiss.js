import { styleSheet } from 'swiss-react';

export default styleSheet('WeekPicker', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    width: '162px',
    borderBottom: '1px solid $sw4',
    overflowX: 'hidden',
    userSelect: 'none'
  },

  WeekLabel: {
    _textStyle: 'body',
    width: '162px',
    textAlign: 'center'
  }
});
