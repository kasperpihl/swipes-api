import { styleSheet } from 'swiss-react';

export default styleSheet('DayTrack', {
  Wrapper: {
    _size: ['140px', 'auto'],
    _flex: ['column', 'left', 'top'],

    compact: {
      _size: ['80px', 'auto']
    }
  },

  Week: {
    width: '100%',
    _flex: ['row', 'left', 'center'],
    flexWrap: 'wrap',
    margin: '3px 0'
  },

  DayWrapper: {
    _size: ['28px', '24px'],
    _flex: ['row', 'center', 'center'],
    flex: 'none',

    compact: {
      _size: ['16px', '12px']
    }
  },

  Day: {
    _size: '24px',
    _flex: ['row', 'center', 'center'],
    _textStyle: 'small',
    borderRadius: '12px',
    margin: '0 2px',

    'state=hidden': {
      _size: '12px',
      backgroundColor: '$sw3'
    },

    'state=upcoming': {
      backgroundColor: '$green',
      opacity: '.5'
    },

    'state=completed': {
      _size: '12px',
      backgroundColor: '$green'
    },

    'state=overdue': {
      _size: '12px',
      backgroundColor: '$red',
      opacity: '1'
    },

    compact: {
      _size: '12px',
      borderRadius: '6px',

      'state=completed': {
        _size: '6px'
      },

      'state=upcoming': {
        backgroundColor: '$green',
        opacity: '.5'
      },

      'state=overdue': {
        _size: '6px',
        backgroundColor: '$red'
      },

      'state=hidden': {
        _size: '6px',
        backgroundColor: '$sw3'
      }
    }
  }
});
