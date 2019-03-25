import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningOverview', {
  Wrapper: {
    _size: '100%',
    _flex: ['column', 'center', 'center']
  },

  EmptyStateWrapper: {
    _flex: ['column', 'center', 'center'],
    transform: 'translateY(-50%)'
  }
});
