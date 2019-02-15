import { styleSheet } from 'swiss-react';

export default styleSheet('DayTrack', {
  Wrapper: {
    _size: ['80px', 'auto'],
    _flex: ['column', 'left', 'top']
  },

  Week: {
    width: '80px',
    _flex: ['row', 'left', 'center'],
    flexWrap: 'wrap'
  },

  Day: {
    _size: '12px',
    borderRadius: '6px',
    margin: '2px',

    'state=upcoming': {
      backgroundColor: '$green',
      opacity: '.5'
    },

    'state=completed': {
      backgroundColor: '$green'
    },

    'state=overdue': {
      backgroundColor: '$red',
      opacity: '1'
    }
  }
});
