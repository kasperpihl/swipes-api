import { styleSheet } from 'swiss-react';

export default styleSheet('GoalListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    _size: ['100%', 'auto'],
    minHeight: '60px',
    overflow: 'hidden',
    padding: '12px',
  },
  Title: {
    _size: ['100%', 'auto'],
    _font: ['15px', '24px', '400'],
    color: '$sw1',
    padding: '0 12px',
    transition: '.2s ease',

    '#{hoverRef}:hover &': {
      color: '$blue',
      transition: '.2s ease'
    }
  },
  StatusDot: {
    _flex: 'row',
    flex: 'none',
    _size: '12px',
    borderRadius: '50%',
    'status=Later|later': {
      backgroundColor: '$sw2',
    },
    'status=Now|now': {
      backgroundColor: '$yellow',
    },
    'status=Done|done': {
      backgroundColor: '$green'
    },
  },
});