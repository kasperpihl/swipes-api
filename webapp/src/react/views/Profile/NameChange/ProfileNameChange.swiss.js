import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/button/Button';

export default styleSheet('ProfileNameChange', {
  Wrapper: {
    _size: ['253px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    margin: '0 auto',
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)',
    padding: '24px'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'cardTitle',
    marginBottom: '24px'
  },

  InputContainer: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center']
  },

  InputWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'center'],

    '&:first-child': {
      marginBottom: '18px'
    }
  },

  InputLabel: {
    _el: 'h3',
    _textStyle: 'body',
    marginBottom: '6px'
  },

  Input: {
    _el: 'input',
    _size: ['100%', 'auto'],
    _textStyle: 'body',
    padding: '6px',
    border: '1px solid $sw3'
  },

  Button: {
    _el: Button,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginTop: '24px'
  }
});
