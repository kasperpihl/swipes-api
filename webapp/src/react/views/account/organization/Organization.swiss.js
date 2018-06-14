import { styleSheet} from 'swiss-react';
import Button from 'src/react/components/button/Button';
export default styleSheet('Organization', {

  UserList: {
    _size: ['100%', 'auto'],
  },

  User: {
    _size: ['100%', '60px'],
    _flex: ['row', 'left', 'center'],
    borderTop: '1px solid $sw3',
  },

  UserImage: {
    paddingRight: '21px',
  },

  UserName: {
    _size: ['100%'],
    _flex: ['column', 'left', 'center'],
    _font: ['15px', '24px'],
    color: 'black',
  },

  UserStatus: {
    _font: ['10px', '15px', 'bold'],
    color: '$blue60',
    marginTop: '3px',
    textTransform: 'uppercase',
  },

  UserEmail: {
    _size: ['100%'],
    _flex: ['row', 'left', 'center'],
    _font: ['12px', '18px'],
    color: '$sw2',
  },

  UserType: {
    _size: ['100%', 'initial'],
    _font: ['10px', '18px'],
    color: '$sw2',
    marginRight: '33px',
    textAlign: 'right',
  },

  /***********************************************
    Organization
  ***********************************************/

  Form: {
    _size: ['100%', '90px'],
    _flex: ['row', 'between', 'center'],
  },

  InputWrapper: {
    _size: ['100%', '48px'],
    _flex: ['row'],
    border: '1px solid $sw3',
    borderRadius: '3px',
  },

  Input: {
    boxSizing: 'content-box',
    padding: '0 18px',

    '&:first-child': {
      _size: ['60%', '100%'],
    },

    '&:last-child': {
      _size: ['100%'],

      '&:after': {
        _size: ['1px', '42px'],
        content: '',
        position: 'absolute',
        left: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: '$sw3',
      },
    },
  },

  CTA: {
    _el: Button,
    marginLeft: '15px',
  },

})
