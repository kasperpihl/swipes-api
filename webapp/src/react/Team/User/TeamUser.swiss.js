import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('TeamUser', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center'],
    color: '$sw1',
    padding: '6px 0',
    minHeight: '30px',
    boxSizing: 'content-box'
  },

  Name: {
    _textStyle: 'body',
    width: '150px',
    marginLeft: '12px'
  },

  Email: {
    _textStyle: 'body',
    color: '$sw2',
    width: '150px'
  },

  UserType: {
    _size: ['100px', 'auto'],
    _flex: ['row', 'flex-end', 'center'],
    _textStyle: 'body',
    flexShrink: '0',
    color: '$sw2'
  },

  ButtonWrapper: {
    marginLeft: '18px',

    show: {
      transform: 'rotate(180deg)'
    }
  },

  OptionsButton: {
    _el: Button,
    marginLeft: 'auto',
    flexShrink: '0'
  }
});
