import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussionHeader', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    borderBottom: '1px solid $sw3',
    paddingBottom: '12px',
  },
  TitleWrapper: {
    paddingTop: '3px',
    width: '100%',
    paddingLeft: '12px',
    _flex: ['column',]
  },
  Title: {
    _font: ['16px', '22px', 400],
    cursor: 'text',
    maxWidth: '300px',
    _truncateString: '',
    hasTopic: {
      maxWidth: '396px',
    }
  },
  Subtitle: {
    _font: ['12px', '18px', 400],
    color: '$sw2',
  },
  Actions: {
    paddingTop: '6px',
    _flex: ['row', 'right', 'center'],
    flex: 'none',
    '& > *:not(:last-child)': {
      marginRight: '12px',
    },
  },
  ContextWrapper: {
    borderBottom: '1px solid $sw3',
    padding: '6px 0',
    _flex: ['row', 'left', 'center'],
    width: '100%',
  },
  Label: {
    _font: ['12px', '12px', 500],
    color: '$sw2',
    paddingLeft: '6px',
    paddingRight: '12px',
    flex: 'none',
  },
});
