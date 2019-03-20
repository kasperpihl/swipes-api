import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningSide', {
  Wrapper: {},
  Week: {
    _textStyle: 'body',
    _flex: ['row', 'left', 'center'],
    _size: ['100%'],
    padding: '6px',
    paddingLeft: '12px',
    selected: {
      background: '$green2'
    }
  },
  WeekNumber: {
    _size: '30px',
    _textStyle: 'caption',
    _flex: ['row', 'center', 'center'],
    color: '$dark',
    // border: '2px solid $sw3',
    background: '$sw3',
    marginRight: '6px'
  }
});
