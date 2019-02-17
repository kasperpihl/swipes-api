import { styleSheet } from 'swiss-react';

export default styleSheet('Gradient', {
  Wrapper: {
    _size: '100%',
    backgroundImage: 'linear-gradient(#0D315B, #40A3E7, #2D7EDB)',
    backgroundSize: '100% 200%',
    backgroundPosition: '0% 100%',
    transition: '2.0s ease-in',
    isNight: {
      transition: '2.0s ease-in',
      backgroundPosition: '0% 0%'
    },
    left: 0,
    top: 0,
    position: 'fixed',
    zIndex: -1
  },
  Success: {
    _size: '100%',
    opacity: 0,
    transition: '0.9s ease-in',
    'color=green': {
      background:
        'linear-gradient(135deg, rgba(147,247,190,1) 0%, rgba(34,208,112,1) 100%)'
    },
    'color=red': {
      background: 'linear-gradient(135deg, #EC6583 0%, #F8A39D 100%)'
    },
    show: {
      opacity: 1,
      transition: '.3s ease-in'
    }
  }
});
