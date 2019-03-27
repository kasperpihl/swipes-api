import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('FormModal', {
  Wrapper: {
    _flex: ['column', 'flex-start', 'flex-start'],
    _size: ['450px', '480px'],
    padding: '18px'
  },

  Header: {
    _flex: ['row', 'left', 'center'],
    width: '100%',
    borderBottom: '1px solid $sw3'
  },

  Title: {
    _el: 'h2',
    _textStyle: 'H2',
    fontWeight: '$bold',
    paddingBottom: '14px'
  },

  Label: {
    _textStyle: 'H3'
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
    _flex: ['column', 'flex-start', 'flex-start']
  },

  Input: {
    _el: 'input',
    _size: ['100%', 'auto'],
    _textStyle: 'body',
    padding: '6px',
    border: '1px solid $sw3',
    marginBottom: '12px'
  },

  ButtonWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-end', 'center'],
    borderTop: '1px solid $sw3',
    marginTop: 'auto'
  },

  Button: {
    _el: Button,
    marginTop: '6px'
  }
});
