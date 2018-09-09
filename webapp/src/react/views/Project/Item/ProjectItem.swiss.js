import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('ProjectItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    paddingLeft: ({ indent }) => `${indent * 24}px`,
    paddingRight: '6px',
    selected: {
      background: '$blue',
    },
  },
  Input: {
    _el: 'input',
    height: '30px',
    _font: ['15px', '30px', 400],
    width: '100%',
    borderRadius: '3px',
    paddingLeft: '6px',
    '&:focus': {
      // border: '1px solid $sw2',
    },
    selected: {
      color: '$sw5',
    },
  },
  ExpandWrapper: {
    _size: ['24px', '30px'],
    _flex: ['row', 'center', 'center'],
    flex: 'none',
  },
  ExpandIcon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw2',
    opacity: '.5',
    '&:hover': {
      opacity: 1,
    },
    expanded: {
      transform: 'rotate(90deg)',
    },
    selected: {
      _svgColor: '$sw5',
    },
  },
  AttachmentIcon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw2',
    selected: {
      _svgColor: '$sw5',
    },
  },
  CheckboxWrapper: {
    _size: ['24px', '30px'],
    _flex: 'center',
    flex: 'none',
  },
  Checkbox: {
    _size: '18px',
    border: '2px solid $sw3',
    borderRadius: '3px',
    '&:hover': {
      border: '2px solid $blue',
    },
  },
  AssigneeWrapper: {
    height: '30px',
    overflow: 'hidden',
    _flex: 'center',
    flex: 'none',
    hide: {
      visibility: 'hidden',
      '.item-class:hover &': {
        visibility: 'visible',
      },
    },
  },
});
