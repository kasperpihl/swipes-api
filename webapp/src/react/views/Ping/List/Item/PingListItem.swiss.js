import { styleSheet } from 'swiss-react';
import TimeAgo from 'swipes-core-js/components/TimeAgo';

export default styleSheet('PingListItem', {
  Wrapper: {
    width: '100%',
    _flex: ['row', 'left', 'top'],
    paddingTop: '12px',
    paddingLeft: '12px',
    paddingRight: '3px',
  },
  MessageWrapper: {
    _flex: ['column', 'left', 'top'],
    paddingLeft: '12px',
    width: '100%',
  },
  Message: {
    _el: 'div',
    _font: ['14px', '18px', 400],
  },
  Sender: {
    _font: ['12px', '18px', 500],
  },
  Time: {
    _el: TimeAgo,
    _font: ['12px', '18px', 500],
    color: '$sw2',
  },
  ButtonWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '60px',
    height: '30px',
    _flex: ['row', 'left', 'center'],
    visibility: 'hidden',
    '.ButtonWrapper-hover:hover &': {
      visibility: 'visible',
    },
  },
});