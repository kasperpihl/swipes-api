import { styleSheet } from 'swiss-react';

export default styleSheet('ProgressCircle', {
  Wrapper: {
    _size: '24px',
    borderRadius: '100%',
    border: '2px solid $green',
    flex: 'none'
  },

  Fill: {
    _drawProgress: get => [get('prog'), 'white', '$green'],
    _size: '18px',
    overflow: 'hidden',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)',

    'prog>50': {
      _drawProgress: get => [get('prog'), '$green', 'white']
    },

    '&:before': {
      _size: '100%',
      display: 'block',
      borderRadius: '0 100% 100% 0 / 50%',
      marginLeft: '50%',
      transformOrigin: 'left'
    }
  }
});
