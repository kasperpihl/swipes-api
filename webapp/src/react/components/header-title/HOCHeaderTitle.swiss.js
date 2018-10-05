import { styleSheet } from 'swiss-react';

export default styleSheet('HOCHeaderTitle', {
  Wrapper: {
    _size: ['100%', '99px'],
    _flex: ['row', 'left', 'top'],

    noSubtitle: {
      height: '75px',
    },

    Border: {
      borderBottom: '1px solid $sw3',
    },
  },

  Title: {
    _size: ['100%', 'auto'],
    _textStyle: 'cardTitle',
    color: 'black',
    _truncateString: '',
    letterSpacing: '-.6px',

    '&:hover': {
      cursor: 'text',
    },
  },

  Subtitle: {
    _size: ['100%', 'auto'],
    _font: ['12px', '18px'],
    color: '$sw1',
    _truncateString: '',
    letterSpacing: '.1px',
    marginTop: '6px',
  },

  Input: {
    _el: 'input',
    _size: ['100%', '54px'],
    _font: ['30px'],
    borderBottom: '1px solid $blue',
    paddingBottom: '15px',

    '&::-webkit-input-placeholder': {
      _font: ['30px'],
      color: '$sw2',
    },

    '&:focus': {
      borderColor: '$blue',
    },
  },

  Actions: {
    _size: ['auto', '42px'],
    _flex: ['row', 'right', 'center'],
    marginLeft: '30px',

    '&:empty': {
      display: 'none',
    },

    '& > *:not(:first-child)': {
      marginLeft: '12px',
    },
  },
});
