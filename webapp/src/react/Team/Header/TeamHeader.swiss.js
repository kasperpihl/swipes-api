import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('TeamHeader', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center']
  },

  Title: {
    _el: 'h1',
    _textStyle: 'H1'
  },

  Button: {
    _el: Button,
    marginLeft: 'auto'
  },

  StatusBox: {
    _size: ['56px', '24px'],
    _textStyle: 'caption',
    _flex: ['column', 'center', 'center'],
    backgroundColor: get => get('color'),
    textTransform: 'uppercase',
    color: '$base',
    borderRadius: '2px',
    margin: '0 auto 0 24px',
    pointerEvents: 'none',
    userSelect: 'none'
  }
});
