import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTask', {
  Wrapper: {
    _size: '100%',
    _flex: ['row', 'left', 'center'],
    padding: '2px 0',
    paddingLeft: get => `${get('indention') * 24}px`,
    paddingRight: '6px',
    isPlanSelected: {
      backgroundColor: '$green3',
      opacity: 1
    },
    selected: {
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
