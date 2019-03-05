import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('PlanProject', {
  Wrapper: {
    hidden: {
      display: 'none'
    }
  },
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
    '.PlanProject_ButtonWrapper:hover &': {
      visibility: 'visible'
    },
    '.PlanProject_TaskWrapper:hover &': {
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
  },
  LoaderWrapper: {
    _flex: 'center',
    width: '100%',
    padding: '12px 0'
  }
});