import { styleSheet } from 'swiss-react';

export default styleSheet('Tooltip', {
  Wrapper: {
    _size: '100%',
    left: 0,
    top: 0,
    position: 'fixed',
    visibility: 'hidden',
    zIndex: 10,
    opacity: 0,
    // pointerEvents: 'none',
    shown :{
      visibility: 'visible',
      opacity: 1,
      transition: 'visibility 0s 0s, opacity .15s'
    },
  },
  Content: {
    _size: 'auto',
    position: 'absolute',
    top: '#{top}',
    left: '#{left}',
    transform: '#{transform}',
  },
});