import { styleSheet } from 'react-swiss';

export default styleSheet('Video', {
  Wrapper: {
    _size: '100%',
    _flex: ['row', 'center', 'center'],
    maxHeight: '99%',
    maxWidth: '90vw',
  },
  Player: {
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    backgroundColor: 'black',
  },
  GlobalStyles: {
    'body:-webkit-full-screen-ancestor': {
      '& *:not(:-webkit-full-screen-ancestor):not(video)': {
        position: 'fixed !important',
        zIndex: '-1 !important',
        left: '0 !important',
        top: '0 !important',
        transform: 'none !important',
        opacity: '0 !important',
      }
    }
  }
});