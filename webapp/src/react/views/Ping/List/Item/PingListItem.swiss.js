import { styleSheet } from 'swiss-react';
import TimeAgo from 'swipes-core-js/components/TimeAgo';

export default styleSheet('PingListItem', {
  Wrapper: {
    width: '100%',
    _flex: ['row', 'left', 'center'],
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
    paddingLeft: '12px',
    _font: ['13px', '18px', 400],
  },
  Sender: {
    _font: ['13px', '18px', 500],
  },
  Time: {
    _el: TimeAgo,
    _font: ['12px', '18px', 500],
    color: '$sw2',
  },
  ButtonWrapper: {
    position: 'absolute',
    right: 0,
    background: '$sw5',
    top: 0,
    width: '72px',
    height: '42px',
    padding: '6px',
    _flex: ['row', 'left', 'center'],
    visibility: 'hidden',
    '.ButtonWrapper-hover:hover &': {
      visibility: 'visible',
    },
  },
});