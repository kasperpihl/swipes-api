import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';

export default styleSheet('Profile', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row'],
    flexWrap: 'wrap',
    paddingTop: '24px'
  },

  Button: {
    _el: Button.Rounded,
    margin: '6px 0',
    marginLeft: 'auto'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'bodyLarge',
    _flex: 'center'
  }
});
