import { styleSheet } from 'swiss-react';
import TimeAgo from 'swipes-core-js/components/TimeAgo';
import Button from 'src/react/components/button/Button';
export default styleSheet('DiscussionListItem', {
  Wrapper: {
    borderBottom: '1px solid $sw3',
    width: '100%',
    _flex: ['row', 'left', 'center'],
    '&:hover': {
      background: '$sw4',
    },
    unread: {
      background: 'rgba($blue, 0.15)',
      '&:hover': {
        background: 'rgba($blue, 0.2)',
      },
    },
  },
  LeftWrapper: {
    flex: 'none',
    padding: '6px',
    paddingLeft: '12px',
  },

  MiddleWrapper: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    padding: '6px',
    paddingRight: '54px',
  },
  RightWrapper: {
    position: 'absolute',
    width: 'auto',
    height: '100%',
    top: 0,
    right: 0,
    paddingTop: '15px',
    _flex: ['column', 'right', 'top'],
  },
  Topic: {
    _font: ['15px', '24px', 400],
    minWidth: 0,
    maxWidth: '370px',
    _truncateString: '',
  },
  Subtitle: {
    _font: ['12px', '18px', 300],
    color: '$sw2',
    minWidth: 0,
    maxWidth: '400px',
    _truncateString: '',
  },
  Time: {
    _el: 'span',
    _font: ['12px', '12px', 400],
    color: '$sw2',
    paddingRight: '6px',
  },
  Button: {
    _el: Button,
    visibility: 'hidden',
    '.Button-hover:hover &': {
      visibility: 'visible',
    },
  }
});