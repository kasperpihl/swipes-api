import { styleSheet } from 'swiss-react';
import { Link } from 'react-router-dom';

export default styleSheet('SignUp', {
  Wrapper: {
    paddingTop: '30px'
  },

  Form: {
    _el: 'form',
    marginTop: '40px',
    color: '$sw2',

    '@media $max600': {
      marginTop: '30px'
    },

    '@media $max800': {
      marginTop: '30px'
    }
  },

  Illustration: {
    _size: ['50%', 'auto'],
    marginLeft: '50%',
    transform: 'translateX(-50%)'
  },

  Loader: {
    _widthSpecifications: ['initial', '100%'],
    margin: '0 auto',

    '& img': {
      _widthSpecifications: ['initial', '100%'],
      left: '50%',
      transform: 'translateX(-50% !important)'
    }
  },

  SubmitWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'left', 'center'],
    paddingTop: '24px'
  },

  ErrorLabel: {
    _font: ['13px', '18px'],
    color: '$red',
    marginBottom: '15px',
    marginTop: '-30px',
    textAlign: 'center'
  },

  Switch: {
    _font: ['12px', '18px', '500'],
    // padding: '0 15px',
    color: '$sw2',

    '& a': {
      _font: ['12px', '18px', '500'],
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  },

  LinkButton: {
    _el: Link,
    color: '$blue'
  },

  Footer: {
    _font: ['12px', '18px', '500'],
    marginTop: '30px',
    color: '$sw2',

    '& a': {
      _font: ['12px', '18px', '500'],
      cursor: 'pointer',
      color: '$blue',

      '&:hover': {
        textDecoration: 'underline'
      }
    }
  },

  Input: {
    _el: 'input',
    _size: ['100%', '45px'],
    _font: ['15px', '25px'],
    marginTop: '15px',
    color: '$sw2',
    transition: '.2s ease',
    borderBottom: '1px solid $sw3',
    '&:focus': {
      borderBottom: '1px solid $blue',
      transition: '.2s ease',
      color: '$sw1'
    }
  }
});
