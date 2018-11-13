import { styleSheet } from 'swiss-react';

export default styleSheet('ProgressCircle', {
  Wrapper: {
    _size: '24px',
    marginLeft: '100px',
    borderRadius: '100%',
    border: '2px solid #05A851',
  },

  Fill: {
    _drawProgress: ['#{prog}', '#05A851', 'white'],
    _size: '18px',
    overflow: 'hidden',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)',
  
    '&:before': {
      _size: '100%',
      display: 'block',
      borderRadius: '0 100% 100% 0 / 50%',
      marginLeft: '50%',
      transformOrigin: 'left',
    }
  }  
})