import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('SwipesLoader', {
  Wrapper: {
    _size: ['100%'],
  },

  Icon: {
    _el: Icon,
    width: '60px',
    _svgColor: '$sw4',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'pulsateLoader 2s linear infinte',

    '@keyframes pulsateLoader': {
      '50%': {
        opacity: '.5',
      },
    },
  },
})
