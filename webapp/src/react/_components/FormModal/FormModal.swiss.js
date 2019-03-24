import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('FormModal', {
  Wrapper: {
    _flex: ['column', 'flex-start', 'flex-start'],
    width: '450px',
    padding: '24px'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'H1'
  },

  Subtitle: {
    _el: 'p',
    _textStyle: 'body',
    margin: '6px 0 18px 0'
  },

  InputContainer: {
    _el: 'form',
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center']
  },

  InputWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    marginTop: '12px'
  },

  Input: {
    _el: 'input',
    _size: ['100%', 'auto'],
    _textStyle: 'body',
    padding: '6px',
    border: '1px solid $sw3',
    marginBottom: '12px'
  },

  Label: {
    _el: 'h3',
    _textStyle: 'body',
    margin: '0 0 6px 0',
    color: '$sw2'
  },

  ButtonWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-end', 'center'],
    marginTop: '6px'
  },

  Button: {
    _el: Button,
    marginLeft: '12px'
  }
});
