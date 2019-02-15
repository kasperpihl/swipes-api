import { styleSheet } from 'swiss-react';

export default styleSheet('PlanListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    padding: '12px'
  },
  TextWrapper: {
    _flex: ['column', 'left', 'between']
  },
  Title: {
    _textStyle: 'body'
  },
  Subtitle: {
    _textStyle: 'body'
  },
  TaskCounter: {
    _textStyle: 'body'
  }
});
