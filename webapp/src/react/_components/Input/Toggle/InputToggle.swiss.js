import { styleSheet } from 'swiss-react';

export default styleSheet('InputToggle', {
  PackageWrapper: {
    _flex: ['column', 'center', 'center'],
    cursor: 'pointer'
  },

  Switch: {
    _el: 'label',
    _size: ['30px', '18px'],
    cursor: 'pointer'
  },

  Slider: {
    _el: 'span',
    cursor: 'pointer',
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
      height: '14px',
      width: '14px',
      left: '2px',
      bottom: '2px',
      backgroundColor: '$base',
      transition: '.1s ease-in-out'
    },

    checked: {
      backgroundColor: '$green1',

      '&:before': {
        left: '14px',
        right: '2px',
        bottom: '2px'
      }
    }
  }
});
