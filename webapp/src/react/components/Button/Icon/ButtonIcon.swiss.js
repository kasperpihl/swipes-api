import { styleSheet, addGlobalStyles } from 'swiss-react';
import Icon from 'src/react/icons/Icon';

addGlobalStyles({
  '@keyframes button-loader': {
    '0%': {
      WebkitTransform: 'scale(0)'
    },
    '100%': {
      WebkitTransform: 'scale(1.0)',
      opacity: 0
    }
  }
});

export default styleSheet('ButtonIcon', {
  LoaderCircle: {
    _size: '30px',
    backgroundColor: '$sw1',
    borderRadius: '100%',
    animation: 'button-loader 1.0s infinite ease-in-out'
  },

  Icon: {
    _el: Icon,
    _size: '24px',

    'status=Standard': {
      '.button-icon-js:hover &': {
        _svgColor: '$blue'
      }
    },

    'status=Success': {
      _svgColor: '$green'
    },

    'status=Error': {
      _svgColor: '$red'
    }
  }
});
