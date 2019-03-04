import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTaskCheckbox', {
  Wrapper: {
    _size: ['24px', '30px'],
    _flex: 'center',
    flex: 'none',
    cursor: 'pointer',
    disabled: {
      pointerEvents: 'none'
    }
  },
  Checkbox: {
    _size: '20px',
    _flex: ['column', 'center', 'center'],
    border: '1px solid $sw3',
    pointerEvents: 'none',
    borderRadius: '10px',
    '!checked': {
      '.ProjectTaskCheckbox_Wrapper:hover &': {
        border: '1px solid #05A851'
      }
    },
    checked: {
      background: '#05A851',
      border: 'none',
      '.ProjectTaskCheckbox_Wrapper:hover &': {
        opacity: 0.5
      }
    }
  }
});
