import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('GoalResult', {
  Wrapper: {
    _size: ['100%', '61px'],
    _flex: ['row', 'left', 'center'],
    padding: '0 6px',
    transition: '.2s ease',

    '&:hover': {
      backgroundColor: '$sw3',
      transition: '.2s ease',
    },

    '&:hover > .title': {
      color: '$blue',
      transition: '.2s ease',
    },
  },

  Assignees: {

  },

  Circle: {
    _size: '14px',
    _flex: ['row', 'center', 'center'],
    border: '2px solid $sw2',
    borderRadius: '50%',
    flexShrink: '0',

    completed: {
      _size: '24px',
      backgroundColor: '$green',
      border: 'none',
    },
  },

  Title: {
    _size: ['100%', 'auto'],
    _font: ['15px', '24px'],
    paddingLeft: '12px',
    paddingRight: '6px',
    transition: '.2s ease',
  },

  Icon: {
    _el: Icon,
    _size: ['18px'],
    _svgColor: '$sw5',
    opacity: '0',

    completed: {
      opacity: '1',
    },
  },
})
