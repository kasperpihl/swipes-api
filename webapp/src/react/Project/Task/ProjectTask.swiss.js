import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTask', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center'],
    padding: '1px 0',
    paddingLeft: get => `${get('indention') * 24}px`,
    paddingRight: '6px',
    isSelected: {
      backgroundColor: '$green3',
      opacity: 1
    },
    isFocused: {
      backgroundColor: '$green2',
      opacity: 1
    },
    '&:hover': {
      opacity: 1
    },
    cursor: 'pointer',
    borderRadius: '4px'
  }
});
