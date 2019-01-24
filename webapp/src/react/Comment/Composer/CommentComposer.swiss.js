import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('CommentComposer', {
  Container: {
    _flex: ['row', 'left', 'top'],
    width: '100%'
  },
  Picture: {
    flex: 'none',
    marginTop: '9px',
    _size: '36px'
  },
  Content: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    '& .public-DraftEditor-content, & .public-DraftEditorPlaceholder-root': {
      _font: ['13px', '18px', 400],
      color: '$sw1',
      padding: '18px 12px'
    },
    '& .public-DraftEditorPlaceholder-root': {
      color: '$sw2',
      _font: ['13px', '18px']
    }
  },
  Actions: {
    _flex: ['column', 'center', 'top']
  },
  Attachments: {
    _flex: ['row', 'left', 'top'],
    width: '100%',
    padding: '6px 12px',
    paddingTop: '0px',
    '& > *:not(:last-child)': {
      marginRight: '6px'
    }
  },
  InputWrapper: {
    _flex: ['row', 'center', 'center'],
    width: '100%'
  },
  TypingRow: {
    _flex: ['row', 'left', 'center'],
    paddingRight: '3px',
    width: '100%',
    '& .gl-button': {
      marginTop: '12px'
    }
  },
  SubmitButton: {
    _el: Button.Rounded,
    display: 'none',
    shown: {
      display: 'inline-flex'
    }
  }
});
