import { styleSheet } from 'swiss-react';

export default styleSheet('UserImage', {
  Wrapper: {
    _size: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '50%',
    flexShrink: '0',

    'size!=undefined': {
      width: get => `${get('size')}px`,
      height: get => `${get('size')}px`
    }
  },
  Image: {
    _el: 'img',
    _size: '100%',

    grayscale: {
      filter: 'grayscale(100%)'
    }
  },

  Initials: {
    _size: ['100%'],
    _font: ['10px', '18px', 500],
    _flex: 'center',
    'size>=30': {
      _font: ['12px', '18px', 500]
    },
    textTransform: 'uppercase',
    color: '$sw5',
    backgroundColor: '$sw1'
  },

  Text: {
    _el: 'span',
    _textStyle: 'body',
    fontWeight: 'bold',
    color: '$sw5'
  }
});
