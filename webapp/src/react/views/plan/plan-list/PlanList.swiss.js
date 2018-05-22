import { styleSheet } from 'react-swiss';

export default styleSheet('PlanList', {
  Wrapper: {
    _flex: ['column', 'center', 'top'],
  },
  HeaderWrapper: {
    _size: ['100%', 'auto'],
    borderBottom: '1px solid $sw4',
    paddingBottom: '24px',
  },
  Footer: {
    _size: ['100%', '54px'],
    _flex: ['row', 'between', 'center'],
    padding: '9px 12px',
    borderTop: '1px solid $sw3',
  },
});