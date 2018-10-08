import { styleSheet } from 'swiss-react';

export default styleSheet('TabBar', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
  },
  Item: {
    _flex: 'center',
    _textStyle: 'tabInactive',
    padding: '6px 0',
    textTransform: 'uppercase',
    '&:hover': {
      _textStyle: 'tabActive'
    },
    active: {
      _textStyle: 'tabActive'
    },
    '&:not(:last-child)': {
      marginRight: '24px',
    },
  },
});
