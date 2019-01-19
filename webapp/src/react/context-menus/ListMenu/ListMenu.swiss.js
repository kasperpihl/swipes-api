import { styleSheet } from 'swiss-react';

export default styleSheet('ListMenu', {
  Wrapper: {
    _size: ['250px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)',
    backgroundColor: '$sw5'
  },

  ItemRow: {
    _size: ['100%', '40px'],
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'body',
    padding: '6px',

    '&:hover': {
      backgroundColor: 'rgba($blue60, 0.25)'
    }
  }
});
