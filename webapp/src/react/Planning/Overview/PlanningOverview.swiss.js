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
    paddingBottom: '60px'
  },

  EmptyStateWrapper: {
    _flex: ['column', 'center', 'center']
  }
});
