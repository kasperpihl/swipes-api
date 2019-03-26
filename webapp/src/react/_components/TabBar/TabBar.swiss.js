import { styleSheet } from 'swiss-react';

export default styleSheet('TabBar', {
  Wrapper: {
    _size: ['calc(100% - 54px)', '30px'],
    _flex: ['row', 'left', 'top'],
    margin: '0 18px 0 36px',
    borderBottom: '1px solid $sw4'
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
