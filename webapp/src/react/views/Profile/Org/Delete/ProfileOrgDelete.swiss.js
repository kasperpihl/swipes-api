import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';

export default styleSheet('ProfileOrgDelete', {
  Wrapper: {
    _size: ['500px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)',
    padding: '24px',
    margin: '0 auto',
    background: '$sw5'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'cardTitle',
    marginBottom: '24px'
  },

  Text: {
    _el: 'p',
    _textStyle: 'body'
  },

  PasswordInput: {
    _el: 'input',
    _size: ['100%', 'auto'],
    _textStyle: 'body',
    padding: '6px',
    margin: '6px 0',
    border: '1px solid $sw3'
  },

  ButtonWrapper: {
    _flex: ['row', 'center', 'center'],
    marginTop: '24px',
    marginLeft: 'auto'
  },

  Button: {
    _el: Button,
    _flex: 'center',
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',

    '&:first-child': {
      marginRight: '18px'
    }
  }
});
