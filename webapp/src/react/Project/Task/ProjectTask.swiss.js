import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTask', {
  Wrapper: {
    _size: '100%',
    _flex: ['row', 'left', 'center'],
    paddingLeft: get => `${get('indention') * 24}px`,
    paddingRight: '6px',
    isPlanSelected: {
      backgroundColor: '$green3'
    },
    selected: {
      backgroundColor: '$green2'
    },

    cursor: 'pointer',
    borderRadius: '4px'
  }
});
