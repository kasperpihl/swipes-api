import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('ProjectTask', {
  Wrapper: {
    _size: '100%',
    _flex: ['row', 'left', 'center'],
    paddingLeft: get => `${get('indention') * 24}px`,
    paddingRight: '6px',
    selected: {
      backgroundColor: '$sw4'
    },
    borderRadius: '4px'
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
    }
    // selected: {
    //   color: '$sw5'
    // }
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
  AssigneesWrapper: {
    _flex: ['row', 'center', 'center'],
    height: '24px',

    hide: {
      opacity: '0',
      visbility: 'hidden',
      '.js-item-class:hover &': {
        opacity: '1',
        visbility: 'visible'
      }
    }
  },

  Button: {
    _el: Button.Standard
    // selected: {
    //   _svgColor: '$sw5'
    // }
  }
});
