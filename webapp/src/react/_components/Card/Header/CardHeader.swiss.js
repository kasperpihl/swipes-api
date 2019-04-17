import { styleSheet } from 'swiss-react';

export default styleSheet('CardHeader', {
  Wrapper: {
    _size: ['calc(100% - 54px)', 'auto'],
    _flex: ['column', 'left', 'top'],
    margin: '0 18px 0 36px',
    separator: {
      borderBottom: '1px solid $sw4',
      paddingBottom: '6px'
    },
    noSpacing: {
      margin: '0',
      width: '100%'
    },
    subtitle: {
      _flex: ['row', 'left', 'center']
    }
  },
  TitleWrapper: {
    // _flex: ['column', 'left', 'center']
  },

  Title: {
    _el: 'p',
    _truncateString: '',
    _textStyle: 'H1',
    _size: ['auto', 'auto'],
    color: 'black',
    userSelect: 'none',
    fontWeight: '$bold',

    '&:hover': {
      cursor: 'pointer'
    }
  },

  Subtitle: {
    _truncateString: '',
    _size: ['100%', 'auto'],
    _font: ['12px', '18px'],
    _flex: ['row', 'left', 'center'],
    color: '$sw1',
    letterSpacing: '.1px',
    marginTop: '6px',
    userSelect: 'none'
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
    width: '100%',

    '&:empty': {
      display: 'none'
    },

    '& > *:not(:first-child)': {
      marginLeft: '12px'
    }
  }
});
