import { styleSheet } from 'swiss-react';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';

export default styleSheet('CommentList', {
  Wrapper: {
    _flex: ['column', 'left', 'bottom'],
    minHeight: '100%',
    marginTop: 'auto',
    paddingLeft: '24px'
  },

  EmptyState: {
    _el: EmptyState,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)'
  },

  NewMessageIndicator: {
    _flex: ['row', 'left', 'center'],
    width: '100%'
  },

  New: {
    _flex: ['row', 'center', 'center'],
    _font: ['8px', '11px', '400'],
    width: '37px',
    height: '18px',
    borderRadius: '2px',
    color: '$base',
    backgroundColor: '$blue'
  },

  Line: {
    width: '100%',
    height: '1px',
    backgroundColor: '$blue',
    marginLeft: '6px'
  }
});
