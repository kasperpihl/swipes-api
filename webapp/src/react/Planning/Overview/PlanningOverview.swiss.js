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
    paddingRight: '18px',
    paddingBottom: '60px',
    paddingTop: '42px'
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
    _flex: ['column', 'center', 'center']
  }
});
