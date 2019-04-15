import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('FormModal', {
  Wrapper: {
    _flex: ['column', 'flex-start', 'flex-start'],
    width: '450px',
    padding: '18px',

    create: {
      _size: ['100%', 'auto']
    }
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
    margin: '12px 0'
  },

  InputContainer: {
    _el: 'form',
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center']
  },

  InputWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    marginBottom: '18px',

    '&:first-child': {
      marginTop: '18px'
    }
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
    flex: 'none'
  },

  Button: {
    _el: Button,
    marginTop: '6px',

    '&:last-child': {
      marginLeft: '6px'
    }
  }
});
