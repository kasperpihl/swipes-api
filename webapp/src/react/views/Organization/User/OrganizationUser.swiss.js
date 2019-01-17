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

  Name: {
    _el: 'p',
    marginLeft: '12px'
  },

  Email: {
    _el: 'p',
    _textStyle: 'body',
    margin: '0 auto',
    color: '$sw2'
  },

  UserType: {
    _el: 'p',
    _textStyle: 'body',
    marginLeft: 'auto',
    color: '$sw2'
  },

  Button: {
    _el: Button,
    overflow: 'hidden',
    border: '1px solid $sw3',
    borderRadius: '50%',
    marginLeft: '12px',
    flexShrink: '0'
  }
});
