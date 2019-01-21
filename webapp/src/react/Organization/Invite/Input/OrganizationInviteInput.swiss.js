import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('OrganizationInviteInput', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start']
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
    _el: Button.Rounded,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginLeft: '12px'
  }
});
