import { styleSheet } from 'swiss-react';

export default styleSheet('TabBar', {
  Wrapper: {
    _size: ['100%', '30px'],
    _flex: ['row', 'left', 'top']
  },
  Item: {
    _flex: 'center',
    _textStyle: 'caption',
    userSelect: 'none',
    cursor: 'pointer',
    color: '$sw2',
    height: 'calc(100% + 1px)',
    padding: '6px 0',
    textTransform: 'uppercase',
    '&:hover': {
      color: '$dark',
      borderBottom: '1px solid $dark'
    },
    active: {
      _textStyle: 'caption',
      color: '$dark',
      borderBottom: '1px solid $dark'
    },
    '&:not(:first-child)': {
      marginLeft: '24px'
    }
  }
});
