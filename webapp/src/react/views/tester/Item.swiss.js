import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('Item', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    marginLeft: ({ indent }) => `${indent * 24}px`,
  },
  Input: {
    _el: 'input',
    _font: ['15px', '24px', 400],
    width: '100%',
    paddingLeft: '6px',
    '&:focus': {
      // border: '1px solid red',
    }
  },
  CollapseWrapper: {
    _size: ['24px', '24px'],
    _flex: ['row', 'center', 'center'],
    flex: 'none',
  },
  CollapseIcon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw2',
    opacity: '.5',
    '&:hover': {
      opacity: 1,
    },
    collapsed: {
      transform: 'rotate(90deg)',
    }
  },
  CheckboxWrapper: {
    _size: ['24px', '24px'],
    _flex: 'center',
    flex: 'none',
  },
  Checkbox: {
    _size: '18px',
    border: '2px solid $sw3',
    borderRadius: '3px',
    '&:hover': {
      border: '2px solid $blue',
    }
  },
});