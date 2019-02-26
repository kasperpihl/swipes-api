import { styleSheet } from 'swiss-react';

export default styleSheet('CardHeader', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'left', 'top'],

    separator: {
      // paddingBottom: '12px',
      borderBottom: '1px solid $sw4'
    },

    subtitle: {
      _flex: ['row', 'left', 'bottom']
    }
  },

  Title: {
    _truncateString: '',
    _textStyle: 'H1',
    _size: ['100%', 'auto'],
    color: 'black',

    '&:hover': {
      cursor: 'text'
    }
  },

  Subtitle: {
    _truncateString: '',
    _size: ['100%', 'auto'],
    _font: ['12px', '18px'],
    _flex: ['row', 'left', 'center'],
    color: '$sw1',
    letterSpacing: '.1px',
    marginTop: '6px'
  },

  Input: {
    _el: 'input',
    _size: ['100%', '54px'],
    _font: ['30px'],
    borderBottom: '1px solid $blue',
    paddingBottom: '15px',

    '&::-webkit-input-placeholder': {
      _font: ['30px'],
      color: '$sw2'
    },

    '&:focus': {
      borderColor: '$blue'
    }
  },

  Actions: {
    _flex: ['row', 'right', 'center'],
    marginLeft: '30px',

    '&:empty': {
      display: 'none'
    },

    '& > *:not(:first-child)': {
      marginLeft: '12px'
    }
  }
});
