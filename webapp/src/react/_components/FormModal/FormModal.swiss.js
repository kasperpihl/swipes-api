import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('FormModal', {
  Wrapper: {
    _flex: ['column', 'flex-start', 'flex-start'],
    maxWidth: '450px',
    margin: '0 auto',
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)',
    padding: '24px',
    backgroundColor: '$sw5'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'cardTitle'
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
    _el: Button.Rounded,
    marginLeft: '12px'
  }
});
