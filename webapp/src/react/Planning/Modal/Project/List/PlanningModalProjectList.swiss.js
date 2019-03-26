import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningModalProjectList', {
  ScrollWrapper: {
    overflowY: 'auto',
    width: '100%',
    height: '100%',
    hidden: {
      opacity: 0,
      visibility: 'hidden',
      position: 'absolute'
    }
  },
  EmptyWrapper: {
    _size: '100%',
    _flex: ['column', 'center', 'center']
  }
});
