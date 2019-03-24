import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningModal', {
  Wrapper: {
    _flex: ['column', 'left', 'top'],
    _size: ['560px', 'calc(100% - 120px)'],
    paddingLeft: '30px',
    background: '$base'
  },
  TopBar: {
    _flex: ['row', 'left', 'center'],
    height: '60px',
    flex: 'none',
    width: 'calc(100% - 24px)',
    borderBottom: '1px solid $sw3'
  },
  Title: {
    _textStyle: 'H2',
    '&:not(:first-child)': {
      marginLeft: '12px'
    }
  },
  BottomBar: {
    _flex: ['row', 'between', 'center'],
    width: 'calc(100% - 24px)',
    height: '48px',
    flex: 'none',
    borderTop: '1px solid $sw3'
  },
  TaskCounter: {
    _el: 'span',
    _textStyle: 'body'
  }
});
