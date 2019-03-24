import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningModalProjectList', {
  ScrollWrapper: {
    overflowY: 'auto',
    width: '100%',
    height: '100%',
    paddingRight: '6px',
    hidden: {
      opacity: 0,
      visibility: 'hidden',
      position: 'absolute'
    }
  }
});
