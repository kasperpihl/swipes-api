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

  EmptyStateWrapper: {
    _flex: ['column', 'center', 'center']
  }
});
