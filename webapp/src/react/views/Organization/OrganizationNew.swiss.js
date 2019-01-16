import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/button/Button';

export default styleSheet('OrganizationNew', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row'],
    flexWrap: 'wrap',
    padding: '15px'
  },

  InviteWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    marginTop: '24px'
  },

  InviteText: {
    _el: 'p',
    _textStyle: 'bodyMedium'
  },

  InputWrapper: {
    _flex: ['row', 'flex-start', 'center']
  },

  EmailInput: {
    _el: 'input',
    _size: ['250px', 'auto'],
    _textStyle: 'body',
    border: '1px solid $sw3',
    padding: '6px'
  },

  SendButton: {
    _el: Button,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginLeft: '12px'
  },

  Button: {
    _el: Button,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginLeft: '12px'
  }
});
