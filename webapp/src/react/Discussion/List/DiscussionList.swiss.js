import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussionList', {
  Wrapper: {
    _size: '100%',
    overflowX: 'hidden',
    paddingBottom: '55px',
  },
  EmptyState: {
    _flex: ['column', 'center', 'center'],
    _size: ['100%', '100%'],
    paddingLeft: '25px',
    paddingRight: '25px',
    color: '$sw2',
    textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  Label: {
    paddingBottom: '25px',
  }
});
