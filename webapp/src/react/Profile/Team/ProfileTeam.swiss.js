import { styleSheet } from 'swiss-react';

export default styleSheet('ProfileTeam', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'body',
    fontWeight: '$medium',
    color: '$sw1',
    padding: '12px 0',
    userSelect: 'none',

    '&:first-child': {
      padding: '0px 0px 12px 0px'
    },

    '&:hover': {
      backgroundColor: '$green2'
    }
  },

  TeamName: {
    _el: 'h1',
    _size: ['150px', 'auto'],
    _textStyle: 'body',
    color: '$dark',
    flex: 'none'
  },

  Options: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center']
  },

  TeamInfo: {
    _el: 'p',
    _textStyle: 'body',
    color: '$sw2',
    flexShrink: '0',
    width: '150px',

    error: {
      color: '$red'
    },

    right: {
      _size: ['50px', 'auto'],
      _flex: ['row', 'left', 'center']
    }
  }
});
