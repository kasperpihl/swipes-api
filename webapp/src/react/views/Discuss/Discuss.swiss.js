import { styleSheet } from 'swiss-react';

export default styleSheet('Discuss', {
  ParentWrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%',
  },
  LeftSide: {
    height: '100%',
    width: '408px',
    flex: 'none',
    borderRight: '1px solid $sw4',
  },
  RightSide: {
    _flex: ['center'],
    width: '100%',
    height: '100%',
    fontSize: '24px',
  },
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%',
    paddingLeft: '18px',
    borderTop: '1px solid $sw3',
  },
});
