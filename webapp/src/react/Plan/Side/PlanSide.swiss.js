import { styleSheet } from 'swiss-react';

export default styleSheet('PlanSide', {
  Wrapper: {
    _size: ['200px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    flex: 'none'
  },

  TasksTracker: {
    _flex: ['row', 'flex-start', 'flex-start'],
    marginBottom: '12px'
  },

  BigNumber: {
    _font: ['43px', '36px', '400']
  },

  Text: {
    _textStyle: 'body',
    color: '$sw2'
  }
});
