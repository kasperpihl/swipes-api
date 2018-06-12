import { styleSheet } from 'swiss-react';

export default styleSheet('FloatingInput', {
  Wrapper: {
    _size: ['100%'],
  },

  Input: {
    _size: ['100%'],
    _font: ['16px', '27px', '400'],
    color: '$sw2',
    backgroundColor: 'transparent',
    border: 'none',
    transition: '.2s ease-in-out',

    '&:focus': {
      outline: 'none',
    },
  },

  Label: {
    _font: ['15px', '21px', '400'],
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
  }
})
