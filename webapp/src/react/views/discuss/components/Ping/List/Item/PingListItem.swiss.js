import { styleSheet } from 'swiss-react';

export default styleSheet('PingListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    padding: '6px',
  },
  Message: {
    _flex: ['column', 'left', 'top'],
    _font: ['12px', '18px', 400],
    paddingLeft: '12px',
  },
  Sender: {
    _font: ['12px', '18px', 500],
  },
  Time: {
    _font: ['12px', '18px', 500],
    color: '$sw2',
  },
});