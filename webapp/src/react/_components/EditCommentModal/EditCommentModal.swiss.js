import { styleSheet } from 'swiss-react';

export default styleSheet('EditCommentModal', {
  Wrapper: {
    _size: ['550px', 'auto'],
    _flex: ['column', 'left', 'top'],
    boxShadow: '0 1px 20px 3px rgba(0, 37, 82, .3)',
    padding: '24px',
    background: '$base',
    margin: '0 auto'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'H1'
  }
});
