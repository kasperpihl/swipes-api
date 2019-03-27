import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('TeamUser', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'body',
    fontWeight: '$medium',
    color: '$sw1',
    borderBottom: '1px solid $sw3',
    padding: '12px 0'
  },

  UserDetails: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    marginLeft: '12px'
  },

  Name: {
    _el: 'p'
  },

  Email: {
    _el: 'p',
    _textStyle: 'body',
    color: '$sw2'
  },

  UserType: {
    _el: 'p',
    _size: ['40px', 'auto'],
    _flex: ['row', 'flex-end', 'center'],
    _textStyle: 'body',
    marginLeft: '18px',
    flexShrink: '0',
    color: '$sw2'
  },

  Button: {
    _el: Button,
    flexShrink: '0',
    justifySelf: 'flex-end'
  },

  OptionsButton: {
    _el: Button,
    marginLeft: 'auto',
    flexShrink: '0'
  }
});
