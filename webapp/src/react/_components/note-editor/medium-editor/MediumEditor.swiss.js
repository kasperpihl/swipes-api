import { styleSheet } from 'swiss-react';

export default styleSheet('MediumEditor', {
  Wrapper: {
    _size: '100%',
    '& .DraftEditor-root': {
      maxWidth: '650px',
      margin: '0 auto',
      position: 'relative',
      textAlign: 'initial',
    },
    '& .DraftEditor-root *': {
      cursor: 'text',
    },

    '& .DraftEditor-editorContainer': {
      height: 'inherit',
      position: 'relative',
      textAlign: 'initial',
      zIndex: 1,
    },

    '& .public-DraftEditor-content': {
      _font: ['15px', '24px'],
      width: '100%',
      height: 'inherit',
      minHeight: '49vh',
      textAlign: 'initial',
      padding: '45px 0',
      paddingTop: '21px',
    },
    '& .public-DraftEditor-content[contenteditable="true"]': {
      WebkitUserModify: 'read-write-plaintext-only',
    },
    '& h1': {
      _font: ['24px', '42px', 400],
    },
    '& h2': {
      _font: ['18px', '57px', 400],
    },
    '& ul': {
      display: 'block',
      listStyleType: 'disc',
      margin: '3px 0',
      paddingLeft: '3px',
    },
    '& ol': {
      paddingLeft: '3px',
    },

    '& .public-DraftEditorPlaceholder-root': {
      _font: ['15px', '24px'],
      position: 'absolute',
      zIndex: 0,
      left: '1px',
      top: '21px',
    },

    '& ::selection': {
      background: '$yellow',
    },
  }
});
