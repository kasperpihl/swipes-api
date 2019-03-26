import { styleSheet } from 'swiss-react';

export default styleSheet('Planning', {
  ParentWrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%',
    paddingLeft: '36px'
  },

  HeaderWrapper: {
    _flex: ['column', 'left', 'top']
  },

  LeftSide: {
    paddingTop: '42px'
  },

  RightSide: {
    _flex: ['column', 'center', 'center'],
    height: '100%',
    fontSize: '24px',
    width: '100%'
  }
});
