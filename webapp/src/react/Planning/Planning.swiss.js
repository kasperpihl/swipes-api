import { styleSheet } from 'swiss-react';

export default styleSheet('Planning', {
  ParentWrapper: {
    _flex: ['row', 'left', 'top'],
    width: '100%',
    padding: '0 18px 0 36px'
  },

  HeaderWrapper: {
    _flex: ['column', 'left', 'top'],
    margin: '0 18px 0px 36px',
    borderBottom: '1px solid $sw4'
  },

  LeftSide: {
    height: '100%',
    flex: 'none'
  },
  RightSide: {
    _flex: ['column', 'center', 'center'],
    height: '100%',
    fontSize: '24px',
    width: '100%'
  }
});
