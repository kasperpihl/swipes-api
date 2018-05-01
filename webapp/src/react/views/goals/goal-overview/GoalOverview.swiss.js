import { styleSheet } from 'react-swiss';

export default styleSheet({
  Footer: {
    _size: ['100%', '54px'],
    borderTop: '1px solid $sw3',
    _flex: ['row', 'left', 'center'],
    padding: '9px 12px',
  },
  Header: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
  },
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
    paddingBottom: '30px',
  },
  Side: {
    right: {
      width: '288px',
      flex: 'none',
      marginLeft: '30px',
      'viewWidth>825': {
        marginLeft: '54px',
      }
    },
  }
});