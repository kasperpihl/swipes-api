import { styleSheet } from 'swiss-react';

export default styleSheet('Dropdown', {
  Wrapper: { 
    _size: ['120px', 'auto'],
    _flex: ['column', 'center', 'center'],
  },

  Background: {
    _size: ['100%', '24px'],
    _flex: ['row', 'between', 'center'],
    boxShadow: '0 0 0 1px $sw3',
    transition: '.4s ease-in-out all',

    rounded: {
      borderRadius: '18px',
    }
  },

  Text: {
    _font: ['12px', '18px', 400],
    color: '$sw1',
    padding: '9px 12px',
    hasIcon: {
      paddingLeft: '0px',
    },
    '&:hover': {
      color: '$blue',
    },
  },

  ArrowButton: {
    _el: 'button',
    _size: '24px',
    background: 'black',
  },

  DropdownBox: {
    _size: ['100%', '0'],
    overflowY: 'hidden',
    transition: '.4s ease-in-out all',

    show: {
      _size: ['100%', '150px'],
      overflowY: 'scroll',
      boxShadow: '0 6px 12px 1px rgba(0,12,47,0.3)',
    }
  }
})