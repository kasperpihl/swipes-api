import { styleSheet } from 'swiss-react';

export default styleSheet('ButtonExtended', {
  Wrapper: {
    _el: 'a',
    _size: ['auto', '36px'],
    _flex: ['row', 'center', 'center'],
    display: 'inline-flex',
    _textStyle: 'body',
    flex: 'none',
    userSelect: 'none',

    'status=Standard': {
      '&:hover': {
        borderColor: '$blue'
      }
    },

    'status=Success': {
      borderColor: '$green1'
    },
    'status=Error': {
      borderColor: '$red'
    }
  },

  InnerWrapper: {
    _size: '100%',
    _flex: ['row', 'flex-start', 'center'],
    border: '1px solid $sw3',
    borderRadius: '36px',
    boxSizing: 'content-box',

    'status=Standard': {
      '.ButtonExtended_Wrapper:hover &': {
        borderColor: '$blue'
      }
    },

    'status=Success': {
      borderColor: '$green1'
    },

    'status=Error': {
      borderColor: '$red'
    }
  },

  OuterText: {
    _flex: ['row', 'flex-start', 'flex-start']
  },

  BigTitle: {
    _el: 'p',
    _textStyle: 'bodyMedium',
    color: '$sw1',
    padding: '0 3px 0 6px',

    'status=Standard': {
      '.ButtonExtended_Wrapper:hover &': {
        color: '$blue'
      }
    },
    'status=Success': {
      color: '$green1'
    },

    'status=Error': {
      color: '$red'
    }
  },

  SmallTitle: {
    _el: 'p',
    _textStyle: 'body',
    paddingTop: '2px',

    'status=Standard': {
      '.ButtonExtended_Wrapper:hover &': {
        color: '$blue'
      }
    }
  }
});
