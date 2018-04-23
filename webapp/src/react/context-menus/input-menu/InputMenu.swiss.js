import { styleSheet } from 'react-swiss';

export default styleSheet({
  Wrapper: {
    _size: ['auto', '90px'],
    _flex: ['row', 'left', 'center'],
    background: 'white',
    borderRadius: '6px',
    boxShadow: '0 1px 20px 3px rgba(5,57,128,0.1)',
    position: 'relative',
    paddingRight: '21px',
  },
  Input: {
    _size: ['274px', 'auto'],
    _font: ['12px', '15px'],
    borderBottom: '1px solid $sw4',
    marginLeft: '36px',
    marginRight: '45px',
    padding: '9px 0',
    '&::-webkit-input-placeholder': {
      color: '$sw2',
    },
  }
});