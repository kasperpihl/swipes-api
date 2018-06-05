import { styleSheet } from 'swiss-react';

export default styleSheet('FloatingInput', {
  Wrapper: {
    _size: ['100%', 'auto'],
    padding: '15px 0',
    paddingBottom: '0',

    inviteFormField: {
      height: '48px',
      margin: '0',
      padding: '0',
    },
  },

  Input: {
    _size: ['inherit', 'auto'],
    _font: ['16px', '27px', '400'],
    color: '$sw1',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid $sw3',
    padding: '5px 0',
    paddingTop: '27px',
    transition: '.2s ease-in-out',
    '&:focus': {
      outline: 'none',
    },
    standBy: {
      transition: '.2s ease-in-out',
    },
    active: {
      borderBottom: '1px solid $blue',
      transition: '.2s ease-in-out',
    },

    inviteFormField: {
      height: '48px',
      margin: 'auto 0',
      padding: '0',
      _font: ['15px'],
      border: 'none',
      left: '24px',
    },
  },

  Label: {
    _font: ['15px', '21px', '400'],
    position: 'absolute',
    left: '0',
    top: '46px',
    transition: '.2s ease-in-out',
    userSelect: 'none',
    cursor: 'text',

    inviteFormField: {
      _font: ['15px', '22px', '400'],
      top: '13px',
      left: '24px',
      color: '$sw2',
      margin: 'auto 0',
      backgroundColor: 'white',
    },

    standBy: {
      _font: ['11px'],
      color: '$sw2',
      top: '25px',
      transition: '.2s ease-in-out',

      inviteFormField: {
        left: '20px',
        top: '-10px',
        color: '$sw2',
        backgroundColor: 'white',
        padding: '4px',

        '@media $max800': {
          top: '-9px',
        },
      },
    },

    active: {
      _font: ['11px'],
      color: '$blue',
      top: '25px',
      transition: '.2s ease-in-out',

      inviteFormField: {
        left: '20px',
        top: '-10px',
        backgroundColor: 'white',
        padding: '4px',

        '@media $max800': {
          top: '-9px',
        },
      },
    },

    inputError: {
      color: '$red !important',
    },
  },
})
