import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTask', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    width: '100%',
    paddingLeft: get => `${get('indention') * 24}px`,
    paddingRight: '6px',
    isSelected: {
      backgroundColor: '$green4',
      opacity: 1
    },
    isFocused: {
      backgroundColor: '$green4',
      opacity: 1
    },
    '&:hover': {
      opacity: 1
    },
    cursor: 'pointer',
    borderRadius: '4px'
  }
});
