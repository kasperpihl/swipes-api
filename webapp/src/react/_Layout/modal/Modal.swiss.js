import { styleSheet } from 'swiss-react';

export default styleSheet('Modal', {
  Container: {
    _size: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0,
    visibility: 'hidden',
    zIndex: 9,
    show: {
      background: 'rgba($dark, .1)',
      opacity: 1,
      transition: 'visibility 0s 0s, opacity .15s',
      visibility: 'visible'
    },
    _flex: ['column', 'center', 'center'],
    '& > *': {
      margin: 'auto',
      boxShadow: '0 1px 20px 3px rgba($sw1  ,0.1)',
      background: '$base',
      borderRadius: '6px'
    },

    clickDisabled: {
      pointerEvents: 'none',
      userSelect: 'none'
    }
  }
});
