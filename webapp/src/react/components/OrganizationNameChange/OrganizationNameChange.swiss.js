import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';

export default styleSheet('OrganizationNameChange', {
  Wrapper: {
    _size: ['90%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    margin: '0 auto',
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)',
    padding: '24px',
    backgroundColor: '$sw5'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'cardTitle',
    marginBottom: '18px'
  },

  InputContainer: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center']
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
    _flex: ['row', 'flex-end', 'center']
  },

  Button: {
    _el: Button,
    marginLeft: '12px'
  }
});
