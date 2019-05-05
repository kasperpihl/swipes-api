import { styleSheet, addGlobalStyles } from 'swiss-react';
import Icon from '_shared/Icon/Icon';

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
    small: {
      _size: '24px'
    },
    backgroundColor: '$sw1',
    borderRadius: '100%',
    animation: 'button-loader 1.0s infinite ease-in-out'
  },

  IconWrapper: {
    _size: '24px',
    _flex: ['row', 'center', 'center'],
    flex: 'none'
  },

  Icon: {
    _el: Icon,
    _size: '24px',
    flex: 'none',

    selected: {
      fill: '$base'
    },
    green: {
      fill: '$base',
      '.Button_Wrapper:hover &': {
        fill: '$dark'
      }
    },
    'status=Success': {
      fill: '$green1'
    },
    'status=Error': {
      fill: '$red'
    }
  }
});
