import { styleSheet } from 'swiss-react';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';

export default styleSheet('CommentList', {
  Wrapper: {
    // paddingBottom: '6px'
  },

  EmptyState: {
    _el: EmptyState,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)'
  }
});
