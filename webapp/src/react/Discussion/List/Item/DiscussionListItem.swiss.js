import { styleSheet } from 'swiss-react';
import LinesEllipsis from 'react-lines-ellipsis';

export default styleSheet('DiscussionListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    borderTop: '1px solid $sw4',
    width: 'auto',
    padding: '10px 0',
    marginLeft: '29px',
    selected: {
      width: '100%',
      background: '$sw4',
      marginLeft: '0',
      marginRight: '0',
      paddingLeft: '30px',
      paddingRight: '30px',
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
  Topic: {
    _truncateString: '',
    _textStyle: 'H3',
    minWidth: 0,
    maxWidth: '180px',
    paddingBottom: '1px',
    flex: 'none'
  },
  Subtitle: {
    _el: LinesEllipsis,
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
    position: 'absolute',
    top: '13px',
    right: '12px',
    color: '$sw2'
  },
  OrganizationName: {
    _textStyle: 'body',
    flex: 'none'
  },
  UnreadCircle: {
    _size: '10px',
    opacity: '0',
    visibility: 'hidden',
    position: 'absolute',
    top: '14px',
    left: '-19px',
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
