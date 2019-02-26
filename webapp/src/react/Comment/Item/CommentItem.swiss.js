import { styleSheet } from 'swiss-react';

export default styleSheet('CommentItem', {
  Container: {
    _flex: ['row', 'left', 'center'],
    paddingTop: '12px',
    width: '100%'
  },
  Picture: {
    _size: '36px',
    flex: 'none',
    marginLeft: '6px',
    marginBottom: 'auto'
  },
  Content: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    paddingLeft: '12px',
    paddingRight: '12px'
  },
  Actions: {
    _flex: ['column', 'center', 'top']
  },
  Name: {
    _textStyle: 'body',
    fontWeight: '500'
  },
  Message: {
    _textStyle: 'body'
  },
  Attachments: {
    marginTop: '6px'
  }
});
