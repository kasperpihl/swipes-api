import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningModalProjectList', {
  ScrollWrapper: {
    overflowY: 'auto',
    width: '100%',
    height: '100%',
    hidden: {
      opacity: 0,
      visibility: 'hidden',
      position: 'absolute'
    },

    '&::-webkit-scrollbar': {
      '-webkit-appearance': 'none',
      width: '6px',
      backgroundColor: 'transparent'
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '$sw3',
      borderRadius: '3px'
    }
  },
  EmptyWrapper: {
    _size: '100%',
    _flex: ['column', 'center', 'center']
  }
});
