import {styleSheet} from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('Login', {
  Wrapper: {
    paddingTop: '30px',
  },

  Illustration: {
    _el: Icon,
    _size: ['60%', 'auto'],
    margin: '30px 0',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
  },

  Form: {
    marginTop: '40px',

    '&': {
      color: '$sw2',
    },

    '@media $max600': {
      marginTop: '30px',
    },

    '@media $max800': {
      marginTop: '30px',
    }
  },

  Footer: {
    _size: ['100%', 'auto'],
    padding: '69px 0',
    paddingTop: '90px',

    '@media $max800': {
      padding: '42px 0',
    },
  },

  ErrorLabel: {
    _font: ['13px', '18px'],
    marginBottom: '15px',
    marginTop: '-30px',
    textAlign: 'center',
    color: '$red'
  },

  ResetPassword: {
    textAlign: 'center',
    zIndex: '2',
    marginTop: '30px',

    '& a': {
      _font: ['12px', '$blue'],
      padding: '9px 0',
      '&:after': {
        content: '',
        _size: ['100%', '2px'],
        backgroundColor: 'rgba($sw2, .3)',
        left: '0',
        bottom: '0',
        position: 'absolute',
      },
     '&:hover': {
      '&:after': {
        backgroundColor: 'rgba($blue, 1)',
      }
     },
     '&:active': {
      color: '$sw2',
     },

     '&:visited': {
       color: '$sw2'
     },
    }
  },

  Switch: {
    _font: ['12px', '18px','500'],
    textAlign: 'center',
    marginTop: '9px',
    padding: '0 15px',
    color: '$sw2',
  },

  SwitchLink: {
      _el: 'a',
      _font: ['12px', '18px', '500'],
      cursor: 'pointer',
      color: '$blue',

      '&:hover':{
        textDecoration: 'underline',
      }
    }
})
