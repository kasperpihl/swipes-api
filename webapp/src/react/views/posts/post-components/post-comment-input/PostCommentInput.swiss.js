import { styleSheet } from 'react-swiss';

export default styleSheet({
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
    width: '100%',
    '& .public-DraftEditor-content, & .public-DraftEditorPlaceholder-root': {
      _font: ['15px', '24px', 400],
      color: '$sw1',
      padding: '6px',
      paddingLeft: '12px',
    },
    '& .public-DraftEditorPlaceholder-root': {
      color: '$sw2',
    },
  },
  Actions: {
    _flex: ['column', 'center', 'top'],
  },
  Attachments: {
    marginTop: '6px',
  },
  InputWrapper: {
    _flex: ['row', 'center', 'center'],
    width: '100%',
    
  },
});