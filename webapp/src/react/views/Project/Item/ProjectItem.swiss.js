import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('ProjectItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    paddingLeft: ({ indention }) => `${indention * 24}px`,
    paddingRight: '6px',
    selected: {
      background: '$blue'
    }
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
      color: '$sw5'
    }
  },
  ExpandWrapper: {
    _size: ['24px', '30px'],
    _flex: ['row', 'center', 'center'],
    flex: 'none',
    cursor: 'pointer',
    opacity: 0.8,
    '&:hover': {
      opacity: 1
    }
  },
  ExpandIcon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw2',
    pointerEvents: 'none',
    expanded: {
      transform: 'rotate(90deg)'
    },
    selected: {
      _svgColor: '$sw5'
    }
  },
  AttachmentIcon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw2',
    selected: {
      _svgColor: '$sw5'
    }
  },
  CheckboxWrapper: {
    _size: ['24px', '30px'],
    _flex: 'center',
    flex: 'none',
    cursor: 'pointer'
  },
  Checkbox: {
    _size: '18px',
    _flex: ['column', 'center', 'center'],
    border: '2px solid $sw3',
    pointerEvents: 'none',
    borderRadius: '9px',
    '!checked': {
      '.js-checkbox-wrapper:hover &': {
        border: '2px solid #05A851'
      }
    },
    checked: {
      background: '#05A851',
      border: 'none',
      '.js-checkbox-wrapper:hover &': {
        opacity: 0.5
      }
    }
  },
  AssigneeWrapper: {
    height: '30px',
    overflow: 'hidden',
    _flex: 'center',
    flex: 'none',
    hide: {
      visibility: 'hidden',
      '.js-item-class:hover &': {
        visibility: 'visible'
      }
    }
  }
});
