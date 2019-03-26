import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectOverview', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%',
    paddingLeft: '36px'
  },
  TaskWrapper: {
    _size: ['100%', '100%'],
    overflowY: 'auto',
    paddingTop: '48px',
    paddingRight: '18px'
  },

  LeftSide: {
    paddingTop: '48px'
  },

  RightSide: {
    _flex: ['column', 'center', 'center'],
    height: '100%',
    width: '100%'
  },

  HeaderWrapper: {
    _flex: ['column', 'left', 'top']
  }
});
