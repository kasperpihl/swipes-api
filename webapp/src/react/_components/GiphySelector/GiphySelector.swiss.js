import { styleSheet } from 'swiss-react';

export default styleSheet('GiphySelector', {
  Wrapper: {
    _size: '100%',
    background: '$base',

    '& > .wrapper': {
      background: '$base'
    },

    '& > .wrapper > .input': {
      _size: ['100%', '42px'],
      _textStyle: 'body',
      padding: '0 15px'
    },

    '& > .wrapper > .attribution': {
      display: 'none'
    }
  }
});
