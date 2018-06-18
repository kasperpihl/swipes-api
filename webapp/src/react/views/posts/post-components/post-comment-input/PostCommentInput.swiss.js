import { styleSheet } from 'swiss-react';

export default styleSheet('PostCommentInput', {
  Container: {
    _flex: ['row', 'left', 'top'],
    marginTop: '12px',
    width: '100%',
  },
  Picture: {
    flex: 'none',
    marginLeft: '3px',
    _size: '36px',
  },
  Content: {
    _flex: ['column', 'left', 'top'],
    marginLeft: '12px',
    borderRadius: '3px',
    border: '1px solid $sw3',
    width: '100%',
    '& .public-DraftEditor-content, & .public-DraftEditorPlaceholder-root': {
      _font: ['12px', '18px', 400],
      color: '$sw1',
      padding: '9px',
      paddingLeft: '12px',
    },
    '& .public-DraftEditorPlaceholder-root': {
      color: '$sw2',
      _font: ['12px', '18px'],
      fontStyle: 'italic',
    },
  },
  Actions: {
    _flex: ['column', 'center', 'top'],
  },
  Attachments: {
    _flex: ['row', 'left', 'top'],
    width: '100%',
    padding: '6px 12px',
    paddingTop: '0px',
    '& > *:not(:last-child)': {
      marginRight: '6px',
    },
  },
  InputWrapper: {
    _flex: ['row', 'center', 'center'],
    width: '100%',
  },
  TypingRow: {
    _flex: ['row', 'left', 'top'],
    paddingRight: '3px',
    width: '100%',
    '& .gl-button': {
      marginTop: '3px',
    }
  },
  SubmitButton: {
    display: 'none !important',
    shown: {
      display: 'block !important',
    },
  },
});