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
    }
  },

  ContentWrapper: {
    _flex: ['column', 'left', 'top'],
    width: '100%',

    noSubtitle: {
      _flex: ['row', 'left', 'center']
    },

    hasTeamPicker: {
      _flex: ['row', 'left', 'top']
    }
  },

  TitleWrapper: {
    _flex: ['column', 'left', 'center'],
    width: '100%'
  },

  Title: {
    _el: 'p',
    _truncateString: '',
    _textStyle: 'H1',
    _size: ['auto', 'auto'],
    maxWidth: '400px',
    color: 'black',
    userSelect: 'none',
    fontWeight: '$bold',

    hasClickHandler: {
      cursor: 'pointer'
    }
  },

  Subtitle: {
    _truncateString: '',
    _size: ['100%', 'auto'],
    _font: ['12px', '18px'],
    _flex: ['row', 'left', 'center'],
    maxWidth: '400px',
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
