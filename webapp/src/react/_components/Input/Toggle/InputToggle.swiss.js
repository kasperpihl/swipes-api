import { styleSheet } from 'swiss-react';

export default styleSheet('InputToggle', {
  Wrapper: {
    _flex: ['row', 'left', 'center']
  },

  PackageWrapper: {
    _flex: ['column', 'center', 'center'],
    marginRight: '6px'
  },

  Switch: {
    _el: 'label',
    _size: ['28px', '15px']
  },

  Input: {
    _el: 'input',
    _size: '0',
    pointerEvents: 'none',
    opacity: '0'
  },

  Slider: {
    _el: 'span',
    borderRadius: '9px',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: '$sw3',
    transition: '.1s ease-in-out',

    '&:before': {
      cursor: 'pointer',
      borderRadius: '9px',
      position: 'absolute',
      content: '',
      height: '11px',
      width: '11px',
      left: '2px',
      bottom: '2px',
      backgroundColor: '$base',
      transition: '.1s ease-in-out'
    },

    checked: {
      backgroundColor: '$green1',

      '&:before': {
        left: '15px',
        right: '2px',
        bottom: '2px'
      }
    }
  }
});