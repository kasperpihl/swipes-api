import { styleSheet } from 'react-swiss';

export default styleSheet('Jpeg', {
  Image: {
    _size: '100%',
    maxHeight: '99%',
    maxWidth: '90vw',
    '&::-webkit-scrollbar': {
      backgroundColor: 'rgba(black,0)',
      overflow: 'hidden',
      width: '16px',
      height: '16px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'rgba(black,.1)',
      borderRadius: '10px',
      border: '2px solid rgba(0, 0, 0, 0)',
      backgroundClip: 'padding-box',
      WebkitBorderRadius: '7px',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(black,.1)',
      borderRadius: '10px',
      border: '4px solid rgba(0, 0, 0, 0)',
      backgroundClip: 'padding-box',
      WebkitBorderRadius: '7px',
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      WebkitBoxShadow: 'inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05)',
    },
    fullSize: {
      display: 'block',
      overflow: 'auto',
    },
    '& canvas': {
      _size: 'auto',
      position: 'absolute',
      left: '50%',
      top: '50%',
      maxHeight: '100%',
      maxWidth: '100%',
      transform: 'translateX(-50%) translateY(-50%)',
      userSelect: 'none',
      fullSize: {
        left: '0',
        top: '0',
        maxHeight: 'none',
        maxWidth: 'none',
        height: 'auto',
        transform: 'none',
      }
    }
  },
});