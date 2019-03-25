import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectOverview', {
  Wrapper: {
    _flex: ['row', 'flex-start', 'flex-start'],
    padding: '24px 30px'
  },
  TaskWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    padding: '6px 0'
  }
});
