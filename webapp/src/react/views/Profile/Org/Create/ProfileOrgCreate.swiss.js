import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';

export default styleSheet('ProfileOrgCreate', {
  Wrapper: {
    _size: ['95%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    margin: '0 auto',
    padding: '24px',
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'cardTitle',
    marginBottom: '24px'
  },

  InputWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'center'],
    marginBottom: '24px'
  },

  InputLabel: {
    _el: 'h3',
    _font: ['12px', '16px', '400'],
    marginBottom: '6px'
  },

  Input: {
    _el: 'input',
    _size: ['100%', 'auto'],
    _textStyle: 'body',
    padding: '6px',
    border: '1px solid $sw3'
  },

  Text: {
    _el: 'p',
    _textStyle: 'bodyMedium',
    fontStyle: 'italic'
  },

  Button: {
    _el: Button,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginLeft: 'auto',
    marginTop: '24px'
  }
});
