import { styleSheet } from 'swiss-react';

export default styleSheet('WeekIndicator', {
  Wrapper: {},
  MonthLabel: {
    _textStyle: 'caption',
    marginBottom: '9px',
    color: '$sw2',
    textTransform: 'uppercase'
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
    border: '1px solid $green2',
    color: '$dark',
    '&:not(:last-child)': {
      marginRight: '3px'
    },
    past: {
      border: '1px solid $sw4'
    },
    current: {
      border: '1px solid $green1'
    }
  }
});
