import { styleSheet } from 'react-swiss';

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
      background: 'rgba(255, 255, 255, .8)',
      opacity: 1,
      transition: 'visibility 0s 0s, opacity .15s',
      visibility: 'visible',
    },
    _flex: ['column', 'center', 'center'],
    'position=bottom': {
      _flex: ['column', 'center', 'bottom'],
    },
    'position=top': {
      _flex: ['column', 'center', 'top'],
    },
  },
  Content: {
    _size: ['100%', 'auto'],
    'position=bottom': {
      borderTop: '1px solid $sw3',
    },
    'position=top': {
      borderBottom: '1px solid $sw3',
    },
  },
});