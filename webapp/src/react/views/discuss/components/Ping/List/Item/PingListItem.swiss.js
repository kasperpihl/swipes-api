import { styleSheet } from 'swiss-react';

export default styleSheet('PingListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    paddingTop: '12px',
    paddingLeft: '12px',
    paddingRight: '3px',
  },
  Message: {
    width: '100%',
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
  ButtonWrapper: {
    _flex: ['row', 'left', 'center'],
    flex: 'none',
    visibility: 'hidden',
    '.ButtonWrapper-hover:hover &': {
      visibility: 'visible',
    },
  },
});