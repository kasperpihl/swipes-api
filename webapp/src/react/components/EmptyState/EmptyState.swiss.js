import { styleSheet } from 'swiss-react';
import Icon from 'src/react/icons/Icon';

export default styleSheet('EmptyState', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center'],
    pointerEvents: 'none',
    fill: {
      height: '100%'
    }
  },

  ImageWrapper: {
    paddingBottom: '30px'
  },

  Image: {
    _el: Icon,
    _size: ['150px', 'auto'],

    large: {
      _size: ['300px', 'auto']
    }
  },

  Title: {
    _font: ['13px', '18px', 'bold'],
    color: '$sw2',
    userSelect: 'none',

    large: {
      _font: ['18px', '24px']
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
