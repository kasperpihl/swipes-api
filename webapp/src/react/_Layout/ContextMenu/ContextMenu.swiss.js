import { styleSheet } from 'swiss-react';

export default styleSheet('ContextMenu', {
  Wrapper: {
    _size: '100%',
    top: 0,
    left: 0,
    opacity: 0,
    position: 'fixed',
    visibility: 'hidden',
    zIndex: 10,
    shown: {
      opacity: 1,
      transition: 'visibility 0s 0s, opacity .15s',
      visibility: 'visible'
    },
    showBackground: {
      background: 'rgba($sw1, .8)'
    }
  },
  Content: {
    _size: 'auto',
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: '3px',
    boxShadow: '0 1px 20px 3px rgba(0, 37, 82, .4)',
    top: get => get('top'),
    bottom: get => get('bottom'),
    left: get => get('left'),
    right: get => get('right'),
    transform: get => get('transform')
  }
});
