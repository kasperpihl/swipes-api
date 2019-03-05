import { styleSheet } from 'swiss-react';

export default styleSheet('ListMenu', {
  Wrapper: {
    _size: ['250px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)',
    backgroundColor: '$sw5'
  },

  Item: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    _textStyle: 'body',

    '&:hover': {
      backgroundColor: '$green2'
    },

    '&:not(:last-child)': {
      borderBottom: '1px solid $sw4'
    }
  },

  ItemRow: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    _textStyle: 'body',
    padding: '12px',
    userSelect: 'none',

    '&:hover': {
      backgroundColor: '$green2'
    },

    disabled: {
      backgroundColor: '$sw4',

      '&:hover': {
        backgroundColor: '$sw4'
      }
    }
  },

  Title: {
    _el: 'h1',
    _textStyle: 'body',

    disabled: {
      opacity: '0.5'
    }
  },

  Subtitle: {
    _el: 'h3',
    _textStyle: 'caption',
    opacity: '0.5'
  }
});
