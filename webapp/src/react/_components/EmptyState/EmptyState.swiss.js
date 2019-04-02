import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('EmptyState', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center'],
    pointerEvents: 'none',
    fill: {
      height: '100%'
    }
  },

  ImageWrapper: {},

  Image: {
    _el: Icon,
    _size: ['150px', 'auto'],
    fill: '$green2',

    large: {
      _size: ['300px', 'auto']
    }
  },

  Title: {
    _font: ['13px', '18px', 'bold'],
    _textStyle: 'H2',
    userSelect: 'none',

    large: {
      _font: ['18px', '24px']
    },

    small: {
      _font: ['12px', '18px', '$regular'],
      padding: '6px 0'
    }
  },

  Description: {
    _font: ['12px', '18px'],
    color: '$sw2',
    marginTop: '9px',
    textAlign: 'center',
    userSelect: 'none',

    large: {
      _font: ['14px', '20px']
    }
  }
});
