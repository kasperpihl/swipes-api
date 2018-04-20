import { styleSheet } from 'react-swiss';

export default styleSheet('SVG', {
  Wrapper: {
    _size: '100%',
    maxHeight: '99%',
    maxWidth: '90vw',
    '& svg': {
      _size: '100px',
      position: 'absolute',
      left: '50%',
      top: '50%',
      maxHeight: '100%',
      maxWidth: '100%',
      transform: 'translateX(-50%) translateY(-50%)',
      userSelect: 'none',
    }
  },
});