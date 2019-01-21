import { styleSheet } from 'swiss-react';

export default styleSheet('SideNote', {
  Wrapper: {
    _size: ['100%'],
    _flex: ['column', 'center', 'top']
  },

  Header: {
    _size: ['100%', 'auto'],
    borderBottom: '1px solid $sw3'
  }
});
