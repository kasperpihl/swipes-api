import { styleSheet, addGlobalStyles } from 'swiss-react';

addGlobalStyles({
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
});

export default styleSheet('Video', {
  Wrapper: {
    _size: '100%',
    _flex: ['row', 'center', 'center'],
    maxHeight: '99%',
    maxWidth: '90vw',
  },
  Player: {
    _el: 'video',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    backgroundColor: 'black',
  },
});