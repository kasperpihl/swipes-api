import { styleSheet } from 'swiss-react';
import LinesEllipsis from 'react-lines-ellipsis';

export default styleSheet('DiscussionListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    borderTop: '1px solid $sw4',
    width: 'auto',
    padding: '10px 0',
    marginLeft: '25px',
    marginRight: '25px',
    selected: {
      width: '100%',
      background: '$sw4',
      marginLeft: '0',
      marginRight: '0',
      paddingLeft: '25px',
      paddingRight: '25px',
      borderBottom: '1px solid $sw4'
    },
    '&:first-child': {
      borderTop: 'none'
    },
    siblingToSelectedItem: {
      borderTop: 'none'
    }
  },
  MiddleWrapper: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    paddingRight: '25px'
  },
  RightWrapper: {
    _flex: 'none',
    whiteSpace: 'nowrap'
  },
  Topic: {
    _truncateString: '',
    _textStyle: 'item',
    minWidth: 0,
    maxWidth: '180px',
    paddingBottom: '1px',
    'viewWidth>=1080': {
      maxWidth: '210px'
    }
  },
  Subtitle: {
    _el: LinesEllipsis,
    _textStyle: 'bodySubtitle',
    width: '100%'
  },
  Time: {
    _el: 'span',
    _textStyle: 'caption'
  },
  UnreadCircle: {
    display: 'none',
    position: 'absolute',
    top: '6px',
    left: '-12px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '$blue',
    unread: {
      display: 'block'
    }
  },
  AttachmentWrapper: {
    marginTop: '5px'
  }
});
