import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTask', {
  Wrapper: {
    _size: '100%',
    _flex: ['row', 'left', 'center'],
    paddingLeft: get => `${get('indention') * 24}px`,
    paddingRight: '6px',
    selected: {
      backgroundColor: '$sw4'
    },
    borderRadius: '4px'
  }
});
