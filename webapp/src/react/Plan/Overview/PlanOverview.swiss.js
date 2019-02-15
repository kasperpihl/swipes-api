import { styleSheet } from 'swiss-react';

export default styleSheet('PlanOverview', {
  Wrapper: {
    _flex: ['row', 'flex-start', 'flex-start'],
    padding: '0 30px'
  },
  TasksWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    marginLeft: '48px'
  }
});
