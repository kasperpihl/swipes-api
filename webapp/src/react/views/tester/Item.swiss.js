import { styleSheet } from 'swiss-react';

export default styleSheet('Item', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    marginLeft: ({ indent }) => `${indent * 32}px`,
  },
  Input: {
    _el: 'input',
    _font: ['15px', '24px', 400],
    width: '100%',
    '&:focus': {
      // border: '1px solid red',
    }
  },
  CheckboxWrapper: {
    _size: ['36px', '24px'],
    _flex: 'center',
    flex: 'none',
  },
  Checkbox: {
    _size: '18px',
    border: '2px solid $sw3',
    borderRadius: '3px',
  },
});