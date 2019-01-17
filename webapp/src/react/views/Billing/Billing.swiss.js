import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';
import CardSection from './CardSection';

export default styleSheet('Billing', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center'],
  },

  PaymentToggle: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center'],
    paddingTop: '30px',
    paddingBottom: '55px',
  },

  ToggleSubtitle: {
    _size: ['420px', 'auto'],
    _font: ['12px', '21px', '500'],
    color: '$sw2',
    marginTop: '20px',
  },

  ManageButton: {
    _el: Button,
    marginTop: '10px',
  },

  SubmitButton: {
    _el: Button,
    marginTop: '20px',
  },

  ChangeDetails: {
    _el: Button,
    marginTop: '20px',
  },

  SubmitButtonSubtitle: {
    _font: ['12px', '15px', '500'],
    color: '$sw2',
    marginTop: '9px',
  },

  PaymentSection: {
    _size: ['420px', 'auto'],
    _flex: ['column', 'center'],
  },

  TopSection: {
    _size: ['420px', 'auto'],
    _flex: ['column', 'center'],
    transition: '.4s ease',

    success: {
      transform: 'translateY(-100%)',
      pointerEvents: 'none',
      opacity: '0',
      transition: '.4s ease',
    },
  },

  BottomSection: {
    _size: ['420px', 'auto'],
    _flex: ['column', 'center', 'center'],
    position: 'absolute',
    left: '0',
    top: '0',
    transform: 'translateY(300%)',
    opacity: '0',
    pointerEvents: 'none',
    transition: '.4s .2s ease',

    success: {
      transform: 'translateY(0%)',
      opacity: '1',
      pointerEvents: 'all',
      transition: '.4s .2s ease',
    },
  },

  BottomSectionTitle: {
    _font: ['27px', '36px'],
    color: 'black',
    textAlign: 'center',
    paddingBottom: '12px',
  },

  PaymentStatus: {
    _flex: ['row', 'left', 'center'],
  },

  PaymentStatusLabel: {
    _font: ['12px', '21px', '500'],
    color: '$sw2',
    _size: ['160px', 'auto'],
  },

  Status: {
    _font: ['12px', '21px', '500'],
    color: '$blue20',
    borderRadius: '2px',
    marginLeft: '6px',
    height: '21px',
    padding: '0 6px',

    '!active': {
      backgroundColor: '$sw3',
      color: '$sw2',
    },

    active: {
      color: 'white',
      backgroundColor: '$blue',
    },
  },

  Toggle: {
    _size: ['420px', '213px'],
    _flex: ['row'],
    color: '$blue',
    border: '1px solid $blue',
    borderRadius: '3px',
    overflow: 'hidden',
  },

  ToggleSection: {
    _size: ['100%'],
    cursor: 'pointer',
    transition: '.2s ease',
    color: 'black',

    '&:hover': {
      backgroundColor: '$sw3',
      transition: '.2s ease',
    },

    '&': {
      cursor: 'inherit',
    },

    first: {
      '&:first-child': {
        backgroundColor: '$blue',
        color: 'white',

        '&:hover': {
          backgroundColor: '$blu80',
          transition: '.2s ease',
        },
      },
    },

    '!first': {
      '&:last-child': {
        backgroundColor: '$blue',
        color: 'white',

        '&:hover': {
          backgroundColor: '$blue80',
          transition: '.2s ease',
        },
      },
    },
  },

  TogglePrice: {
    _font: ['42px', '54px'],
    paddingTop: '24px',
    paddingLeft: '21px',
  },

  ToggleLabel: {
    _font: ['18px', '24px', '400'],
    paddingLeft: '21px',
    paddingTop: '9px',
  },

  ToggleSubLabel: {
    _font: ['12px', '15px', '500'],
    paddingTop: '57px',
    paddingLeft: '21px',
  },

  SaveLabel: {
    _el: 'span',
    backgroundColor: '$yellow !important',
    color: 'black',
  },

  CardSection: {
    _el: CardSection,
  },

  CardSectionSubtitle: {
    _el: 'p',
    _font: ['12px', '18px'],
    color: '$sw2',
    textAlign: 'left',
    marginTop: '20px',
  },

  Link: {
    _el: 'a',

    '&:visited': {
      color: '$blue',
    },

    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
});
