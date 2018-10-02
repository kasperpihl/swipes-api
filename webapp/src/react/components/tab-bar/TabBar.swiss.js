import { styleSheet } from 'swiss-react';

export default styleSheet('TabBar', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
  },
  Item: {
    _flex: 'center',
    _font: ['12px', '18px', 500],
    padding: '6px 0',
    color: '$sw3',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    '&:hover': {
      color: '$sw1',
    },
    active: {
      color: '$sw1',
    },
    '&:not(:last-child)': {
      marginRight: '24px',
    },
  },
});
