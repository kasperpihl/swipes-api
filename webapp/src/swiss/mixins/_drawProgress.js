import { addMixin } from 'swiss-react';

addMixin('drawProgress', (progress, colorOne, colorTwo) => {
  if (progress > 0 && progress <= 50) {
    return {
      background: `linear-gradient(to right, ${colorOne} 50%, ${colorTwo} 50%)`,
      '&:before': {
        content: '',
        backgroundColor: colorOne,
        transform: `rotate(${(progress / 100) * 360}deg)`
      }
    };
  } else if (progress > 50) {
    return {
      background: `linear-gradient(to right, ${colorTwo} 50%, ${colorOne} 50%)`,
      '&:before': {
        content: '',
        backgroundColor: colorOne,
        transform: `rotate(${(100 - (50 - progress) / 100) * 360}deg)`
      }
    };
  }
  return {
    background: 'white'
  };
});
