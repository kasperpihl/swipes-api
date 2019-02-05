import { styleSheet } from 'swiss-react';

export default styleSheet('UserImage', {
  Wrapper: {
    _size: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '50%',
    flexShrink: '0',

    size: {
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
    _flex: 'center',
    textTransform: 'uppercase',
    color: '$sw5',
    backgroundColor: '$sw1',
    flexShrink: '0',

    'size>=30': {
      _font: ['12px', '18px', 500]
    }
  },

  Text: {
    _el: 'span',
    _textStyle: 'bodyMedium',
    fontWeight: 'bold',
    color: '$sw5'
  }
});
