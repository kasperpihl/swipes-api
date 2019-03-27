import { styleSheet } from 'swiss-react';

export default styleSheet('WeekIndicator', {
  Wrapper: {},
  MonthLabel: {
    _textStyle: 'caption',
    marginBottom: '9px',
    color: '$sw2',
    textTransform: 'uppercase',
    userSelect: 'none'
  },
  Week: {
    height: '30px',
    _flex: ['row', 'left', 'center']
  },

  Day: {
    _size: '30px',
    _flex: ['row', 'center', 'center'],
    _textStyle: 'caption',
    borderRadius: '2px',
    border: '1px solid $sw3',
    color: '$dark',
    userSelect: 'none',
    '&:not(:last-child)': {
      marginRight: '3px'
    },
    past: {
      border: '1px solid $sw4'
    },
    current: {
      border: '1px solid $dark'
    }
  }
});
