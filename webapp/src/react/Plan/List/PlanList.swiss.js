import { styleSheet } from 'swiss-react';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';

export default styleSheet('PlanList', {
  Wrapper: {
    _size: '100%',
    padding: '0 18px',

    empty: {
      _flex: ['row', 'left', 'center']
    }
  },
  Section: {
    _flex: ['row', 'left', 'top'],
    flexWrap: 'wrap'
  },

  EmptyState: {
    _el: EmptyState,
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)'
  }
});
