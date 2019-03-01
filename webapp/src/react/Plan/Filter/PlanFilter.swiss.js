import { styleSheet } from 'swiss-react';

export default styleSheet('PlanFilter', {
  Wrapper: {
    width: '100%'
  },
  ButtonWrapper: {
    _flex: 'center',
    flex: 'none',
    transform: 'rotate(90deg)',
    transition: '.1s',
    expanded: {
      transform: 'rotate(270deg)'
    }
  }
});
