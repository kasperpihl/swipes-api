import { styleSheet } from 'swiss-react';

export default styleSheet('TabBar', {
  Wrapper: {
    _size: ['100%', '30px'],
    _flex: ['row', 'left', 'top']
  },
  Item: {
    _flex: 'center',
    _textStyle: 'caption',
    color: '$sw2',
    padding: '6px 0',
    textTransform: 'uppercase',
    '&:hover': {
      _textStyle: 'caption',
      color: '$dark'
    },
    active: {
      _textStyle: 'caption',
      color: '$dark'
    },
    '&:not(:last-child)': {
      marginRight: '24px'
    }
  }
});
