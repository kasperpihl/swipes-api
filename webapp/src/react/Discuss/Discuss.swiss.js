import { styleSheet } from 'swiss-react';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';

export default styleSheet('Discuss', {
  ParentWrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%'
  },
  LeftHeaderWrapper: {
    // _flex: ['column', 'left', 'between'],
    _size: ['100%', '79px']
  },
  LeftSide: {
    height: '100%',
    flex: 'none',
    borderRight: '1px solid $sw4',
    width: '348px'
  },
  RightSide: {
    _flex: ['column', 'center', 'center'],
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
  },
  EmptyState: {
    _el: EmptyState,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)',
    zIndex: 9999
  },
  EmptyStateButtonWrapper: {
    marginTop: '10px'
  }
});
