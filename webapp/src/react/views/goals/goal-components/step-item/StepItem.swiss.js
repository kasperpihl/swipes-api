import { styleSheet } from 'react-swiss';

export default styleSheet('StepItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    padding: '0 6px',
    '&:hover': {
      background: '$sw4',
    },
    borderTop: '1px solid $sw3',
    '& .public-DraftEditor-content, & .public-DraftEditorPlaceholder-root': {
      padding: '12px 6px 12px 18px',
    },
  },
  AssignWrapper: {
    opacity: 1,
    'noAssignees': {
      opacity: 0,
      '.assign-hover:hover &': {
        opacity: 1,
      }
    }
  },
  DragWrapper: {
    _flex: 'center',
    _size: '36px',
    display: 'none',
    flex: 'none',
    cursor: 'row-resize',
    '& *': {
      cursor: 'row-resize',
    },
    show: {
      display: 'block',
    }
  }
});