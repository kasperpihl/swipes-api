import { styleSheet } from 'swiss-react';

export default styleSheet('PingList', {
  Wrapper: {
    _size: '100%',
    _flex: ['column'],
  },
  ItemWrapper: {
    overflowY: 'scroll',
    _size: '100%',
  },
});