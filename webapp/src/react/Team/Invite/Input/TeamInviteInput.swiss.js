import { styleSheet } from 'swiss-react';
import Button from '_shared/Button/Button';

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
    _flex: ['row', 'flex-start', 'center'],
    width: '100%'
  },

  Button: {
    _el: Button,
    marginLeft: '100px'
  },

  Text: {
    _textStyle: 'caption',
    color: '$sw2'
  },

  ButtonWrapper: {
    marginLeft: 'auto',

    clicked: {
      transform: 'rotate(180deg)'
    }
  }
});
