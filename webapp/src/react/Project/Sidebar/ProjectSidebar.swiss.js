import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectSidebar', {
  Wrapper: {
    _size: ['200px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    flex: 'none'
  },

  TasksTracker: {
    _flex: ['row', 'flex-start', 'flex-start']
  },

  CompletedTasks: {
    _font: ['43px', '36px', '400']
  },

  TotalTasks: {
    _font: ['13px', '18px', '400'],
    marginLeft: '6px',
    color: '$sw2'
  }
});
