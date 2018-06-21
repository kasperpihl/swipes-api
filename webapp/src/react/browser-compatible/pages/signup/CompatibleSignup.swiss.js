import {styleSheet} from 'swiss-react';
export default styleSheet('SignUp', {
  Wrapper: {
    paddingTop: '30px',
  },

  Form: {
    _el: 'form',
    marginTop: '40px',
    color: '$sw2',

    '@media $max600': {
      marginTop: '30px',
    },

    '@media $max800': {
      marginTop: '30px',
    }
  },

  Illustration: {
    _size: ['50%', 'auto'],
    marginLeft: '50%',
    transform: 'translateX(-50%)',
  },

  Loader: {
    _widthSpecifications: ['initial', '100%'],
    margin: '0 auto',

    '& img': {
      _widthSpecifications: ['initial', '100%'],
      left: '50%',
      transform: 'translateX(-50% !important)',
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
    color: '$red',
    marginBottom: '15px',
    marginTop: '-30px',
    textAlign: 'center',
  },

  Switch: {
    _font: ['12px', '18px', '500'],
    textAlign: 'center',
    marginTop: '9px',
    padding: '0 15px',
    color: '$sw2',

    '& a': {
      _font: ['12px', '18px', '500'],
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      }
    }
  },

  LinkButton: {
    _el: 'a',
    color: '$blue',
  },

  FooterSentence: {
    _font: ['12px', '18px', '500'],
    textAlign: 'center',
    marginTop: '30px',
    color: '$sw2',

    '& a': {
      _font: ['12px', '18px', '500'],
      cursor: 'pointer',
      color: '$blue',

      '&:hover': {
        textDecoration: 'underline',
      },
    }
  },
})
