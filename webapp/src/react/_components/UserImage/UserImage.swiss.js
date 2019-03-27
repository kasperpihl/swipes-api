import { styleSheet } from 'swiss-react';

export default styleSheet('UserImage', {
  Wrapper: {
    _size: '100%',
    _flex: ['column', 'center', 'center'],
    overflow: 'hidden',
    flexShrink: '0',
    userSelect: 'none',

    size: {
      width: get => `${get('size')}px`,
      height: get => `${get('size')}px`
    }
  },
  Image: {
    _el: 'img',
    _size: '100%',
    borderRadius: '50%',

    grayscale: {
      filter: 'grayscale(100%)'
    }
  },

  Initials: {
    _size: ['100%'],
    _flex: 'center',
    textTransform: 'uppercase',
    borderRadius: '50%',
    color: '$sw5',
    backgroundColor: '$sw1',
    flexShrink: '0',

    'size>=30': {
      _font: ['12px', '18px', '$medium']
    }
  },

  Text: {
    _el: 'span',
    _textStyle: 'caption',
    color: '$sw5',

    'size>=30': {
      _textStyle: 'body',
      fontWeight: '$medium'
    }
  }
});
