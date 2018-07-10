import { styleSheet } from 'swiss-react';

export default styleSheet('Search', {
  SearchField: {
    _size: ['100%', '54px'],
    _flex: ['row', 'left', 'center'],
    borderBottom: '1px solid $blue60',
    paddingBottom: '24px',
  },

  Input: {
    _el: 'input',
    _size: ['100%', '54px'],
    _font: ['24px', '36px'],
    color: '$sw1',
    paddingRight: '15px',
    transition: '.2s ease',

    '&::-webkit-input-placeholder': {
      _font: ['24px', '36px'],
      color: '$sw2',
    },
  },
})
