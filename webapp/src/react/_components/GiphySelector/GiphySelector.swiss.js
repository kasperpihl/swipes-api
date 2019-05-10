import { styleSheet } from 'swiss-react';
import GiphyImage from './GiphyImage.png';
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
      _textStyle: 'H2',
      minHeight: '50px',
      content: '',
      background: `url(${GiphyImage})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat'
    }
  }
});
