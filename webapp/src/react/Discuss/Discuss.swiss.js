import { styleSheet } from 'swiss-react';

export default styleSheet('Discuss', {
  ParentWrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%'
  },
  LeftHeaderWrapper: {
    padding: '0 12px',
    borderBottom: '1px solid $sw4'
  },
  LeftSide: {
    height: '100%',
    flex: 'none',
    borderRight: '1px solid $sw4',
    width: '348px'
  },
  RightSide: {
    _flex: ['center'],
    height: '100%',
    fontSize: '24px',
    width: '452px',
    'viewWidth=910': {
      width: '562px'
    }
  },
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%',
    paddingLeft: '18px',
    borderTop: '1px solid $sw3'
  }
});
