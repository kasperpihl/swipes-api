import { styleSheet } from 'swiss-react';

export default styleSheet('FloatingInput', {
  Wrapper: {
    _size: ['100%'],
  },

  Input: {
    _el: 'input',
    _size: ['100%'],
    _font: ['16px', '27px', '400'],
    color: '$sw2',
    backgroundColor: 'transparent',
    border: 'none',
    transition: '.2s ease-in-out',

    '&:focus': {
      outline: 'none',
    },

    'comp=resetPassword': {
      minHeight: '32px',
      color: '$sw1',
      borderBottom: '1px solid $sw2',
      transition: '.2s ease-in-out',

      '&:focus': {
        borderBottom: '1px solid $blue',
      }
    },
  },

  Label: {
    _el: 'label',
    _font: ['15px', '24px', '400'],
    color: '$sw2',
    padding: '0 6px',
    position: 'absolute',
    left: '0',
    top: '12px',
    padding: '0 6px',
    transition: '.2s ease-in-out',
    cursor: 'text',

    standBy: {
      _font: ['11px'],
      color: '$sw2',
      backgroundColor: 'white',
      top: '-10px',
      padding: '4px',
    },

    active: {
      _font: ['11px'],
      color: '$blue',
      backgroundColor: 'white',
      transition: '.2s ease-in-out',
      top: '-10px',
      padding: '4px',
    },

    'comp=resetPassword': {
      left: '0',
      top: '4px',
      padding: '0',

      standBy: {
        _font: ['11px'],
        color: '$sw2',
        backgroundColor: 'white',
        top: '-12px',
      },

      active: {
        _font: ['11px'],
        color: '$blue',
        backgroundColor: 'white',
        transition: '.2s ease-in-out',
        top: '-12px',
      },
    },
  }
})
