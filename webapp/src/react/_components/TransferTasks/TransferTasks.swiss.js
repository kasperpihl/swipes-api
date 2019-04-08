import { styleSheet } from 'swiss-react';

export default styleSheet('TransferTasks', {
  Wrapper: {
    _size: ['100%', 'auto'],
    display: 'none',
    backgroundColor: '$green4',
    padding: '16px 12px 12px 6px',

    show: {
      _flex: ['column', 'left', 'top']
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
