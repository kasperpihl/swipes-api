import { styleSheet, addGlobalStyles } from 'swiss-react';
import Icon from 'src/react/icons/Icon';
addGlobalStyles({
  '@keyframes pulse': {
    '50%': {
      opacity: '0.5'
    }
  }
});
export default styleSheet('SwipesLoader', {
  Wrapper: {
    _size: ['100%']
  },

  Icon: {
    _el: Icon,
    width: '60px',
    _svgColor: '$sw4',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'pulse 2s linear infinite'
  }
});
