import { styleSheet } from 'react-swiss';

export default styleSheet({
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
      visibility: 'visible',
    },
  },
  Content: {
    _size: 'auto',
    position: 'absolute',
  },
});