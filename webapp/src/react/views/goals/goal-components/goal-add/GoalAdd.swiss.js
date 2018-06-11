import { styleSheet } from 'swiss-react';

export default styleSheet('GoalAdd', {
  Wrapper: {
    marginTop: '3px',
    _flex: ['row', 'left', 'center'],
    paddingLeft: '12px',
  },
  Indicator: {
    flex: 'none',
    _size: '12px',
    borderRadius: '6px',
    border: '2px solid $sw2',
    isFocused: {
      border: '2px solid $yellow',
      background: '$yellow',
    },
    hasContent: {
      border: '1px solid $yellow',
      background: '$yellow',
    }
  },
  InputWrapper: {
    _flex: ['column'],
    width: '100%',
    padding: '6px 0',
    '& .public-DraftEditor-content, & .public-DraftEditorPlaceholder-root': {
      padding: '12px',
    },
  },
  AssigneesWrapper: {
    flex: 'none',
    opacity: 0,
    paddingRight: '6px',
    hasAssignees: {
      opacity: 1,
    },
    isFocused: {
      opacity: 1,
    },
    hasContent: {
      opacity: 1,
    }
  },
  SubmitWrapper: {
    _size: '36px',
    flex: 'none',
    '!hasContent': {
      display: 'none',
    }
  },
});