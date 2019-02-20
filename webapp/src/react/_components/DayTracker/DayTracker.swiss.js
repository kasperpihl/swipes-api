import { styleSheet } from 'swiss-react';

export default styleSheet('DayTrack', {
  Wrapper: {},

  Week: {
    width: '100%',
    _flex: ['row', 'left', 'center'],
    flexWrap: 'wrap',
    '&:not(:last-child)': {
      marginBottom: '6px',
      compact: {
        marginBottom: '3px'
      }
    }
  },

  DayWrapper: {
    _size: ['24px', '24px'],
    _flex: ['row', 'center', 'center'],
    flex: 'none',

    compact: {
      _size: ['12px', '12px']
    },
    '&:not(:last-child)': {
      marginRight: '3px'
    }
  },

  Day: {
    _size: '8px',
    borderRadius: '50%',
    _flex: ['row', 'center', 'center'],
    _textStyle: 'small',
    color: '$sw2',
    compact: {
      _size: '6px'
    },

    'state=upcoming': {
      backgroundColor: '$green2',
      _size: '24px',
      compact: {
        _size: '12px'
      }
    },

    'state=hidden': {
      backgroundColor: '$sw3'
    },

    'state=completed': {
      backgroundColor: '$green1'
    },

    'state=overdue': {
      backgroundColor: '$red'
    }
  }
});
