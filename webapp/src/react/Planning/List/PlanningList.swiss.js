import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningList', {
  Content: {
    width: '100%',
    opacity: 0,
    transition: '0.25s',
    didLoad: {
      opacity: 1
    }
  }
});
