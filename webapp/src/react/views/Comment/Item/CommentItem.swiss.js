import { styleSheet } from 'swiss-react';
import TimeAgo from 'swipes-core-js/components/TimeAgo';

export default styleSheet('CommentItem', {
  Container: {
    _flex: ['row', 'left', 'top'],
    paddingTop: '12px',
    width: '100%',
  },
  Picture: {
    flex: 'none',
    marginLeft: '3px',
    _size: '36px',
  },
  Content: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  Actions: {
    _flex: ['column', 'center', 'top'],
  },
  Name: {
    _textStyle: 'caption',
  },
  Message: {
    _textStyle: 'body',
  },
  Attachments: {
    marginTop: '6px',
  },
});
