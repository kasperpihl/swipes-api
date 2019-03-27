import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('TeamInviteInput', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    margin: '12px 18px 0 36px'
  },

  InviteText: {
    _el: 'p',
    _textStyle: 'body',
    fontWeight: '$medium',
    color: '$sw1',
    padding: '3px 0'
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
  }
});
