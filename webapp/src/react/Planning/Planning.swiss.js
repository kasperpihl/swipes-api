import { styleSheet } from 'swiss-react';

export default styleSheet('Planning', {
  ParentWrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%'
  },
  LeftSide: {
    height: '100%',
    flex: 'none',
    borderRight: '1px solid $sw4',
    width: '210px'
  },
  RightSide: {
    _flex: ['column', 'center', 'center'],
    height: '100%',
    fontSize: '24px',
    width: '100%'
  }
});
