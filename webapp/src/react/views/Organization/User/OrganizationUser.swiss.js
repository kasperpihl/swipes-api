import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';

export default styleSheet('OrganizationUser', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'bodyMedium',
    borderBottom: '1px solid $sw3',
    padding: '12px 0',

    '&:first-child': {
      padding: '0px 0px 12px 0px'
    }
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
    _textStyle: 'body',
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
    marginRight: '12px',
    flexShrink: '0'
  }
});
