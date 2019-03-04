import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTask', {
  Wrapper: {
    _size: '100%',
    _flex: ['row', 'left', 'center'],
    paddingLeft: get => `${get('indention') * 24}px`,
    paddingRight: '6px',
    selected: {
      backgroundColor: '$green3'
    },

    cursor: 'pointer',
    borderRadius: '4px'
  }
});
