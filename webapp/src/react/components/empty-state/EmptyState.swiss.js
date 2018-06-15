import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('EmptyState', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'top'],
    transform: 'translateY(50%)',
  },

  ImgWrapper: {
    paddingBottom: '30px',
  },

  Img: {
    _el: Icon,
    _size: ['150px', 'auto'],

    large: {
      _size: ['300px', 'auto'],
    },
  },

  Title: {
    _font: ['13px', '18px', 'bold'],
    color: '$sw2',
    userSelect: 'none',

    large: {
      _font: ['18px', '24px'],
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
