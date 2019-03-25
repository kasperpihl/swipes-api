import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningModal', {
  Wrapper: {
    _flex: ['column', 'left', 'top'],
    _size: ['560px', 'calc(100% - 120px)'],
    padding: '0 24px',
    background: '$base'
  },
  TopBar: {
    _flex: ['row', 'left', 'center'],
    height: '60px',
    flex: 'none',
    width: '100%',
    borderBottom: '1px solid $sw3'
  },
  Title: {
    _textStyle: 'H2',
    fontWeight: '$bold',
    '&:not(:first-child)': {
      marginLeft: '12px'
    }
  },
  BottomBar: {
    _flex: ['row', 'between', 'center'],
    width: '100%',
    height: '48px',
    flex: 'none',
    borderTop: '1px solid $sw3'
  },
  TaskCounter: {
    _el: 'span',
    _textStyle: 'body'
  }
});
