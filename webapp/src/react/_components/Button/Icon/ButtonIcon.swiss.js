import { styleSheet, addGlobalStyles } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

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
    _size: '36px',
    backgroundColor: '$sw1',
    borderRadius: '100%',
    animation: 'button-loader 1.0s infinite ease-in-out'
  },

  Icon: {
    _el: Icon,
    _size: ['36px', '24px'],
    padding: '0 6px',

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
