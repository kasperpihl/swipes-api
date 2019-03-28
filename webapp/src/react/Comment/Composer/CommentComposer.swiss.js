import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';
import Textarea from 'react-textarea-autosize';

export default styleSheet('CommentComposer', {
  Container: {
    _flex: ['row', 'left', 'top'],
    width: '100%'
  },
  Picture: {
    _size: ['54px', '30px'],
    _flex: ['row', 'center', 'top'],
    flex: 'none',
    marginTop: '9px',

  },
  Content: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    '& .public-DraftEditor-content, & .public-DraftEditorPlaceholder-root': {
      _font: ['13px', '18px', '$regular'],
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
  ButtonWrapper: {
    _flex: ['row', 'left', 'center'],
    width: 'auto',
    flex: 'none',
    height: '55px'
  },

  EmojiPickerWrapper: {
    position: 'absolute',
    top: '-360px',
    right: '0',
    opacity: '0',
    visibility: 'hidden',
    transition: '.1s ease',

    open: {
      opacity: '1',
      visibility: 'visible',
      transition: '.1s ease'
    }
  },

  Textarea: {
    _el: Textarea,
    border: 'none',
    width: '100%',
    margin: '6px 0',
    padding: '12px 0',
    resize: 'none',
    _textStyle: 'body',
    '&:focus': {
      outline: 'none'
    }
  },
  InputWrapper: {
    _flex: ['row', 'center', 'center'],
    width: '100%'
  },
  TypingRow: {
    _flex: ['row', 'left', 'top'],
    width: '100%',
    '& .gl-button': {
      marginTop: '12px'
    }
  },
  SubmitButton: {
    _el: Button,
    display: 'none',
    shown: {
      display: 'inline-flex'
    }
  }
});
