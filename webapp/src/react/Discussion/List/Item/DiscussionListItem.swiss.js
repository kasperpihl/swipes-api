import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussionListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    width: 'auto',
    height: '36px',
    padding: '6px 15px 6px 12px',
    margin: '0 9px 0 24px',
    userSelect: 'none',
    selected: {
      background: '$green4'
    }
  },
  MiddleWrapper: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    paddingRight: '25px'
  },
  Topic: {
    _truncateString: '',
    _textStyle: 'H3',
    minWidth: 0,
    maxWidth: '180px',
    paddingBottom: '1px',
    flex: 'none'
  },
  Subtitle: {
    _el: 'p',
    _truncateString: '',
    _textStyle: 'body',
    color: '$sw2',
    width: '100%',
    flex: 'none'
  },
  Time: {
    _el: 'span',
    _textStyle: 'caption',
    _flex: ['row', 'center', 'center'],
    flex: 'none',
    // position: 'absolute',
    // top: '9px',
    // right: '25px',
    color: '$sw2'
  },
  TeamName: {
    _textStyle: 'caption',
    flex: 'none'
  },
  UnreadCircle: {
    _size: '10px',
    opacity: '0',
    visibility: 'hidden',
    position: 'absolute',
    top: '10px',
    left: '14px',
    borderRadius: '50%',
    backgroundColor: '$blue',
    unread: {
      opacity: '1',
      visibility: 'visible'
    }
  },
  AttachmentWrapper: {
    marginTop: '5px'
  }
});
