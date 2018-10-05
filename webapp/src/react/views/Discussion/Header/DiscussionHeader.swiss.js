import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussionHeader', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    borderBottom: '1px solid $sw3',
    paddingBottom: '12px',
  },
  SplitImageWrapper: {
    flex: 'none',
  },
  TitleWrapper: {
    paddingTop: '3px',
    width: '100%',
    paddingLeft: '12px',
    _flex: ['column'],
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
    _flex: ['row', 'left', 'center'],
    borderBottom: '1px solid $sw3',
    padding: '6px 0',
    width: '100%',
  },
  FollowerLabel: {
    _textStyle: 'item',
    paddingRight: '12px',
  },
  Label: {
    _font: ['12px', '12px', 500],
    color: '$sw2',
    paddingLeft: '6px',
    paddingRight: '12px',
    flex: 'none',
  },
});
