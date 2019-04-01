import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningOverview', {
  Wrapper: {
    _size: '100%',
    _flex: ['column', 'center', 'top']
  },

  ScrollableWrapper: {
    _size: '100%',
    _flex: ['column', 'center', 'top'],
    overflowY: 'auto',
    paddingTop: '42px',
    paddingRight: '18px',
    marginBottom: '78px',

    borderVisible: {
      borderTop: '1px solid $sw4'
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

  ToggleWrapper: {
    _flex: ['row', 'left', 'center'],
    _size: 'auto',
    flex: 'none',
    paddingRight: '6px',
    paddingLeft: '6px',
    '& > *:not(:last-child)': {
      marginRight: '2px'
    }
  },

  EmptyStateWrapper: {
    _flex: ['column', 'center', 'center'],
    height: '100%'
  }
});
