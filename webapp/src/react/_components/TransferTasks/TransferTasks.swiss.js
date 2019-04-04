import { styleSheet } from 'swiss-react';

export default styleSheet('TransferTasks', {
  Wrapper: {
    _flex: ['column', 'left', 'top'],
    _size: ['100%', 'auto'],
    backgroundColor: '$green4',
    padding: '16px 6px 12px 6px',

    show: {
      display: 'none'
    }
  },

  Title: {
    _textStyle: 'body',
    fontWeight: '$bold',
    paddingLeft: '6px'
  },

  Subtitle: {
    _textStyle: 'body',
    paddingLeft: '6px'
  }
});
