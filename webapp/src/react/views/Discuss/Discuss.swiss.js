import { styleSheet } from 'swiss-react';

export default styleSheet('Discuss', {
  ParentWrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%',
  },
  LeftHeaderWrapper: {
    paddingLeft: '25px',
    borderBottom: '1px solid $sw4',
  },
  LeftSide: {
    height: '100%',
    flex: 'none',
    borderRight: '1px solid $sw4',
    width: '348px',
    'viewWidth=910': {
      width: '378px',
    },
    'viewWidth>=1080': {
      width: '408px',
    },
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
