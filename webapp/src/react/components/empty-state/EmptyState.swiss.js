import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('EmptyState', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center'],
    fill: {
      height: '100%',
    },

    takeAction: {
      transform: 'translateY(-38px)',
      pointerEvents: 'none',
      transition: '.15s ease',
    },
  },

  ImageWrapper: {
    paddingBottom: '30px',
  },

  Image: {
    _el: Icon,
    _size: ['150px', 'auto'],

    large: {
      _size: ['300px', 'auto'],
    },

    takeAction: {
      _size: ['54px', '114px'],
      transform: 'translateX(calc(-50% + 6px))',
    },
  },

  Title: {
    _font: ['13px', '18px', 'bold'],
    color: '$sw2',
    userSelect: 'none',

    large: {
      _font: ['18px', '24px'],
    },

    takeAction: {
      color: '$sw1',
    },
  },

  Description: {
    _font: ['12px', '18px'],
    color: '$sw2',
    marginTop: '9px',
    textAlign: 'center',
    userSelect: 'none',

    large: {
      _font: ['14px', '20px'],
    },
  },
})
