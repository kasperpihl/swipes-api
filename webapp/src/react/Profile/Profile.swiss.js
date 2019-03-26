import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('Profile', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row'],
    flexWrap: 'wrap',
    paddingTop: '24px'
  },

  Button: {
    _el: Button,
    margin: '6px 0',
    marginLeft: 'auto'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'body',
    fontWeight: '800',
    _flex: 'center',
    userSelect: 'none'
  }
});
