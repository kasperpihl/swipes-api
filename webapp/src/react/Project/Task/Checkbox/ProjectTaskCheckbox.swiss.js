import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTaskCheckbox', {
  Wrapper: {
    _size: ['24px', '24px'],
    _flex: 'center',
    marginTop: '1px',
    flex: 'none',
    cursor: 'pointer',
    userSelect: 'none'
  },
  Checkbox: {
    _size: '16px',
    _flex: ['column', 'center', 'center'],
    border: '1px solid $sw3',
    pointerEvents: 'none',
    borderRadius: '8px',
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
