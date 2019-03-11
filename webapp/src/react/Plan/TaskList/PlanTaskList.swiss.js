import { styleSheet } from 'swiss-react';
import Button from '_shared/Button/Button';

export default styleSheet('PlanTaskList', {
  TaskWrapper: {},
  ButtonWrapper: {
    position: 'absolute',
    left: '-30px',
    width: '30px',
    forceHide: {
      display: 'none'
    }
  },
  Button: {
    _el: Button,
    visibility: 'hidden',
    '.PlanTaskList_ButtonWrapper:hover &': {
      visibility: 'visible'
    },
    '.PlanTaskList_TaskWrapper:hover &': {
      visibility: 'visible'
    },
    '& svg': {
      transition: '.1s'
    },
    selected: {
      visibility: 'visible',
      '& svg': {
        transform: 'rotate(45deg)',
        transition: '.1s'
      }
    }
  }
});
